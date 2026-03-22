"""
HTTPS Callable 觸發器 — 供前端或其他服務主動觸發 Document AI 解析。

接受 GCS 檔案路徑，直接呼叫 Document AI（無記憶體複製）。

請求格式：
    {
        "gcs_uri": "gs://my-bucket/uploads/my-doc.pdf"
    }

Document AI 會直接從 GCS 讀取檔案，無須下載到 Python 函數記憶體。

回應格式：
    {
        "doc_id": "my-doc",
        "page_count": 5,
        "text_preview": "前 200 字…"
    }
"""

import logging
import os

from firebase_functions import https_fn

from app.services.documentai import process_document_gcs
from app.services.firestore import write_parsed_result

logger = logging.getLogger(__name__)


def handle_parse_document(req: https_fn.CallableRequest) -> dict:
    """
    HTTPS Callable：主動觸發單一文件的 Document AI 解析。

    輸入 GCS URI，Document AI 直接從 Cloud Storage 讀取並解析，
    完全避免記憶體複製與網路不穩的問題。

    Args:
        req.data: {
            "gcs_uri": "gs://bucket/path/file.pdf",  # 必填
            "mime_type": "application/pdf"            # 選填；如果省略則由副檔名推測
        }

    Returns:
        dict: {
            "doc_id": "file",
            "page_count": 5,
            "text_preview": "前 200 字…"
        }

    Raises:
        https_fn.HttpsError: 缺少必填欄位或 Document AI 解析失敗時。
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

    try:
        logger.info("parsing GCS document: %s (mime=%s)", gcs_uri, mime_type)
        parsed = process_document_gcs(gcs_uri=gcs_uri, mime_type=mime_type)

        # 寫入 Firestore
        write_parsed_result(
            doc_id=doc_id,
            text=parsed.text,
            page_count=parsed.page_count,
            mime_type=parsed.mime_type,
            source_path=gcs_uri,
        )

        logger.info("✓ document parsed and saved: doc_id=%s, pages=%d", doc_id, parsed.page_count)
    except Exception as exc:
        logger.exception("Document AI 解析失敗: %s", exc)
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INTERNAL,
            f"Document AI 解析失敗：{str(exc)[:100]}",
        ) from exc

    return {
        "doc_id": doc_id,
        "page_count": parsed.page_count,
        "text_preview": parsed.text[:200],
    }
