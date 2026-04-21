"""
Storage 觸發器 — 監聽 GCS 物件建立事件，自動送 Document AI 解析。

流程：
    GCS object.finalized（uploads/ 前綴）
        → 建立初始 Firestore document（status=processing）
        → Document AI 直接從 GCS URI 讀取
        → 將解析全文以 JSON 格式寫回 GCS（files/ 前綴，同目錄結構）
        → 更新 Firestore 輕量索引（status=completed，含 json_gcs_uri）
        → 如失敗，記錄 error

Firestore 只存索引（供 /dev-tools 顯示已上傳檔案），
完整解析結果透過 json_gcs_uri 讀取 GCS JSON 檔。
"""

import logging
import os
from typing import Any

from firebase_functions import storage_fn

from application.services.document_pipeline import get_document_status_gateway
from application.use_cases.parse_document_pipeline import ParseDocumentCommand, execute_parse_document

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


def _extract_account_id(
    object_path: str,
    event_metadata: dict | None,
) -> str | None:
    """Best-effort account scope binding for storage-triggered uploads.

    Priority:
    1) custom metadata field `account_id`
    2) path convention: uploads/{accountId}/...
    3) fallback: None (reject write)
    """
    if isinstance(event_metadata, dict):
        from_meta = str(event_metadata.get("account_id", "")).strip()
        if from_meta:
            return from_meta

    prefix = f"{WATCH_PREFIX}"
    if object_path.startswith(prefix):
        remainder = object_path[len(prefix):]
        # uploads/{accountId}/file.pdf
        if "/" in remainder:
            candidate = remainder.split("/", 1)[0].strip()
            if candidate:
                return candidate

    return None


def _extract_workspace_id(event_metadata: dict | None) -> str | None:
    if not isinstance(event_metadata, dict):
        return None
    workspace_id = str(event_metadata.get("workspace_id", "")).strip()
    return workspace_id or None


def _extract_display_filename(object_path: str, event_metadata: dict | None) -> str:
    candidates: tuple[Any, ...] = ()
    if isinstance(event_metadata, dict):
        candidates = (
            event_metadata.get("filename"),
            event_metadata.get("original_filename"),
            event_metadata.get("display_name"),
            event_metadata.get("originalFileName"),
        )

    for candidate in candidates:
        filename = str(candidate or "").strip()
        if filename:
            return filename

    return os.path.basename(object_path)


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

    account_id = _extract_account_id(object_path, data.metadata)
    if not account_id:
        logger.error("GCS: missing account_id for %s, skipping", object_path)
        return
    workspace_id = _extract_workspace_id(data.metadata)
    if not workspace_id:
        logger.error("GCS: missing workspace_id for %s, skipping", object_path)
        return

    storage_filename = os.path.basename(object_path)
    display_filename = _extract_display_filename(object_path, data.metadata)
    doc_id, _ = os.path.splitext(storage_filename)
    gcs_uri = f"gs://{bucket_name}/{object_path}"
    logger.info("GCS finalized: %s → doc_id=%s", gcs_uri, doc_id)

    status_gateway = get_document_status_gateway()
    try:
        execute_parse_document(
            ParseDocumentCommand(
                doc_id=doc_id,
                gcs_uri=gcs_uri,
                bucket_name=bucket_name,
                object_path=object_path,
                filename=display_filename,
                size_bytes=size_bytes,
                mime_type=mime_type,
                account_id=account_id,
                workspace_id=workspace_id,
                parser="layout",
                run_rag=True,
            )
        )
    except Exception as exc:
        logger.exception("Document AI failed for %s: %s", doc_id, exc)
        status_gateway.record_error(doc_id, str(exc)[:200], account_id=account_id)
