"""
Cloud Storage 服務層 — 使用 firebase-admin 的 storage 模組下載物件。

用法：
    from app.services.storage import download_bytes
    data = download_bytes(bucket_name="my-bucket", object_path="uploads/doc.pdf")
"""

import logging

import firebase_admin.storage as fb_storage

logger = logging.getLogger(__name__)


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
