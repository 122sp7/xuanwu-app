"""
Input schema for rag_query HTTPS Callable (Rule 4 — Contract / Schema).

All data entering the system through this function must pass through this
schema before being forwarded to the application layer.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class RagQueryRequest:
    """Validated input contract for the rag_query callable."""

    uid: str
    account_id: str
    workspace_id: str
    query: str
    top_k: int | None
    max_age_days: int | None
    taxonomy_filters: list[str]
    require_ready: bool | None

    @classmethod
    def from_raw(cls, uid: str, raw: dict, default_require_ready: bool) -> "RagQueryRequest":
        """Parse and validate raw request data.

        Args:
            uid: authenticated user ID (already extracted from auth context).
            raw: raw request payload dict.
            default_require_ready: server-side default for require_ready flag.

        Raises:
            ValueError: if any required field is missing or invalid.
        """
        if not uid:
            raise ValueError("需先登入才能執行 RAG 查詢")

        account_id = str(raw.get("account_id", "")).strip()
        if not account_id:
            raise ValueError("account_id 為必填欄位")

        workspace_id = str(raw.get("workspace_id", "")).strip()
        if not workspace_id:
            raise ValueError("workspace_id 為必填欄位")

        query = str(raw.get("query", "")).strip()
        if not query:
            raise ValueError("query 為必填欄位")

        top_k: int | None = None
        raw_top_k = raw.get("top_k")
        if raw_top_k is not None:
            try:
                top_k = int(raw_top_k)
            except (TypeError, ValueError):
                top_k = None

        max_age_days: int | None = None
        raw_age = raw.get("max_age_days")
        if raw_age is not None:
            try:
                max_age_days = int(raw_age)
            except (TypeError, ValueError):
                max_age_days = None

        raw_filters = raw.get("taxonomy_filters")
        if isinstance(raw_filters, list):
            taxonomy_filters = [
                str(item or "").strip().lower()
                for item in raw_filters
                if str(item or "").strip()
            ]
        else:
            taxonomy_filters = []

        require_ready: bool | None = None
        raw_ready = raw.get("require_ready")
        if raw_ready is not None:
            if isinstance(raw_ready, bool):
                require_ready = raw_ready
            else:
                text = str(raw_ready).strip().lower()
                if text in {"1", "true", "yes", "on"}:
                    require_ready = True
                elif text in {"0", "false", "no", "off"}:
                    require_ready = False

        return cls(
            uid=uid,
            account_id=account_id,
            workspace_id=workspace_id,
            query=query,
            top_k=top_k,
            max_age_days=max_age_days,
            taxonomy_filters=taxonomy_filters,
            require_ready=require_ready,
        )
