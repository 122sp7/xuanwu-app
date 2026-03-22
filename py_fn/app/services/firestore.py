"""
Firestore 服務層 — 使用 firebase-admin 寫入解析結果。

用法：
    from app.services.firestore import write_parsed_result
    write_parsed_result(doc_id="abc123", text="…", page_count=3)
"""

import logging
from datetime import UTC, datetime

import firebase_admin.firestore as fb_firestore

from app.config import PARSED_RESULTS_COLLECTION

logger = logging.getLogger(__name__)


def write_parsed_result(
    doc_id: str,
    text: str,
    page_count: int,
    mime_type: str,
    source_path: str,
) -> None:
    """
    將 Document AI 解析結果寫入 Firestore。

    Document 路徑：``{PARSED_RESULTS_COLLECTION}/{doc_id}``

    Args:
        doc_id:      文件識別碼（Firestore document ID）。
        text:        Document AI 回傳的全文。
        page_count:  頁數。
        mime_type:   原始文件的 MIME 類型。
        source_path: GCS 物件路徑，供追溯用。
    """
    db = fb_firestore.client()
    ref = db.collection(PARSED_RESULTS_COLLECTION).document(doc_id)

    payload = {
        "text": text,
        "page_count": page_count,
        "mime_type": mime_type,
        "source_path": source_path,
        "parsed_at": datetime.now(UTC),
        "status": "parsed",
    }

    ref.set(payload, merge=True)
    logger.info("Firestore: wrote parsed result to %s/%s", PARSED_RESULTS_COLLECTION, doc_id)
