"""
HTTPS Callable — handle_parse_document：觸發 Document AI 解析。

Schema validation (Rule 4) is performed via ParseDocumentRequest.from_raw()
before any application-layer call.  All pipeline orchestration is delegated
to the parse_document_pipeline use case.
"""

from __future__ import annotations

import logging

from firebase_functions import https_fn

from application.use_cases.parse_document_command import execute_parse_document_command
from application.use_cases.parse_document_pipeline import ParseDocumentCommand
from core.auth_errors import AuthorizationError, UnauthenticatedError
from core.storage_uri import parse_gs_uri
from interface.handlers._https_helpers import _extract_auth_uid
from interface.schemas.parse_document import ParseDocumentRequest

logger = logging.getLogger(__name__)


def handle_parse_document(req: https_fn.CallableRequest) -> dict:
    """
    HTTPS Callable：主動觸發單一文件的 Document AI 解析。

    All external input is validated through ParseDocumentRequest before
    reaching the application layer (Rule 4).
    """
    actor_id = _extract_auth_uid(req)
    try:
        schema = ParseDocumentRequest.from_raw(req.data or {})
    except ValueError as exc:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            str(exc),
        ) from exc

    try:
        bucket_name, object_path = parse_gs_uri(schema.gcs_uri)
    except ValueError as exc:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            str(exc),
        ) from exc

    logger.info("parse_document callable: %s → doc_id=%s", schema.gcs_uri, schema.doc_id)

    try:
        execute_parse_document_command(
            actor_id=actor_id,
            cmd=ParseDocumentCommand(
                doc_id=schema.doc_id,
                gcs_uri=schema.gcs_uri,
                bucket_name=bucket_name,
                object_path=object_path,
                filename=schema.filename,
                size_bytes=schema.size_bytes,
                mime_type=schema.mime_type,
                account_id=schema.account_id,
                workspace_id=schema.workspace_id,
                parser=schema.parser,
                run_rag=schema.run_rag,
            ),
        )
    except UnauthenticatedError as exc:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.UNAUTHENTICATED,
            str(exc),
        ) from exc
    except AuthorizationError as exc:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.PERMISSION_DENIED,
            str(exc),
        ) from exc
    except ValueError as exc:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            str(exc),
        ) from exc
    except RuntimeError as exc:
        logger.exception("parse_document failed for %s: %s", schema.doc_id, exc)
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INTERNAL,
            "parse_document 失敗",
        ) from exc
    except Exception as exc:
        logger.exception("parse_document failed for %s: %s", schema.doc_id, exc)
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INTERNAL,
            "parse_document 失敗",
        ) from exc

    return {
        "account_scope": schema.account_id,
        "doc_id": schema.doc_id,
        "status": "processing",
    }
