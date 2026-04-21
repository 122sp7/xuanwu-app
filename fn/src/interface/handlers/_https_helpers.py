"""
HTTPS handler 共用工具 — 驗證、存取控制與輸入解析輔助函數。
供 parse_document / rag_query / rag_reindex 共享使用。
"""

from __future__ import annotations

import logging
from typing import Any

import firebase_admin.firestore as fb_firestore
from firebase_functions import https_fn

from core.storage_uri import parse_gs_uri

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
    return parse_gs_uri(gs_uri)
