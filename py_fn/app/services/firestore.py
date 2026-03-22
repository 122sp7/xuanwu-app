"""
Firestore 服務層 — 使用 firebase-admin 管理完整的 document lifecycle。

Firestore 只存輕量索引（供 /dev-tools 列出已上傳檔案），
解析全文以 JSON 格式存回 GCS 的對應路徑（files/ 前綴）。

Document Schema:
    {
        "id": "doc-abc123",
        "status": "processing" | "completed" | "error",
        "source": {
            "gcs_uri": "gs://bucket/uploads/file.pdf",
            "filename": "file.pdf",
            "size_bytes": 102400,
            "uploaded_at": "2026-03-22T...",
            "mime_type": "application/pdf"
        },
        "parsed": {
            "json_gcs_uri": "gs://bucket/files/file.json",   // 全文 JSON 位置
            "page_count": 5,
            "parsed_at": "2026-03-22T...",
            "extraction_ms": 1234
        },
        "error": {  // 只在 status=error 時出現
            "message": "...",
            "timestamp": "2026-03-22T..."
        }
    }

用法：
    init_document(doc_id, gcs_uri, filename, size_bytes, mime_type)
    update_parsed(doc_id, json_gcs_uri, page_count, extraction_ms)
    record_error(doc_id, message)
"""

import logging
import time
from datetime import UTC, datetime

import firebase_admin.firestore as fb_firestore

from app.config import PARSED_RESULTS_COLLECTION

logger = logging.getLogger(__name__)


def init_document(
    doc_id: str,
    gcs_uri: str,
    filename: str,
    size_bytes: int,
    mime_type: str,
) -> None:
    """
    初始化 Firestore document，標記為 processing 狀態。

    在檔案上傳到 GCS 時呼叫，建立初始的 source metadata。

    Args:
        doc_id:      文件識別碼。
        gcs_uri:     GCS 位置，例如 gs://bucket/path/file.pdf
        filename:    原始檔名。
        size_bytes:  文件大小（位元組）。
        mime_type:   MIME 類型。
    """
    db = fb_firestore.client()
    ref = db.collection(PARSED_RESULTS_COLLECTION).document(doc_id)

    payload = {
        "id": doc_id,
        "status": "processing",
        "source": {
            "gcs_uri": gcs_uri,
            "filename": filename,
            "size_bytes": size_bytes,
            "uploaded_at": datetime.now(UTC),
            "mime_type": mime_type,
        },
    }

    ref.set(payload)
    logger.info("Firestore: init document %s → status=processing", doc_id)


def update_parsed(
    doc_id: str,
    json_gcs_uri: str,
    page_count: int,
    extraction_ms: int = 0,
) -> None:
    """
    更新 document 的解析結果索引，標記為 completed 狀態。

    全文內容已寫入 GCS JSON 檔（json_gcs_uri），
    Firestore 只保留輕量索引供前端列表使用。

    Args:
        doc_id:         文件識別碼。
        json_gcs_uri:   GCS JSON 檔案位置，例如 gs://bucket/files/file.json
        page_count:     頁數。
        extraction_ms:  解析耗時（毫秒），非必填。
    """
    db = fb_firestore.client()
    ref = db.collection(PARSED_RESULTS_COLLECTION).document(doc_id)

    payload = {
        "status": "completed",
        "parsed": {
            "json_gcs_uri": json_gcs_uri,
            "page_count": page_count,
            "parsed_at": datetime.now(UTC),
            "extraction_ms": extraction_ms,
        },
    }

    ref.update(payload)
    logger.info("Firestore: updated document %s → status=completed (%d pages)", doc_id, page_count)


def record_error(doc_id: str, message: str) -> None:
    """
    記錄解析錯誤，標記為 error 狀態。

    在 Document AI 呼叫失敗時呼叫。

    Args:
        doc_id:  文件識別碼。
        message: 錯誤訊息。
    """
    db = fb_firestore.client()
    ref = db.collection(PARSED_RESULTS_COLLECTION).document(doc_id)

    payload = {
        "status": "error",
        "error": {
            "message": message,
            "timestamp": datetime.now(UTC),
        },
    }

    ref.update(payload)
    logger.error("Firestore: recorded error for document %s: %s", doc_id, message)
