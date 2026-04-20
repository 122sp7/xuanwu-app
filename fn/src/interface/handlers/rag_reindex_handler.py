"""
HTTPS Callable — handle_rag_reindex_document：手動觸發文件 RAG 重新索引。

Schema validation (Rule 4) is performed via RagReindexRequest.from_raw()
before any application-layer call.
"""

from __future__ import annotations

import json
import logging

from firebase_functions import https_fn

from application.services.document_pipeline import get_document_pipeline
from application.use_cases.rag_ingestion import ingest_document_for_rag
from interface.handlers._https_helpers import _parse_gs_uri
from interface.schemas.rag_reindex import RagReindexRequest

logger = logging.getLogger(__name__)


def handle_rag_reindex_document(req: https_fn.CallableRequest) -> dict:
    """HTTPS Callable：手動觸發單一文件的 Normalization + RAG ingestion."""
    runtime = get_document_pipeline()

    try:
        schema = RagReindexRequest.from_raw(req.data or {})
    except ValueError as exc:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            str(exc),
        ) from exc

    try:
        bucket_name, object_path = _parse_gs_uri(schema.json_gcs_uri)
        json_bytes = runtime.download_bytes(
            bucket_name=bucket_name, object_path=object_path
        )
        parsed_payload: dict = (
            json.loads(json_bytes.decode("utf-8")) if json_bytes else {}
        )

        text = str(parsed_payload.get("text", "")).strip()
        if not text:
            # Backward-compat: old JSON files may not have "text".
            # Reconstruct from stored layout chunks when available.
            stored_chunks = parsed_payload.get("chunks") or []
            if stored_chunks:
                text = "\n".join(
                    str(c.get("text", "")).strip()
                    for c in stored_chunks
                    if c.get("text", "")
                ).strip()
        if not text:
            raise ValueError("json 內容缺少 text")

        # Enrich from the JSON payload when schema fields were left empty.
        source_gcs_uri = schema.source_gcs_uri or str(
            parsed_payload.get("source_gcs_uri", "")
        ).strip()

        workspace_id = schema.workspace_id
        if not workspace_id:
            workspace_id = str(parsed_payload.get("workspace_id", "")).strip()
        if not workspace_id:
            workspace_id = str(
                (parsed_payload.get("metadata") or {}).get("space_id", "")
            ).strip()
        if not workspace_id:
            raise https_fn.HttpsError(
                https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
                "workspace_id 為必填欄位",
            )

        filename = schema.filename
        if not filename or filename == schema.doc_id:
            filename = (
                str(parsed_payload.get("filename", "")).strip()
                or str(parsed_payload.get("display_name", "")).strip()
                or str(parsed_payload.get("original_filename", "")).strip()
                or schema.doc_id
            )

        page_count = schema.page_count
        if page_count <= 0:
            page_count = int(parsed_payload.get("page_count", 0) or 0)

        # Read stored layout chunks; passes None when absent (falls back to char-split).
        layout_chunks: list[dict] | None = parsed_payload.get("chunks") or None

        rag = ingest_document_for_rag(
            doc_id=schema.doc_id,
            filename=filename,
            source_gcs_uri=source_gcs_uri,
            json_gcs_uri=schema.json_gcs_uri,
            text=text,
            page_count=page_count,
            account_id=schema.account_id,
            workspace_id=workspace_id,
            layout_chunks=layout_chunks,
        )

        runtime.mark_rag_ready(
            doc_id=schema.doc_id,
            chunk_count=rag.chunk_count,
            vector_count=rag.vector_count,
            embedding_model=rag.embedding_model,
            embedding_dimensions=rag.embedding_dimensions,
            raw_chars=rag.raw_chars,
            normalized_chars=rag.normalized_chars,
            normalization_version=rag.normalization_version,
            language_hint=rag.language_hint,
            account_id=schema.account_id,
        )

        return {
            "account_scope": schema.account_id,
            "doc_id": schema.doc_id,
            "status": "ready",
            "chunk_count": rag.chunk_count,
            "vector_count": rag.vector_count,
            "raw_chars": rag.raw_chars,
            "normalized_chars": rag.normalized_chars,
            "normalization_version": rag.normalization_version,
            "language_hint": rag.language_hint,
        }
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
