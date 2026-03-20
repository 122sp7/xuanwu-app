import logging
import os
from typing import Any

from firebase_functions import https_fn

from app.bootstrap.firebase import ensure_firebase_app
from app.rag_ingestion.application.use_cases.process_uploaded_document import (
    ProcessUploadedDocumentUseCase,
)
from app.rag_ingestion.domain.entities import ProcessUploadedDocumentCommand
from app.rag_ingestion.infrastructure.default.chunker import SimpleParagraphChunker
from app.rag_ingestion.infrastructure.default.embedder import DeterministicRagEmbedder
from app.rag_ingestion.infrastructure.default.parser import PassthroughRagParser
from app.rag_ingestion.infrastructure.default.taxonomy_classifier import (
    SimpleRagTaxonomyClassifier,
)
from app.rag_ingestion.infrastructure.firebase.document_repository import (
    FirebaseRagDocumentRepository,
)
from app.rag_ingestion.infrastructure.firebase.processed_text_writer import (
    ProcessedTextWriter,
)
from app.rag_ingestion.infrastructure.firebase.storage_reader import FirebaseStorageReader
from app.rag_ingestion.infrastructure.google.document_ai_parser import DocumentAiRagParser
from app.rag_ingestion.infrastructure.google.document_ai_taxonomy_classifier import (
    DocumentAiTaxonomyClassifier,
)

logger = logging.getLogger(__name__)

_storage_reader: FirebaseStorageReader | None = None


def _get_storage_reader() -> FirebaseStorageReader:
    global _storage_reader
    if _storage_reader is None:
        _storage_reader = FirebaseStorageReader()
    return _storage_reader


def _required_string(data: dict[str, Any], key: str) -> str:
    value = data.get(key)
    if not isinstance(value, str) or not value.strip():
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message=f"{key} must be a non-empty string.",
        )
    return value.strip()


def _optional_string(data: dict[str, Any], key: str) -> str | None:
    value = data.get(key)
    if value is None:
        return None
    if not isinstance(value, str):
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message=f"{key} must be a string when provided.",
        )
    normalized = value.strip()
    return normalized or None


def _is_document_ai_enabled() -> bool:
    """Return True when at least DOCUMENTAI_PROJECT_ID is configured."""
    return bool(os.getenv("DOCUMENTAI_PROJECT_ID"))


def _build_use_case() -> ProcessUploadedDocumentUseCase:
    storage_reader = _get_storage_reader()

    if _is_document_ai_enabled():
        from app.config.settings import load_settings

        try:
            settings = load_settings()
            logger.info(
                "Document AI enabled — OCR Extractor: %s, Classifier: %s",
                settings.document_ai.ocr_extractor_processor_id,
                settings.document_ai.ocr_classifier_processor_id,
            )
            parser = DocumentAiRagParser(settings.document_ai, storage_reader)
            taxonomy_classifier = DocumentAiTaxonomyClassifier(settings.document_ai)
        except Exception as error:
            logger.warning(
                "Document AI unavailable (%s); falling back to passthrough parser.", error
            )
            parser = PassthroughRagParser()
            taxonomy_classifier = SimpleRagTaxonomyClassifier()
    else:
        parser = PassthroughRagParser()
        taxonomy_classifier = SimpleRagTaxonomyClassifier()

    return ProcessUploadedDocumentUseCase(
        parser=parser,
        chunker=SimpleParagraphChunker(),
        taxonomy_classifier=taxonomy_classifier,
        embedder=DeterministicRagEmbedder(),
        document_repository=FirebaseRagDocumentRepository(),
        text_writer=ProcessedTextWriter(),
    )


def _resolve_raw_text(data: dict[str, Any]) -> str:
    """Return raw_text from the payload or fall back to reading the Storage blob as text.

    When Document AI is enabled the parser reads binary directly from Storage, so
    raw_text is not strictly required — return an empty string in that case.
    """
    raw_text = _optional_string(data, "rawText")
    if raw_text is not None:
        return raw_text

    if _is_document_ai_enabled():
        # DocumentAiRagParser will read binary bytes from storagePath itself.
        return ""

    storage_path = _optional_string(data, "storagePath")
    if storage_path is None:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message="storagePath is required when rawText is omitted.",
        )

    return _get_storage_reader().read_text(storage_path)


def process_uploaded_rag_document_data(data: dict[str, Any]) -> dict[str, Any]:
    ensure_firebase_app()

    use_case = _build_use_case()

    result = use_case.execute(
        ProcessUploadedDocumentCommand(
            document_id=_required_string(data, "documentId"),
            organization_id=_required_string(data, "organizationId"),
            workspace_id=_required_string(data, "workspaceId"),
            title=_required_string(data, "title"),
            source_file_name=_required_string(data, "sourceFileName"),
            mime_type=_required_string(data, "mimeType"),
            storage_path=_required_string(data, "storagePath"),
            raw_text=_resolve_raw_text(data),
            checksum=_optional_string(data, "checksum"),
            taxonomy_hint=_optional_string(data, "taxonomyHint"),
        )
    )

    return {
        "documentId": result.document_id,
        "status": result.status,
        "taxonomy": result.taxonomy,
        "chunkCount": result.chunk_count,
    }


def handle_process_uploaded_rag_document(req: https_fn.CallableRequest):
    if req.data is None:
        data: dict[str, Any] = {}
    elif isinstance(req.data, dict):
        data = req.data
    else:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message="Request payload must be an object.",
        )

    return process_uploaded_rag_document_data(data)
