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
from app.rag_ingestion.infrastructure.openai.embedder import OpenAiEmbedder

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
    """Always True — Document AI config uses hardcoded defaults (project 65970295651).

    Env vars still override if present but are no longer required.
    """
    return True


def _build_use_case() -> ProcessUploadedDocumentUseCase:
    storage_reader = _get_storage_reader()

    # ── OCR-only mode ──────────────────────────────────────────────────────
    # Step 1: confirm Document AI OCR Extractor works end-to-end.
    # Classifier/Splitter processors are intentionally skipped until OCR is
    # verified in production.  Use SimpleRagTaxonomyClassifier instead.
    from app.config.settings import load_document_ai_settings

    try:
        doc_ai_settings = load_document_ai_settings()
        logger.info(
            "Document AI OCR-only mode — project: %s, location: %s, "
            "OCR Extractor: %s  (classifier/splitter SKIPPED)",
            doc_ai_settings.project_id,
            doc_ai_settings.location,
            doc_ai_settings.ocr_extractor_processor_id,
        )
        parser = DocumentAiRagParser(doc_ai_settings, storage_reader)
    except Exception as error:
        logger.warning(
            "Document AI unavailable (%s); falling back to passthrough parser.", error
        )
        parser = PassthroughRagParser()

    # Intentionally use simple classifier — skip Document AI Classifier until
    # OCR Extractor is confirmed working in production.
    taxonomy_classifier = SimpleRagTaxonomyClassifier()

    # Use OpenAI embedder when OPENAI_API_KEY is available; fall back to deterministic scaffold.
    embedder: DeterministicRagEmbedder | OpenAiEmbedder
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if openai_api_key:
        from app.config.settings import OpenAiSettings

        openai_settings = OpenAiSettings(
            api_key=openai_api_key,
            model=os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small"),
            dimensions=int(os.getenv("OPENAI_EMBEDDING_DIMENSIONS", "1536")),
            max_batch_size=int(os.getenv("OPENAI_EMBEDDING_BATCH_SIZE", "20")),
        )
        embedder = OpenAiEmbedder(openai_settings)
        logger.info("Using OpenAI embedder (model=%s, dims=%d)", openai_settings.model, openai_settings.dimensions)
    else:
        embedder = DeterministicRagEmbedder()
        logger.info("OPENAI_API_KEY not set — using deterministic scaffold embedder (4 dims)")

    return ProcessUploadedDocumentUseCase(
        parser=parser,
        chunker=SimpleParagraphChunker(),
        taxonomy_classifier=taxonomy_classifier,
        embedder=embedder,
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
