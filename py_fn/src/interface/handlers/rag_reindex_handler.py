"""
HTTPS Callable — handle_rag_reindex_document：手動觸發文件 RAG 重新索引。
"""

from __future__ import annotations

import json
import logging

from firebase_functions import https_fn

from application.services.document_pipeline import get_document_pipeline
from application.use_cases.rag_ingestion import ingest_document_for_rag
from interface.handlers._https_helpers import _parse_gs_uri

logger = logging.getLogger(__name__)


def handle_rag_reindex_document(req: https_fn.CallableRequest) -> dict:
    """HTTPS Callable：手動觸發單一文件的 Normalization + RAG ingestion。"""
    runtime = get_document_pipeline()
    data: dict = req.data or {}

    account_id = str(data.get("account_id", "")).strip()
    doc_id = str(data.get("doc_id", "")).strip()
    json_gcs_uri = str(data.get("json_gcs_uri", "")).strip()
    source_gcs_uri = str(data.get("source_gcs_uri", "")).strip()
    workspace_id = str(data.get("workspace_id", "")).strip()
    filename = (
        str(data.get("filename", "")).strip()
        or str(data.get("display_name", "")).strip()
        or str(data.get("original_filename", "")).strip()
        or doc_id
    )

    if not account_id:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "account_id 為必填欄位",
        )
    if not doc_id:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "doc_id 為必填欄位",
        )
    if not json_gcs_uri:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "json_gcs_uri 為必填欄位",
        )

    try:
        page_count = int(data.get("page_count", 0) or 0)
    except Exception:
        page_count = 0

    try:
        bucket_name, object_path = _parse_gs_uri(json_gcs_uri)
        json_bytes = runtime.download_bytes(bucket_name=bucket_name, object_path=object_path)
        parsed_payload = json.loads(json_bytes.decode("utf-8")) if json_bytes else {}

        text = str(parsed_payload.get("text", "")).strip()
        if not text:
            raise ValueError("json 內容缺少 text")

        if not source_gcs_uri:
            source_gcs_uri = str(parsed_payload.get("source_gcs_uri", "")).strip()
        if not workspace_id:
            workspace_id = str(parsed_payload.get("workspace_id", "")).strip()
        if not workspace_id:
            workspace_id = str((parsed_payload.get("metadata") or {}).get("space_id", "")).strip()
        if not filename:
            filename = (
                str(parsed_payload.get("filename", "")).strip()
                or str(parsed_payload.get("display_name", "")).strip()
                or str(parsed_payload.get("original_filename", "")).strip()
                or doc_id
            )
        if page_count <= 0:
            page_count = int(parsed_payload.get("page_count", 0) or 0)
        if not workspace_id:
            raise https_fn.HttpsError(
                https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
                "workspace_id 為必填欄位",
            )

        rag = ingest_document_for_rag(
            doc_id=doc_id,
            filename=filename,
            source_gcs_uri=source_gcs_uri,
            json_gcs_uri=json_gcs_uri,
            text=text,
            page_count=page_count,
            account_id=account_id,
            workspace_id=workspace_id,
        )

        runtime.mark_rag_ready(
            doc_id=doc_id,
            chunk_count=rag.chunk_count,
            vector_count=rag.vector_count,
            embedding_model=rag.embedding_model,
            embedding_dimensions=rag.embedding_dimensions,
            raw_chars=rag.raw_chars,
            normalized_chars=rag.normalized_chars,
            normalization_version=rag.normalization_version,
            language_hint=rag.language_hint,
            account_id=account_id,
        )

        return {
            "account_scope": account_id,
            "doc_id": doc_id,
            "status": "ready",
            "chunk_count": rag.chunk_count,
            "vector_count": rag.vector_count,
            "raw_chars": rag.raw_chars,
            "normalized_chars": rag.normalized_chars,
            "normalization_version": rag.normalization_version,
            "language_hint": rag.language_hint,
        }
    except Exception as exc:
        logger.exception("rag_reindex_document failed for %s: %s", doc_id, exc)
        runtime.record_rag_error(doc_id, str(exc)[:200], account_id=account_id)
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INTERNAL,
            f"rag_reindex_document 失敗：{str(exc)[:200]}",
        ) from exc
