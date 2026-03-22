import base64
import binascii
from typing import Any

from firebase_functions import https_fn

from app.bootstrap.firebase import ensure_firebase_app
from app.config.settings import MissingEnvironmentVariableError, load_document_ai_settings
from app.document_ai.application.use_cases.process_document_with_ai import (
    ProcessDocumentWithAiUseCase,
)
from app.document_ai.domain.entities import DocumentAiProcessCommand
from app.document_ai.infrastructure.firebase.audit_log_repository import (
    FirebaseDocumentAiAuditLogRepository,
)
from app.document_ai.infrastructure.google.document_ai_processor import (
    GoogleCloudDocumentAiProcessor,
)


def _required_string(data: dict[str, Any], key: str) -> str:
    value = data.get(key)
    if not isinstance(value, str) or not value.strip():
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message=f"{key} must be a non-empty string.",
        )
    return value.strip()


def _optional_string(data: dict[str, Any], key: str, default_value: str) -> str:
    value = data.get(key)
    if value is None:
        return default_value
    if not isinstance(value, str) or not value.strip():
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message=f"{key} must be a non-empty string when provided.",
        )
    return value.strip()


def handle_process_document_with_ai(req: https_fn.CallableRequest):
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

    workspace_id = _required_string(data, "workspaceId")
    file_name = _required_string(data, "fileName")
    mime_type = _optional_string(data, "mimeType", "application/pdf")
    content_base64 = _required_string(data, "contentBase64")

    try:
        content_bytes = base64.b64decode(content_base64, validate=True)
    except binascii.Error as error:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message="contentBase64 must be valid base64 data.",
        ) from error

    try:
        settings = load_document_ai_settings()
    except MissingEnvironmentVariableError as error:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
            message=str(error),
        ) from error
    use_case = ProcessDocumentWithAiUseCase(
        processor=GoogleCloudDocumentAiProcessor(settings),
        audit_log_repository=FirebaseDocumentAiAuditLogRepository(),
    )

    result = use_case.execute(
        DocumentAiProcessCommand(
            workspace_id=workspace_id,
            file_name=file_name,
            mime_type=mime_type,
            content_bytes=content_bytes,
        )
    )

    return {
        "text": result.text,
        "pageCount": result.page_count,
    }
