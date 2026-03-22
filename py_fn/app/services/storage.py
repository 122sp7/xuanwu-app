"""
Cloud Storage 服務層 — 使用 firebase-admin 的 storage 模組下載／上傳物件。

用法：
    from app.services.storage import download_bytes, upload_json
    data = download_bytes(bucket_name="my-bucket", object_path="uploads/doc.pdf")
    uri  = upload_json(bucket_name="my-bucket", object_path="files/doc.json", data={...})
"""

import json
import logging
import os

import firebase_admin.storage as fb_storage

logger = logging.getLogger(__name__)

# 上傳檔案路徑前綴 → 解析結果前綴
_UPLOAD_PREFIX = "uploads/"
_FILES_PREFIX = "files/"


def parsed_json_path(upload_object_path: str) -> str:
    """
    將 GCS 上傳路徑轉換為對應的解析結果 JSON 路徑。

        規則：
            - 去掉 uploads/ 前綴，換成 files/ 前綴
            - 副檔名替換為 .json

    範例：
                uploads/org/ws/file.pdf  →  files/org/ws/file.json
                uploads/doc.png          →  files/doc.json
    """
    relative = upload_object_path.removeprefix(_UPLOAD_PREFIX)
    base, _ = os.path.splitext(relative)
        return f"{_FILES_PREFIX}{base}.json"


def upload_json(bucket_name: str, object_path: str, data: dict) -> str:
    """
    將 dict 序列化為 JSON 後上傳至 Cloud Storage。

    Args:
        bucket_name: GCS bucket 名稱（不含 gs:// 前綴）。
        object_path: bucket 內的目標路徑，例如 files/org/ws/file.json
        data:        要序列化的資料，必須可 JSON 序列化。

    Returns:
        str: gs:// 完整 URI，例如 gs://bucket/files/org/ws/file.json
    """
    bucket = fb_storage.bucket(bucket_name)
    blob = bucket.blob(object_path)

    # 緊湊序列化可降低 CPU 與儲存傳輸成本。
    json_bytes = json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    blob.upload_from_string(json_bytes, content_type="application/json")

    uri = f"gs://{bucket_name}/{object_path}"
    logger.info("GCS: uploaded JSON (%d bytes) → %s", len(json_bytes), uri)
    return uri


def download_bytes(bucket_name: str, object_path: str) -> bytes:
    """
    從 Cloud Storage 下載物件並回傳 bytes。

    Args:
        bucket_name: GCS bucket 名稱（不含 gs:// 前綴）。
        object_path: bucket 內的物件路徑。

    Returns:
        bytes: 物件的完整二進位內容。

    Raises:
        google.cloud.exceptions.NotFound: 物件不存在時。
    """
    bucket = fb_storage.bucket(bucket_name)
    blob = bucket.blob(object_path)

    logger.info("GCS: downloading gs://%s/%s", bucket_name, object_path)
    data = blob.download_as_bytes()
    logger.info("GCS: downloaded %d bytes", len(data))
    return data
