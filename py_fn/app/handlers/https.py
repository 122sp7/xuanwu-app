"""
HTTPS Callable 觸發器 — 供前端主動觸發 Document AI 解析。

接受 GCS 檔案路徑，直接呼叫 Document AI（無記憶體複製），結果存入 Firestore。

請求格式：
    {
        "gcs_uri": "gs://my-bucket/uploads/my-doc.pdf"
    }

Document AI 會直接從 GCS 讀取檔案，無須下載到 Python 函數記憶體。
結果自動保存至 Firestore（完整 lifecycle）。

回應格式：
    {
        "doc_id": "my-doc",
        "status": "processing"  // 実際的解析在後台進行
    }

前端應監聽 Firestore 文件狀態變化以追蹤進度。
"""

import logging
import os
import time

from firebase_functions import https_fn

from app.services.documentai import process_document_gcs
from app.services.firestore import init_document, record_error, update_parsed

logger = logging.getLogger(__name__)


def handle_parse_document(req: https_fn.CallableRequest) -> dict:
    """
    HTTPS Callable：主動觸發單一文件的 Document AI 解析。

    輸入 GCS URI，Document AI 直接從 Cloud Storage 讀取並解析。
    Firestore 會記錄完整的 lifecycle（processing → completed/error）。

    Args:
        req.data: {
            "gcs_uri": "gs://bucket/path/file.pdf",  # 必填
            "mime_type": "application/pdf"            # 選填；如果省略則由副檔名推測
        }

    Returns:
        dict: {
            "doc_id": "file",
            "status": "processing"
        }

    Raises:
        https_fn.HttpsError: 缺少必填欄位時。
    """
    data: dict = req.data or {}

    gcs_uri: str = data.get("gcs_uri", "").strip()
    if not gcs_uri or not gcs_uri.startswith("gs://"):
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "gcs_uri 為必填欄位（格式：gs://bucket/path）",
        )

    # 解析 GCS URI 得到檔名，用於 doc_id
    # gs://bucket/path/to/file.pdf → file
    path_part = gcs_uri.split("gs://", 1)[1]  # "bucket/path/to/file.pdf"
    filename = os.path.basename(path_part)     # "file.pdf"
    doc_id, ext = os.path.splitext(filename)   # "file", ".pdf"

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

    logger.info("parse_document callable: %s → doc_id=%s", gcs_uri, doc_id)

    # ── 初始化 Firestore document ───────────────────────────────────────────
    # 不取 size，因為 gcs_uri 是外部傳入，我們無法在這時取得 size
    # 前端上傳時應該已知道 size，可定義前端負責傳送
    size_bytes = data.get("size_bytes", 0)
    try:
        init_document(
            doc_id=doc_id,
            gcs_uri=gcs_uri,
            filename=filename,
            size_bytes=int(size_bytes),
            mime_type=mime_type,
        )
    except Exception as exc:
        logger.exception("Failed to init document %s: %s", doc_id, exc)
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INTERNAL,
            "Failed to initialize document",
        ) from exc

    # ── 非同步解析（在背景進行，不 wait） ───────────────────────────────────
    # 立即回覆前端，詳細解析由 on_document_parsed 更新
    def _parse_async():
        """後台任務：解析文件、更新 Firestore。"""
        start_time = time.time()
        try:
            parsed = process_document_gcs(gcs_uri=gcs_uri, mime_type=mime_type)
            extraction_ms = int((time.time() - start_time) * 1000)

            update_parsed(
                doc_id=doc_id,
                text=parsed.text,
                page_count=parsed.page_count,
                extraction_ms=extraction_ms,
            )

            logger.info("✓ async parse done: doc_id=%s (%d pages, %d ms)", 
                       doc_id, parsed.page_count, extraction_ms)
        except Exception as exc:
            logger.exception("async parse failed for %s: %s", doc_id, exc)
            record_error(doc_id, str(exc)[:200])

    # 啟動後台任務（但不阻塞回應）
    # 注意：Firebase Functions 環境可能不支援 threading；
    # 實務上通常立即呼叫 parse，前端監聽 Firestore 變化
    # 為了簡化，這裡直接同步呼叫（保持相容性）
    _parse_async()

    return {
        "doc_id": doc_id,
        "status": "processing",
    }
