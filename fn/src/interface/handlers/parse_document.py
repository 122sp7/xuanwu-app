"""
HTTPS Callable — handle_parse_document：觸發 Document AI 解析。

Schema validation (Rule 4) is performed via ParseDocumentRequest.from_raw()
before any application-layer call.
"""

from __future__ import annotations

import logging
import time

from firebase_functions import https_fn

from application.services.document_pipeline import get_document_pipeline
from application.use_cases.rag_ingestion import ingest_document_for_rag
from interface.schemas.parse_document import ParseDocumentRequest

logger = logging.getLogger(__name__)


def handle_parse_document(req: https_fn.CallableRequest) -> dict:
    """
    HTTPS Callable：主動觸發單一文件的 Document AI 解析。

    All external input is validated through ParseDocumentRequest before
    reaching the application layer (Rule 4).
    """
    runtime = get_document_pipeline()

    try:
        schema = ParseDocumentRequest.from_raw(req.data or {})
    except ValueError as exc:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            str(exc),
        ) from exc

    # Derive bucket / object_path from the validated URI.
    path_part = schema.gcs_uri.split("gs://", 1)[1]
    if "/" not in path_part:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "gcs_uri must include object path after bucket name",
        )
    bucket_name, object_path = path_part.split("/", 1)

    logger.info("parse_document callable: %s → doc_id=%s", schema.gcs_uri, schema.doc_id)

    # ── 初始化 Firestore document ───────────────────────────────────────────
    try:
        runtime.init_document(
            doc_id=schema.doc_id,
            gcs_uri=schema.gcs_uri,
            filename=schema.filename,
            size_bytes=schema.size_bytes,
            mime_type=schema.mime_type,
            account_id=schema.account_id,
            workspace_id=schema.workspace_id,
        )
    except Exception as exc:
        logger.exception("Failed to init document %s: %s", schema.doc_id, exc)
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INTERNAL,
            "Failed to initialize document",
        ) from exc

    # ── 同步解析 ─────────────────────────────────────────────────────────────
    start_time = time.time()
    try:
        parsed = runtime.process_document_gcs(
            gcs_uri=schema.gcs_uri,
            mime_type=schema.mime_type,
        )
        extraction_ms = int((time.time() - start_time) * 1000)

        json_object_path = runtime.parsed_json_path(object_path)
        json_gcs_uri = runtime.upload_json(
            bucket_name=bucket_name,
            object_path=json_object_path,
            data={
                "doc_id": schema.doc_id,
                "account_id": schema.account_id,
                "workspace_id": schema.workspace_id,
                "source_gcs_uri": schema.gcs_uri,
                "filename": schema.filename,
                "display_name": schema.filename,
                "original_filename": schema.filename,
                "page_count": parsed.page_count,
                "extraction_ms": extraction_ms,
                "text": parsed.text,
                "chunk_count": len(parsed.chunks),
                "entities": parsed.entities,
            },
        )

        runtime.update_parsed(
            doc_id=schema.doc_id,
            json_gcs_uri=json_gcs_uri,
            page_count=parsed.page_count,
            extraction_ms=extraction_ms,
            account_id=schema.account_id,
        )

        if schema.run_rag:
            try:
                rag = ingest_document_for_rag(
                    doc_id=schema.doc_id,
                    filename=schema.filename,
                    source_gcs_uri=schema.gcs_uri,
                    json_gcs_uri=json_gcs_uri,
                    text=parsed.text,
                    page_count=parsed.page_count,
                    account_id=schema.account_id,
                    workspace_id=schema.workspace_id,
                    layout_chunks=parsed.chunks or None,
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
            except Exception as rag_exc:
                logger.exception("RAG ingestion failed for %s: %s", schema.doc_id, rag_exc)
                runtime.record_rag_error(
                    schema.doc_id, str(rag_exc)[:200], account_id=schema.account_id
                )

        logger.info(
            "✓ parse_document done: doc_id=%s (%d pages, %d ms, run_rag=%s) → %s",
            schema.doc_id,
            parsed.page_count,
            extraction_ms,
            schema.run_rag,
            json_gcs_uri,
        )
    except https_fn.HttpsError:
        raise
    except Exception as exc:
        logger.exception("parse_document failed for %s: %s", schema.doc_id, exc)
        runtime.record_error(schema.doc_id, str(exc)[:200], account_id=schema.account_id)

    return {
        "account_scope": schema.account_id,
        "doc_id": schema.doc_id,
        "status": "processing",
    }
