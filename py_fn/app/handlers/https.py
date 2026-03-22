"""
HTTPS Callable 觸發器 — 供前端主動觸發 Document AI 解析。

接受 GCS 檔案路徑，直接呼叫 Document AI（無記憶體複製），
解析全文寫回 GCS JSON，Firestore 僅存索引。

請求格式：
    {
        "gcs_uri": "gs://my-bucket/uploads/my-doc.pdf",
        "size_bytes": 102400  # 選填
    }

Document AI 會直接從 GCS 讀取檔案，無須下載到 Python 函數記憶體。
結果會保存為：
    - GCS: files/.../*.json（完整解析）
    - Firestore: parsed_documents/{doc_id}（索引）

回應格式（立即返回）：
    {
        "doc_id": "my-doc",
        "status": "processing"  // 實際解析在後台進行（通醫 2-5 秒）
    }

前端應監聽 Firestore 文件狀態變化以追蹤進度。
"""

import logging
import os
import time

from firebase_functions import https_fn

from app.services.documentai import process_document_gcs
from app.services.firestore import init_document, record_error, update_parsed
from app.services.storage import parsed_json_path, upload_json

logger = logging.getLogger(__name__)


def handle_parse_document(req: https_fn.CallableRequest) -> dict:
    """
    HTTPS Callable：主動觸發單一文件的 Document AI 解析。

    輸入 GCS URI，Document AI 直接從 Cloud Storage 讀取並解析。
    Firestore 會記錄完整的 lifecycle（processing → completed/error）。

    Args:
        req.data: {
            "gcs_uri": "gs://bucket/path/file.pdf",  # 必填
            "mime_type": "application/pdf",           # 選填；如果省略則由副檔名推測
            "size_bytes": 102400                       # 選填
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

    size_bytes = data.get("size_bytes", 0)
    logger.info("parse_document callable: %s → doc_id=%s", gcs_uri, doc_id)

    # ── 初始化 Firestore document ───────────────────────────────────────────
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

    # 解析 gs://bucket/path，取得 bucket 與 object_path
    bucket_name, object_path = path_part.split("/", 1)

    # ── 同步解析（保持函數活躍直到完成） ─────────────────────────────────────
    start_time = time.time()
    try:
        parsed = process_document_gcs(gcs_uri=gcs_uri, mime_type=mime_type)
        extraction_ms = int((time.time() - start_time) * 1000)

        # 解析結果全文寫回 GCS JSON（與 uploads 目錄結構對應）
        json_object_path = parsed_json_path(object_path)
        json_gcs_uri = upload_json(
            bucket_name=bucket_name,
            object_path=json_object_path,
            data={
                "doc_id": doc_id,
                "source_gcs_uri": gcs_uri,
                "filename": filename,
                "page_count": parsed.page_count,
                "extraction_ms": extraction_ms,
                "text": parsed.text,
            },
        )

        update_parsed(
            doc_id=doc_id,
            json_gcs_uri=json_gcs_uri,
            page_count=parsed.page_count,
            extraction_ms=extraction_ms,
        )

        logger.info(
            "✓ parse_document done: doc_id=%s (%d pages, %d ms) → %s",
            doc_id,
            parsed.page_count,
            extraction_ms,
            json_gcs_uri,
        )
    except Exception as exc:
        logger.exception("parse_document failed for %s: %s", doc_id, exc)
        record_error(doc_id, str(exc)[:200])

    # 立即回覆（無論成功或失敗，Firestore 狀態已更新）
    return {
        "doc_id": doc_id,
        "status": "processing",  # 前端應監聽 Firestore 的實際狀態
    }
