"""
HTTPS Callable — handle_parse_document：觸發 Document AI 解析。
"""

from __future__ import annotations

import logging
import os
import time

from firebase_functions import https_fn

from application.services.document_pipeline import get_document_pipeline
from application.use_cases.rag_ingestion import ingest_document_for_rag
from interface.handlers._https_helpers import _parse_gs_uri

logger = logging.getLogger(__name__)


def handle_parse_document(req: https_fn.CallableRequest) -> dict:
    """
    HTTPS Callable：主動觸發單一文件的 Document AI 解析。

    輸入 GCS URI，Document AI 直接從 Cloud Storage 讀取並解析。
    Firestore 會記錄完整的 lifecycle（processing → completed/error）。
    """
    runtime = get_document_pipeline()
    data: dict = req.data or {}
    account_id = str(data.get("account_id", "")).strip()
    workspace_id = str(data.get("workspace_id", "")).strip()
    if not account_id:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "account_id 為必填欄位",
        )
    if not workspace_id:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "workspace_id 為必填欄位",
        )

    gcs_uri: str = data.get("gcs_uri", "").strip()
    if not gcs_uri or not gcs_uri.startswith("gs://"):
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "gcs_uri 為必填欄位（格式：gs://bucket/path）",
        )

    # 解析 GCS URI 得到儲存檔名，用於 doc_id。
    path_part = gcs_uri.split("gs://", 1)[1]  # "bucket/path/to/file.pdf"
    storage_filename = os.path.basename(path_part)     # "file.pdf"
    doc_id, ext = os.path.splitext(storage_filename)   # "file", ".pdf"
    filename = (
        str(data.get("filename", "")).strip()
        or str(data.get("original_filename", "")).strip()
        or str(data.get("display_name", "")).strip()
        or storage_filename
    )

    # 推測 MIME 類型
    mime_type = data.get("mime_type", "").strip()
    if not mime_type:
        _mime_map = {
            ".pdf": "application/pdf",
            ".tiff": "image/tiff",
            ".tif": "image/tiff",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
        }
        mime_type = _mime_map.get(ext.lower())
        if mime_type is None:
            raise https_fn.HttpsError(
                https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
                f"無法判斷 MIME 類型，請手動指定（副檔名：{ext}）",
            )

    size_bytes = data.get("size_bytes", 0)
    logger.info("parse_document callable: %s → doc_id=%s", gcs_uri, doc_id)

    # ── 初始化 Firestore document ───────────────────────────────────────────
    try:
        runtime.init_document(
            doc_id=doc_id,
            gcs_uri=gcs_uri,
            filename=filename,
            size_bytes=int(size_bytes),
            mime_type=mime_type,
            account_id=account_id,
            workspace_id=workspace_id,
        )
    except Exception as exc:
        logger.exception("Failed to init document %s: %s", doc_id, exc)
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INTERNAL,
            "Failed to initialize document",
        ) from exc

    # 解析 gs://bucket/path，取得 bucket 與 object_path
    bucket_name, object_path = path_part.split("/", 1)

    # ── 同步解析（保持函數活躍直到完成） ─────────────────────────────────────
    start_time = time.time()
    try:
        parsed = runtime.process_document_gcs(gcs_uri=gcs_uri, mime_type=mime_type)
        extraction_ms = int((time.time() - start_time) * 1000)

        # 解析結果全文寫回 GCS JSON（與 uploads 目錄結構對應）
        json_object_path = runtime.parsed_json_path(object_path)
        json_gcs_uri = runtime.upload_json(
            bucket_name=bucket_name,
            object_path=json_object_path,
            data={
                "doc_id": doc_id,
                "account_id": account_id,
                "workspace_id": workspace_id,
                "source_gcs_uri": gcs_uri,
                "filename": filename,
                "display_name": filename,
                "original_filename": filename,
                "page_count": parsed.page_count,
                "extraction_ms": extraction_ms,
                "text": parsed.text,
            },
        )

        runtime.update_parsed(
            doc_id=doc_id,
            json_gcs_uri=json_gcs_uri,
            page_count=parsed.page_count,
            extraction_ms=extraction_ms,
            account_id=account_id,
        )

        # Step 5/6: RAG ingestion（embed + vector + ready）
        try:
            rag = ingest_document_for_rag(
                doc_id=doc_id,
                filename=filename,
                source_gcs_uri=gcs_uri,
                json_gcs_uri=json_gcs_uri,
                text=parsed.text,
                page_count=parsed.page_count,
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
        except Exception as rag_exc:
            logger.exception("RAG ingestion failed for %s: %s", doc_id, rag_exc)
            runtime.record_rag_error(doc_id, str(rag_exc)[:200], account_id=account_id)

        logger.info(
            "✓ parse_document done: doc_id=%s (%d pages, %d ms) → %s",
            doc_id,
            parsed.page_count,
            extraction_ms,
            json_gcs_uri,
        )
    except Exception as exc:
        logger.exception("parse_document failed for %s: %s", doc_id, exc)
        runtime.record_error(doc_id, str(exc)[:200], account_id=account_id)

    # 立即回覆（無論成功或失敗，Firestore 狀態已更新）
    return {
        "account_scope": account_id,
        "doc_id": doc_id,
        "status": "processing",  # 前端應監聽 Firestore 的實際狀態
    }
