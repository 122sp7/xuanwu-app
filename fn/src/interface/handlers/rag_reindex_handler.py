"""
HTTPS Callable — handle_rag_reindex_document：手動觸發文件 RAG 重新索引。

Schema validation (Rule 4) is performed via RagReindexRequest.from_raw()
before any application-layer call.  All orchestration is delegated to the
rag_reindex use case.
"""

from __future__ import annotations

import logging

from firebase_functions import https_fn

from application.services.document_pipeline import get_document_pipeline
from application.use_cases.rag_reindex import RagReindexCommand, execute_rag_reindex
from interface.schemas.rag_reindex import RagReindexRequest

logger = logging.getLogger(__name__)


def handle_rag_reindex_document(req: https_fn.CallableRequest) -> dict:
    """HTTPS Callable：手動觸發單一文件的 Normalization + RAG ingestion."""
    try:
        schema = RagReindexRequest.from_raw(req.data or {})
    except ValueError as exc:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            str(exc),
        ) from exc

    runtime = get_document_pipeline()
    try:
        result = execute_rag_reindex(
            RagReindexCommand(
                doc_id=schema.doc_id,
                json_gcs_uri=schema.json_gcs_uri,
                account_id=schema.account_id,
                source_gcs_uri=schema.source_gcs_uri,
                workspace_id=schema.workspace_id,
                filename=schema.filename,
                page_count=schema.page_count,
            )
        )
        return {
            "account_scope": result.account_id,
            "doc_id": result.doc_id,
            "status": "ready",
            "chunk_count": result.chunk_count,
            "vector_count": result.vector_count,
            "raw_chars": result.raw_chars,
            "normalized_chars": result.normalized_chars,
            "normalization_version": result.normalization_version,
            "language_hint": result.language_hint,
        }
    except ValueError as exc:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            str(exc),
        ) from exc
    except https_fn.HttpsError:
        raise
    except Exception as exc:
        logger.exception(
            "rag_reindex_document failed for %s: %s", schema.doc_id, exc
        )
        runtime.record_rag_error(
            schema.doc_id, str(exc)[:200], account_id=schema.account_id
        )
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INTERNAL,
            f"rag_reindex_document 失敗：{str(exc)[:200]}",
        ) from exc
