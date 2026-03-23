"""
HTTPS Callable 觸發器 — 供前端主動觸發 Document AI 解析。

接受 GCS 檔案路徑，直接呼叫 Document AI（無記憶體複製），
解析全文寫回 GCS JSON，Firestore 僅存索引。

請求格式：
    {
        "account_id": "acc-123",
        "gcs_uri": "gs://my-bucket/uploads/my-doc.pdf",
        "size_bytes": 102400  # 選填
    }

Document AI 會直接從 GCS 讀取檔案，無須下載到 Python 函數記憶體。
結果會保存為：
    - GCS: files/.../*.json（完整解析）
    - Firestore: accounts/{account_id}/documents/{doc_id}（索引）

回應格式（立即返回）：
    {
        "doc_id": "my-doc",
        "status": "processing"  // 實際解析在後台進行（通醫 2-5 秒）
    }

前端應監聽 Firestore 文件狀態變化以追蹤進度。
"""

import logging
import os
import time
import json
from typing import Any

from firebase_functions import https_fn
import firebase_admin.firestore as fb_firestore

from application.rag import execute_rag_query
from application.use_cases.rag_ingestion import ingest_document_for_rag
from core.config import (
    RAG_QUERY_DEFAULT_MAX_AGE_DAYS,
    RAG_QUERY_REQUIRE_READY_STATUS,
    RAG_QUERY_RATE_LIMIT_MAX,
    RAG_QUERY_RATE_LIMIT_WINDOW_SECONDS,
)
from infrastructure.external.documentai.client import process_document_gcs
from infrastructure.external.upstash.clients import redis_fixed_window_allow
from infrastructure.persistence.firestore.document_repository import (
    init_document,
    mark_rag_ready,
    record_error,
    record_rag_error,
    update_parsed,
)
from infrastructure.persistence.storage.client import download_bytes, parsed_json_path, upload_json

logger = logging.getLogger(__name__)


def _extract_auth_uid(req: https_fn.CallableRequest) -> str:
    auth = getattr(req, "auth", None)
    if auth is None:
        return ""
    if isinstance(auth, dict):
        return str(auth.get("uid", "")).strip()
    uid = str(getattr(auth, "uid", "")).strip()
    if uid:
        return uid
    token = getattr(auth, "token", None)
    if isinstance(token, dict):
        return str(token.get("uid", "")).strip()
    return ""


def _assert_account_access(uid: str, account_id: str) -> None:
    if uid == account_id:
        return

    db = fb_firestore.client()
    snap = db.collection("accounts").document(account_id).get()
    if not snap.exists:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.PERMISSION_DENIED,
            "account not found or inaccessible",
        )

    data = snap.to_dict() or {}
    owner_id = str(data.get("ownerId", "")).strip()
    member_ids = data.get("memberIds") if isinstance(data.get("memberIds"), list) else []
    member_set = {str(item or "").strip() for item in member_ids}
    if owner_id == uid or uid in member_set:
        return

    raise https_fn.HttpsError(
        https_fn.FunctionsErrorCode.PERMISSION_DENIED,
        "you do not have access to this account scope",
    )


def _assert_workspace_belongs_account(account_id: str, workspace_id: str) -> None:
    db = fb_firestore.client()
    snap = db.collection("workspaces").document(workspace_id).get()
    if not snap.exists:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "workspace not found",
        )

    data = snap.to_dict() or {}
    bound_account_id = str(data.get("accountId", "")).strip()
    if bound_account_id != account_id:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.PERMISSION_DENIED,
            "workspace does not belong to account scope",
        )


def _parse_taxonomy_filters(raw_value: Any) -> list[str]:
    if not isinstance(raw_value, list):
        return []
    return [str(item or "").strip().lower() for item in raw_value if str(item or "").strip()]


def _to_bool(raw_value: Any, default_value: bool) -> bool:
    if isinstance(raw_value, bool):
        return raw_value
    raw = str(raw_value or "").strip().lower()
    if not raw:
        return default_value
    if raw in {"1", "true", "yes", "on"}:
        return True
    if raw in {"0", "false", "no", "off"}:
        return False
    return default_value


def _parse_gs_uri(gs_uri: str) -> tuple[str, str]:
    if not gs_uri.startswith("gs://"):
        raise ValueError("gcs uri must start with gs://")
    path_part = gs_uri.split("gs://", 1)[1]
    if "/" not in path_part:
        raise ValueError("gcs uri must include object path")
    bucket_name, object_path = path_part.split("/", 1)
    return bucket_name, object_path


def handle_parse_document(req: https_fn.CallableRequest) -> dict:
    """
    HTTPS Callable：主動觸發單一文件的 Document AI 解析。

    輸入 GCS URI，Document AI 直接從 Cloud Storage 讀取並解析。
    Firestore 會記錄完整的 lifecycle（processing → completed/error）。

    Args:
        req.data: {
            "account_id": "acc-123",                # 必填
            "gcs_uri": "gs://bucket/path/file.pdf",  # 必填
            "mime_type": "application/pdf",           # 選填；如果省略則由副檔名推測
            "size_bytes": 102400                       # 選填
        }

    Returns:
        dict: {
            "doc_id": "file",
            "status": "processing"
        }

    Raises:
        https_fn.HttpsError: 缺少必填欄位時。
    """
    data: dict = req.data or {}
    account_id = str(data.get("account_id", "")).strip()
    workspace_id = str(data.get("workspace_id", "")).strip()
    if not account_id:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "account_id 為必填欄位",
        )
    if not workspace_id:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "workspace_id 為必填欄位",
        )

    gcs_uri: str = data.get("gcs_uri", "").strip()
    if not gcs_uri or not gcs_uri.startswith("gs://"):
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "gcs_uri 為必填欄位（格式：gs://bucket/path）",
        )

    # 解析 GCS URI 得到儲存檔名，用於 doc_id。
    path_part = gcs_uri.split("gs://", 1)[1]  # "bucket/path/to/file.pdf"
    storage_filename = os.path.basename(path_part)     # "file.pdf"
    doc_id, ext = os.path.splitext(storage_filename)   # "file", ".pdf"
    filename = (
        str(data.get("filename", "")).strip()
        or str(data.get("original_filename", "")).strip()
        or str(data.get("display_name", "")).strip()
        or storage_filename
    )

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

    size_bytes = data.get("size_bytes", 0)
    logger.info("parse_document callable: %s → doc_id=%s", gcs_uri, doc_id)

    # ── 初始化 Firestore document ───────────────────────────────────────────
    try:
        init_document(
            doc_id=doc_id,
            gcs_uri=gcs_uri,
            filename=filename,
            size_bytes=int(size_bytes),
            mime_type=mime_type,
            account_id=account_id,
            workspace_id=workspace_id,
        )
    except Exception as exc:
        logger.exception("Failed to init document %s: %s", doc_id, exc)
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INTERNAL,
            "Failed to initialize document",
        ) from exc

    # 解析 gs://bucket/path，取得 bucket 與 object_path
    bucket_name, object_path = path_part.split("/", 1)

    # ── 同步解析（保持函數活躍直到完成） ─────────────────────────────────────
    start_time = time.time()
    try:
        parsed = process_document_gcs(gcs_uri=gcs_uri, mime_type=mime_type)
        extraction_ms = int((time.time() - start_time) * 1000)

        # 解析結果全文寫回 GCS JSON（與 uploads 目錄結構對應）
        json_object_path = parsed_json_path(object_path)
        json_gcs_uri = upload_json(
            bucket_name=bucket_name,
            object_path=json_object_path,
            data={
                "doc_id": doc_id,
                "account_id": account_id,
                "workspace_id": workspace_id,
                "source_gcs_uri": gcs_uri,
                "filename": filename,
                "display_name": filename,
                "original_filename": filename,
                "page_count": parsed.page_count,
                "extraction_ms": extraction_ms,
                "text": parsed.text,
            },
        )

        update_parsed(
            doc_id=doc_id,
            json_gcs_uri=json_gcs_uri,
            page_count=parsed.page_count,
            extraction_ms=extraction_ms,
            account_id=account_id,
        )

        # Step 5/6: RAG ingestion（embed + vector + ready）
        try:
            rag = ingest_document_for_rag(
                doc_id=doc_id,
                filename=filename,
                source_gcs_uri=gcs_uri,
                json_gcs_uri=json_gcs_uri,
                text=parsed.text,
                page_count=parsed.page_count,
                account_id=account_id,
                workspace_id=workspace_id,
            )
            mark_rag_ready(
                doc_id=doc_id,
                chunk_count=rag.chunk_count,
                vector_count=rag.vector_count,
                embedding_model=rag.embedding_model,
                embedding_dimensions=rag.embedding_dimensions,
                raw_chars=rag.raw_chars,
                normalized_chars=rag.normalized_chars,
                normalization_version=rag.normalization_version,
                language_hint=rag.language_hint,
                account_id=account_id,
            )
        except Exception as rag_exc:
            logger.exception("RAG ingestion failed for %s: %s", doc_id, rag_exc)
            record_rag_error(doc_id, str(rag_exc)[:200], account_id=account_id)

        logger.info(
            "✓ parse_document done: doc_id=%s (%d pages, %d ms) → %s",
            doc_id,
            parsed.page_count,
            extraction_ms,
            json_gcs_uri,
        )
    except Exception as exc:
        logger.exception("parse_document failed for %s: %s", doc_id, exc)
        record_error(doc_id, str(exc)[:200], account_id=account_id)

    # 立即回覆（無論成功或失敗，Firestore 狀態已更新）
    return {
        "account_scope": account_id,
        "doc_id": doc_id,
        "status": "processing",  # 前端應監聽 Firestore 的實際狀態
    }


def handle_rag_query(req: https_fn.CallableRequest) -> dict:
    """HTTPS Callable：RAG 查詢（Step 7）。"""
    uid = _extract_auth_uid(req)
    if not uid:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.UNAUTHENTICATED,
            "需先登入才能執行 RAG 查詢",
        )

    data: dict = req.data or {}
    query = str(data.get("query", "")).strip()
    account_id = str(data.get("account_id", "")).strip()
    workspace_id = str(data.get("workspace_id", "")).strip()
    if not account_id:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "account_id 為必填欄位",
        )
    if not query:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "query 為必填欄位",
        )
    if not workspace_id:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "workspace_id 為必填欄位",
        )

    _assert_account_access(uid, account_id)
    _assert_workspace_belongs_account(account_id, workspace_id)

    top_k = data.get("top_k")
    try:
        top_k_int = int(top_k) if top_k is not None else None
    except Exception:
        top_k_int = None

    try:
        max_age_days = int(data.get("max_age_days")) if data.get("max_age_days") is not None else None
    except Exception:
        max_age_days = None

    taxonomy_filters = _parse_taxonomy_filters(data.get("taxonomy_filters"))
    require_ready = _to_bool(data.get("require_ready"), RAG_QUERY_REQUIRE_READY_STATUS)

    limit_key = f"rag:rl:{account_id}"
    try:
        allowed, remaining = redis_fixed_window_allow(
            key=limit_key,
            max_requests=RAG_QUERY_RATE_LIMIT_MAX,
            window_seconds=RAG_QUERY_RATE_LIMIT_WINDOW_SECONDS,
        )
    except Exception as exc:
        logger.warning("rag_query rate-limit skipped: %s", exc)
        allowed, remaining = True, -1

    if not allowed:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.RESOURCE_EXHAUSTED,
            "RAG query rate limit exceeded, please try again later.",
        )

    result = execute_rag_query(
        query=query,
        top_k=top_k_int,
        account_scope=account_id,
        workspace_scope=workspace_id,
        taxonomy_filters=taxonomy_filters,
        max_age_days=max_age_days or RAG_QUERY_DEFAULT_MAX_AGE_DAYS,
        require_ready=require_ready,
    )
    response = {
        "answer": result.get("answer", ""),
        "citations": result.get("citations", []),
        "cache": result.get("cache", "miss"),
        "vector_hits": result.get("vector_hits", 0),
        "search_hits": result.get("search_hits", 0),
        "account_scope": result.get("account_scope", account_id),
        "workspace_scope": result.get("workspace_scope", workspace_id),
        "taxonomy_filters": result.get("taxonomy_filters", taxonomy_filters),
        "max_age_days": result.get("max_age_days", max_age_days or RAG_QUERY_DEFAULT_MAX_AGE_DAYS),
        "require_ready": result.get("require_ready", require_ready),
        "rate_limit_remaining": remaining,
    }
    if isinstance(result.get("debug"), dict):
        response["debug"] = result["debug"]
    return response


def handle_rag_reindex_document(req: https_fn.CallableRequest) -> dict:
    """HTTPS Callable：手動觸發單一文件的 Normalization + RAG ingestion。"""
    data: dict = req.data or {}

    account_id = str(data.get("account_id", "")).strip()
    doc_id = str(data.get("doc_id", "")).strip()
    json_gcs_uri = str(data.get("json_gcs_uri", "")).strip()
    source_gcs_uri = str(data.get("source_gcs_uri", "")).strip()
    workspace_id = str(data.get("workspace_id", "")).strip()
    filename = (
        str(data.get("filename", "")).strip()
        or str(data.get("display_name", "")).strip()
        or str(data.get("original_filename", "")).strip()
        or doc_id
    )

    if not account_id:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "account_id 為必填欄位",
        )

    if not doc_id:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "doc_id 為必填欄位",
        )
    if not json_gcs_uri:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            "json_gcs_uri 為必填欄位",
        )

    try:
        page_count = int(data.get("page_count", 0) or 0)
    except Exception:
        page_count = 0

    try:
        bucket_name, object_path = _parse_gs_uri(json_gcs_uri)
        json_bytes = download_bytes(bucket_name=bucket_name, object_path=object_path)
        parsed_payload = json.loads(json_bytes.decode("utf-8")) if json_bytes else {}

        text = str(parsed_payload.get("text", "")).strip()
        if not text:
            raise ValueError("json 內容缺少 text")

        if not source_gcs_uri:
            source_gcs_uri = str(parsed_payload.get("source_gcs_uri", "")).strip()
        if not workspace_id:
            workspace_id = str(parsed_payload.get("workspace_id", "")).strip()
        if not workspace_id:
            workspace_id = str((parsed_payload.get("metadata") or {}).get("space_id", "")).strip()
        if not filename:
            filename = (
                str(parsed_payload.get("filename", "")).strip()
                or str(parsed_payload.get("display_name", "")).strip()
                or str(parsed_payload.get("original_filename", "")).strip()
                or doc_id
            )
        if page_count <= 0:
            page_count = int(parsed_payload.get("page_count", 0) or 0)
        if not workspace_id:
            raise https_fn.HttpsError(
                https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
                "workspace_id 為必填欄位",
            )

        rag = ingest_document_for_rag(
            doc_id=doc_id,
            filename=filename,
            source_gcs_uri=source_gcs_uri,
            json_gcs_uri=json_gcs_uri,
            text=text,
            page_count=page_count,
            account_id=account_id,
            workspace_id=workspace_id,
        )

        mark_rag_ready(
            doc_id=doc_id,
            chunk_count=rag.chunk_count,
            vector_count=rag.vector_count,
            embedding_model=rag.embedding_model,
            embedding_dimensions=rag.embedding_dimensions,
            raw_chars=rag.raw_chars,
            normalized_chars=rag.normalized_chars,
            normalization_version=rag.normalization_version,
            language_hint=rag.language_hint,
            account_id=account_id,
        )

        return {
            "account_scope": account_id,
            "doc_id": doc_id,
            "status": "ready",
            "chunk_count": rag.chunk_count,
            "vector_count": rag.vector_count,
            "raw_chars": rag.raw_chars,
            "normalized_chars": rag.normalized_chars,
            "normalization_version": rag.normalization_version,
            "language_hint": rag.language_hint,
        }
    except Exception as exc:
        logger.exception("rag_reindex_document failed for %s: %s", doc_id, exc)
        record_rag_error(doc_id, str(exc)[:200], account_id=account_id)
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INTERNAL,
            f"rag_reindex_document 失敗：{str(exc)[:200]}",
        ) from exc
