"""
HTTPS Callable — handle_parse_document：觸發 Document AI 解析。

Schema validation (Rule 4) is performed via ParseDocumentRequest.from_raw()
before any application-layer call.  All pipeline orchestration is delegated
to the parse_document_pipeline use case.
"""

from __future__ import annotations

import logging

from firebase_functions import https_fn

from application.services.document_pipeline import get_document_status_gateway
from application.use_cases.parse_document_pipeline import ParseDocumentCommand, execute_parse_document
from core.storage_uri import parse_gs_uri
from interface.schemas.parse_document import ParseDocumentRequest

logger = logging.getLogger(__name__)


def handle_parse_document(req: https_fn.CallableRequest) -> dict:
    """
    HTTPS Callable：主動觸發單一文件的 Document AI 解析。

    All external input is validated through ParseDocumentRequest before
    reaching the application layer (Rule 4).
    """
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

    status_gateway = get_document_status_gateway()
    try:
        execute_parse_document(
            ParseDocumentCommand(
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
            )
        )
    except https_fn.HttpsError:
        raise
    except Exception as exc:
        logger.exception("parse_document failed for %s: %s", schema.doc_id, exc)
        status_gateway.record_error(
            schema.doc_id,
            str(exc)[:200],
            account_id=schema.account_id,
        )

    return {
        "account_scope": schema.account_id,
        "doc_id": schema.doc_id,
        "status": "processing",
    }
