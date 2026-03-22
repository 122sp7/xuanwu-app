"""
py_fn — Firebase Functions (Python) 入口檔
==========================================

所有 Firebase Function 都在這裡用裝飾器宣告；
實際邏輯委派給 app/handlers/ 下的各模組。

部署：
    firebase deploy --only functions

本機模擬：
    firebase emulators:start --only functions,storage,firestore
"""

import logging
import sys
from pathlib import Path

SRC_ROOT = Path(__file__).resolve().parent / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

# ── Firebase Admin SDK 初始化（app/__init__.py 之中）──────────────────────
import app  # noqa: F401  — 副作用：呼叫 firebase_admin.initialize_app()

from firebase_functions import https_fn, storage_fn
from firebase_functions.options import SupportedRegion, set_global_options

from core.config import UPLOAD_BUCKET, GCP_REGION
from interface.handlers import (
    handle_object_finalized,
    handle_parse_document,
    handle_rag_query,
    handle_rag_reindex_document,
)

# ── 全域選項 ─────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)

set_global_options(
    region=SupportedRegion.ASIA_SOUTHEAST1,
    max_instances=10,
    secrets=[
        "OPENAI_API_KEY",
        "UPSTASH_VECTOR_REST_URL",
        "UPSTASH_VECTOR_REST_TOKEN",
        "UPSTASH_REDIS_REST_URL",
        "UPSTASH_REDIS_REST_TOKEN",
        "UPSTASH_SEARCH_REST_URL",
        "UPSTASH_SEARCH_REST_TOKEN",
        "UPSTASH_SEARCH_INDEX",
        "QSTASH_URL",
        "QSTASH_TOKEN",
        "QSTASH_CURRENT_SIGNING_KEY",
        "QSTASH_NEXT_SIGNING_KEY",
        "QSTASH_RAG_AUDIT_URL",
    ],
)

# ── Cloud Storage 觸發器 ──────────────────────────────────────────────────────
# 監聽 UPLOAD_BUCKET 內的新物件 → Document AI 解析 → 寫入 Firestore
@storage_fn.on_object_finalized(bucket=UPLOAD_BUCKET)
def on_document_uploaded(
    event: storage_fn.CloudEvent[storage_fn.StorageObjectData],
) -> None:
    """GCS 物件建立後自動觸發 Document AI 解析流程。"""
    handle_object_finalized(event)


# ── HTTPS Callable ────────────────────────────────────────────────────────────
# 供前端或後端服務主動呼叫，按需解析單一 GCS 物件
@https_fn.on_call()
def parse_document(req: https_fn.CallableRequest) -> dict:
    """手動觸發 Document AI 解析，回傳解析摘要。"""
    return handle_parse_document(req)


@https_fn.on_call()
def rag_query(req: https_fn.CallableRequest) -> dict:
    """RAG 檢索 + 生成查詢。"""
    return handle_rag_query(req)


@https_fn.on_call()
def rag_reindex_document(req: https_fn.CallableRequest) -> dict:
    """手動重新整理文件（normalization + ingestion）。"""
    return handle_rag_reindex_document(req)