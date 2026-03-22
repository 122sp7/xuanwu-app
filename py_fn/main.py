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

# ── Firebase Admin SDK 初始化（app/__init__.py 之中）──────────────────────
import app  # noqa: F401  — 副作用：呼叫 firebase_admin.initialize_app()

from firebase_functions import https_fn, storage_fn
from firebase_functions.options import SupportedRegion, set_global_options

from app.config import UPLOAD_BUCKET, GCP_REGION
from app.handlers.https import handle_parse_document
from app.handlers.storage import handle_object_finalized

# ── 全域選項 ─────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)

set_global_options(
    region=SupportedRegion.ASIA_EAST1,
    max_instances=10,
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