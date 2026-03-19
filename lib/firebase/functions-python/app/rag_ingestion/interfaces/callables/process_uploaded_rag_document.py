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
from app.rag_ingestion.infrastructure.firebase.document_repository import (
    FirebaseRagDocumentRepository,
)


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


def handle_process_uploaded_rag_document(req: https_fn.CallableRequest):
    ensure_firebase_app()

    if req.data is None:
        data: dict[str, Any] = {}
    elif isinstance(req.data, dict):
        data = req.data
    else:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message="Request payload must be an object.",
        )

    use_case = ProcessUploadedDocumentUseCase(
        parser=PassthroughRagParser(),
        chunker=SimpleParagraphChunker(),
        embedder=DeterministicRagEmbedder(),
        document_repository=FirebaseRagDocumentRepository(),
    )

    result = use_case.execute(
        ProcessUploadedDocumentCommand(
            document_id=_required_string(data, "documentId"),
            tenant_id=_required_string(data, "tenantId"),
            workspace_id=_required_string(data, "workspaceId"),
            title=_required_string(data, "title"),
            source_file_name=_required_string(data, "sourceFileName"),
            mime_type=_required_string(data, "mimeType"),
            storage_path=_required_string(data, "storagePath"),
            raw_text=_required_string(data, "rawText"),
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
