"""
Storage 觸發器 — 監聽 GCS 物件建立事件，自動送 Document AI 解析後寫入 Firestore。

流程：
    GCS object.finalized
        → download_bytes()
        → process_document_bytes()
        → write_parsed_result()
"""

import logging
import os

from firebase_functions import storage_fn

from app.services.documentai import process_document_bytes
from app.services.firestore import write_parsed_result
from app.services.storage import download_bytes

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
    - 下載 → Document AI 解析 → 寫入 Firestore。
    """
    data = event.data
    if data is None:
        logger.warning("storage event missing data, skipping")
        return

    bucket_name: str = data.bucket
    object_path: str = data.name or ""

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

    logger.info("Processing gs://%s/%s → doc_id=%s", bucket_name, object_path, doc_id)

    # ── 主流程 ──────────────────────────────────────────────────────────────
    raw_bytes = download_bytes(bucket_name=bucket_name, object_path=object_path)
    parsed = process_document_bytes(content=raw_bytes, mime_type=mime_type)
    write_parsed_result(
        doc_id=doc_id,
        text=parsed.text,
        page_count=parsed.page_count,
        mime_type=parsed.mime_type,
        source_path=f"gs://{bucket_name}/{object_path}",
    )
    logger.info("Done: doc_id=%s (%d pages)", doc_id, parsed.page_count)
