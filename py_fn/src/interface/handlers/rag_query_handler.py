"""
HTTPS Callable — handle_rag_query：RAG 查詢（Step 7）。
"""

from __future__ import annotations

import logging

from firebase_functions import https_fn

from application.services.document_pipeline import allow_rag_query_rate_limit
from application.use_cases import execute_rag_query
from core.config import (
    RAG_QUERY_DEFAULT_MAX_AGE_DAYS,
    RAG_QUERY_REQUIRE_READY_STATUS,
    RAG_QUERY_RATE_LIMIT_MAX,
    RAG_QUERY_RATE_LIMIT_WINDOW_SECONDS,
)
from interface.handlers._https_helpers import (
    _assert_account_access,
    _assert_workspace_belongs_account,
    _extract_auth_uid,
    _parse_taxonomy_filters,
    _to_bool,
)

logger = logging.getLogger(__name__)


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

    try:
        allowed, remaining = allow_rag_query_rate_limit(
            account_id=account_id,
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
