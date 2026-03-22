"""
HTTPS Callable 觸發器 — 供前端或其他服務主動觸發 Document AI 解析。

請求格式（data 欄位）：
    {
        "bucket": "my-bucket",
        "path": "uploads/my-doc.pdf"
    }

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

from app.services.documentai import process_document_bytes
from app.services.firestore import write_parsed_result
from app.services.storage import download_bytes

logger = logging.getLogger(__name__)


def handle_parse_document(req: https_fn.CallableRequest) -> dict:
    """
    HTTPS Callable：手動觸發單一文件的 Document AI 解析。

    Raises:
        https_fn.HttpsError: 缺少必填欄位或發生下游錯誤時。
    """
    data: dict = req.data or {}

    bucket_name: str = data.get("bucket", "")
    object_path: str = data.get("path", "")

    if not bucket_name or not object_path:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "bucket 與 path 為必填欄位",
        )

    # 從副檔名推斷 MIME
    _, ext = os.path.splitext(object_path.lower())
    _mime_map = {
        ".pdf": "application/pdf",
        ".tiff": "image/tiff",
        ".tif": "image/tiff",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
    }
    mime_type = _mime_map.get(ext)
    if mime_type is None:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            f"不支援的檔案類型：{ext}",
        )

    filename = os.path.basename(object_path)
    doc_id, _ = os.path.splitext(filename)

    try:
        raw_bytes = download_bytes(bucket_name=bucket_name, object_path=object_path)
        parsed = process_document_bytes(content=raw_bytes, mime_type=mime_type)
        write_parsed_result(
            doc_id=doc_id,
            text=parsed.text,
            page_count=parsed.page_count,
            mime_type=parsed.mime_type,
            source_path=f"gs://{bucket_name}/{object_path}",
        )
    except Exception as exc:
        logger.exception("parse_document failed: %s", exc)
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INTERNAL,
            "Document AI 解析失敗，請稍後重試",
        ) from exc

    return {
        "doc_id": doc_id,
        "page_count": parsed.page_count,
        "text_preview": parsed.text[:200],
    }
