"""
HTTPS Callable 觸發器 — 供前端或其他服務主動觸發 Document AI 解析。

支援兩種請求格式：

1. 從 GCS 下載（bucket + path）：
    {
        "bucket": "my-bucket",
        "path": "uploads/my-doc.pdf"
    }

2. 直接上傳 base64（content_b64 + mime_type）：
    {
        "content_b64": "JVBERi0xLjQK...",
        "mime_type": "application/pdf"
    }

回應格式：
    {
        "doc_id": "my-doc",
        "page_count": 5,
        "text_preview": "前 200 字…"
    }
"""

import base64
import logging
import os
import uuid

from firebase_functions import https_fn

from app.services.documentai import process_document_bytes
from app.services.firestore import write_parsed_result
from app.services.storage import download_bytes

logger = logging.getLogger(__name__)


def handle_parse_document(req: https_fn.CallableRequest) -> dict:
    """
    HTTPS Callable：手動觸發單一文件的 Document AI 解析。

    支援兩種模式：
    1. GCS 模式：bucket + path → 從 Cloud Storage 下載
    2. Base64 模式：content_b64 + mime_type → 直接處理上傳的內容

    Raises:
        https_fn.HttpsError: 缺少必填欄位或發生下游錯誤時。
    """
    data: dict = req.data or {}

    # 判斷是 GCS 模式或 Base64 模式
    has_bucket_path = "bucket" in data and "path" in data
    has_base64 = "content_b64" in data and "mime_type" in data

    if not (has_bucket_path or has_base64):
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "必須提供 (bucket + path) 或 (content_b64 + mime_type)",
        )

    # ── GCS 模式 ──────────────────────────────────────────────────────────────
    if has_bucket_path:
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
            logger.exception("parse_document (GCS) failed: %s", exc)
            raise https_fn.HttpsError(
                https_fn.FunctionsErrorCode.INTERNAL,
                "Document AI 解析失敗，請稍後重試",
            ) from exc

        return {
            "doc_id": doc_id,
            "page_count": parsed.page_count,
            "text_preview": parsed.text[:200],
        }

    # ── Base64 模式 ────────────────────────────────────────────────────────────
    else:
        content_b64: str = data.get("content_b64", "")
        mime_type: str = data.get("mime_type", "")

        if not content_b64 or not mime_type:
            raise https_fn.HttpsError(
                https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
                "content_b64 與 mime_type 為必填欄位",
            )

        try:
            # Base64 decode
            raw_bytes = base64.b64decode(content_b64)
            logger.info("decoded %d bytes from base64", len(raw_bytes))

            # Document AI 解析
            parsed = process_document_bytes(content=raw_bytes, mime_type=mime_type)

            # 產生唯一的 doc_id
            doc_id = str(uuid.uuid4())[:8]

            # 寫入 Firestore
            write_parsed_result(
                doc_id=doc_id,
                text=parsed.text,
                page_count=parsed.page_count,
                mime_type=parsed.mime_type,
                source_path=f"base64-upload-{doc_id}",
            )
        except Exception as exc:
            logger.exception("parse_document (base64) failed: %s", exc)
            raise https_fn.HttpsError(
                https_fn.FunctionsErrorCode.INTERNAL,
                f"Document AI 解析失敗：{str(exc)[:100]}",
            ) from exc

        return {
            "doc_id": doc_id,
            "page_count": parsed.page_count,
            "text_preview": parsed.text[:200],
        }
