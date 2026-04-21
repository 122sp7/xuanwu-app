"""
HTTPS Callable — handle_rag_query：RAG 查詢（Step 7）。

Schema validation (Rule 4) is performed via RagQueryRequest.from_raw()
before any application-layer call.
"""

from __future__ import annotations

import logging

from firebase_functions import https_fn

from application.services.authorization import get_authorization
from application.services.document_pipeline import allow_rag_query_rate_limit
from application.services.rag_query_effects import persist_rag_query_effects
from application.use_cases import execute_rag_query
from core.auth_errors import AuthorizationError, UnauthenticatedError
from core.config import (
    RAG_QUERY_DEFAULT_MAX_AGE_DAYS,
    RAG_QUERY_REQUIRE_READY_STATUS,
    RAG_QUERY_RATE_LIMIT_MAX,
    RAG_QUERY_RATE_LIMIT_WINDOW_SECONDS,
)
from interface.handlers._https_helpers import _extract_auth_uid
from interface.schemas.rag_query import RagQueryRequest

logger = logging.getLogger(__name__)


def handle_rag_query(req: https_fn.CallableRequest) -> dict:
    """HTTPS Callable：RAG 查詢（Step 7）."""
    uid = _extract_auth_uid(req)
    if not uid:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.UNAUTHENTICATED,
            "authentication required",
        )

    try:
        schema = RagQueryRequest.from_raw(
            uid=uid,
            raw=req.data or {},
            default_require_ready=RAG_QUERY_REQUIRE_READY_STATUS,
        )
    except ValueError as exc:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            str(exc),
        ) from exc

    auth_gateway = get_authorization()
    try:
        auth_gateway.assert_actor_can_access_account(
            actor_id=schema.uid,
            account_id=schema.account_id,
        )
        auth_gateway.assert_workspace_belongs_account(
            account_id=schema.account_id,
            workspace_id=schema.workspace_id,
        )
    except UnauthenticatedError as exc:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.UNAUTHENTICATED,
            str(exc),
        ) from exc
    except AuthorizationError as exc:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.PERMISSION_DENIED,
            str(exc),
        ) from exc

    require_ready = (
        schema.require_ready
        if schema.require_ready is not None
        else RAG_QUERY_REQUIRE_READY_STATUS
    )
    max_age_days = schema.max_age_days if schema.max_age_days is not None else RAG_QUERY_DEFAULT_MAX_AGE_DAYS

    try:
        allowed, remaining = allow_rag_query_rate_limit(
            account_id=schema.account_id,
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

    execution = execute_rag_query(
        query=schema.query,
        top_k=schema.top_k,
        account_scope=schema.account_id,
        workspace_scope=schema.workspace_id,
        taxonomy_filters=schema.taxonomy_filters,
        max_age_days=max_age_days,
        require_ready=require_ready,
    )
    result = execution.response
    if execution.effect_plan is not None:
        persist_rag_query_effects(
            effect_plan=execution.effect_plan,
            response=result,
        )
    response = {
        "answer": result.get("answer", ""),
        "citations": result.get("citations", []),
        "cache": result.get("cache", "miss"),
        "vector_hits": result.get("vector_hits", 0),
        "search_hits": result.get("search_hits", 0),
        "account_scope": result.get("account_scope", schema.account_id),
        "workspace_scope": result.get("workspace_scope", schema.workspace_id),
        "taxonomy_filters": result.get("taxonomy_filters", schema.taxonomy_filters),
        "max_age_days": result.get("max_age_days", max_age_days),
        "require_ready": result.get("require_ready", require_ready),
        "rate_limit_remaining": remaining,
    }
    if isinstance(result.get("debug"), dict):
        response["debug"] = result["debug"]
    return response
