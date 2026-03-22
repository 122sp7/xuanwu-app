"""
Storage 觸發器 — 監聽 GCS 物件建立事件，自動送 Document AI 解析後寫入 Firestore。

流程：
    GCS object.finalized
        → 建立初始 Firestore document（status=processing）
        → Document AI 直接從 GCS URI 讀取
        → 更新 Firestore document（status=completed）
        → 如失敗，記錄 error

優勢：前端上傳檔案後，可實時監聽 Firestore 文件狀態變化。
"""

import logging
import os
import time

from firebase_functions import storage_fn

from app.services.documentai import process_document_gcs
from app.services.firestore import init_document, record_error, update_parsed

logger = logging.getLogger(__name__)

# 只處理這個資料夾下的上傳檔案（空字串 = 處理整個 bucket）
WATCH_PREFIX: str = os.environ.get("WATCH_PREFIX", "uploads/")

# 支援的 MIME 類型對照表（副檔名 → MIME）
_MIME_MAP: dict[str, str] = {
    ".pdf": "application/pdf",
    ".tif": "image/tiff",
    ".tiff": "image/tiff",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
}


def _mime_from_path(object_path: str) -> str | None:
    _, ext = os.path.splitext(object_path.lower())
    return _MIME_MAP.get(ext)


def handle_object_finalized(
    event: storage_fn.CloudEvent[storage_fn.StorageObjectData],
) -> None:
    """
    Cloud Storage on_object_finalized 觸發器。

    - 只處理 WATCH_PREFIX 下、且為支援 MIME 類型的檔案。
    - 初始化 → Document AI 解析 → 更新 Firestore
    - 異常時記錄至 Firestore。
    """
    data = event.data
    if data is None:
        logger.warning("storage event missing data, skipping")
        return

    bucket_name: str = data.bucket
    object_path: str = data.name or ""
    size_bytes: int = int(data.size or 0)

    # ── 路徑過濾 ────────────────────────────────────────────────────────────
    if not object_path.startswith(WATCH_PREFIX):
        logger.info("GCS: skip %s (prefix not matched)", object_path)
        return

    mime_type = _mime_from_path(object_path)
    if mime_type is None:
        logger.info("GCS: skip %s (unsupported file type)", object_path)
        return

    # doc_id = GCS 物件名稱（去掉 prefix 和副檔名）當作 Firestore 文件 ID
    filename = os.path.basename(object_path)
    doc_id, _ = os.path.splitext(filename)

    gcs_uri = f"gs://{bucket_name}/{object_path}"
    logger.info("GCS finalized: %s → doc_id=%s", gcs_uri, doc_id)

    # ── Step 1: 初始化 Firestore document ──────────────────────────────────
    try:
        init_document(
            doc_id=doc_id,
            gcs_uri=gcs_uri,
            filename=filename,
            size_bytes=size_bytes,
            mime_type=mime_type,
        )
    except Exception as exc:
        logger.exception("Failed to init document %s: %s", doc_id, exc)
        return

    # ── Step 2: Document AI 解析 ──────────────────────────────────────────
    start_time = time.time()
    try:
        parsed = process_document_gcs(gcs_uri=gcs_uri, mime_type=mime_type)
        extraction_ms = int((time.time() - start_time) * 1000)

        # ── Step 3: 更新 Firestore 為 completed ───────────────────────────
        update_parsed(
            doc_id=doc_id,
            text=parsed.text,
            page_count=parsed.page_count,
            extraction_ms=extraction_ms,
        )

        logger.info("✓ Done: doc_id=%s (%d pages, %d ms)", doc_id, parsed.page_count, extraction_ms)
    except Exception as exc:
        logger.exception("Document AI failed for %s: %s", doc_id, exc)
        record_error(doc_id, str(exc)[:200])
