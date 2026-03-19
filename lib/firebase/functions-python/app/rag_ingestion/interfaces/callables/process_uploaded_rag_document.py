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
from app.rag_ingestion.infrastructure.firebase.storage_reader import (
    FirebaseStorageTextReader,
)


_storage_text_reader: FirebaseStorageTextReader | None = None


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


def _build_use_case() -> ProcessUploadedDocumentUseCase:
    return ProcessUploadedDocumentUseCase(
        parser=PassthroughRagParser(),
        chunker=SimpleParagraphChunker(),
        taxonomy_classifier=SimpleRagTaxonomyClassifier(),
        embedder=DeterministicRagEmbedder(),
        document_repository=FirebaseRagDocumentRepository(),
    )


def _get_storage_text_reader() -> FirebaseStorageTextReader:
    global _storage_text_reader
    if _storage_text_reader is None:
        _storage_text_reader = FirebaseStorageTextReader()
    return _storage_text_reader


def _resolve_raw_text(data: dict[str, Any]) -> str:
    raw_text = _optional_string(data, "rawText")
    if raw_text is not None:
        return raw_text

    storage_path = _required_string(data, "storagePath")
    return _get_storage_text_reader().read_text(storage_path)


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
