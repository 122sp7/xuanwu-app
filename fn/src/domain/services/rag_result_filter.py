"""
Domain Service — RAG result filtering and snippet extraction.

Pure business logic for matching and ranking retrieval hits against
request scope constraints.  No infrastructure dependency.
"""

from __future__ import annotations

import json
import logging
from datetime import UTC, datetime, timedelta
from typing import Any

logger = logging.getLogger(__name__)


def normalize_metadata(value: Any) -> dict[str, Any]:
    if isinstance(value, dict):
        return value
    if isinstance(value, str):
        raw = value.strip()
        if not raw:
            return {}
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            return {}
    return {}


def match_account(metadata: dict[str, Any], account_scope: str) -> bool:
    candidates = (
        metadata.get("account_id"),
        metadata.get("accountId"),
        metadata.get("account"),
        metadata.get("account_scope"),
    )
    return any(str(value or "").strip() == account_scope for value in candidates)


def match_workspace(metadata: dict[str, Any], workspace_scope: str) -> bool:
    candidates = (
        metadata.get("workspace_id"),
        metadata.get("workspaceId"),
        metadata.get("space_id"),
        metadata.get("spaceId"),
    )
    return any(str(value or "").strip() == workspace_scope for value in candidates)


def match_ready_status(metadata: dict[str, Any], require_ready: bool) -> bool:
    if not require_ready:
        return True
    candidates = (
        metadata.get("processing_status"),
        metadata.get("rag_status"),
        metadata.get("status"),
    )
    return any(str(value or "").strip().lower() == "ready" for value in candidates)


def _parse_datetime(value: Any) -> datetime | None:
    if isinstance(value, datetime):
        return value.astimezone(UTC) if value.tzinfo else value.replace(tzinfo=UTC)
    raw = str(value or "").strip()
    if not raw:
        return None
    try:
        normalized = raw.replace("Z", "+00:00")
        parsed = datetime.fromisoformat(normalized)
        return parsed.astimezone(UTC) if parsed.tzinfo else parsed.replace(tzinfo=UTC)
    except Exception:
        return None


def match_freshness(metadata: dict[str, Any], max_age_days: int) -> bool:
    if max_age_days <= 0:
        return True

    candidates = (
        metadata.get("indexed_at"),
        metadata.get("parsed_at"),
        metadata.get("uploaded_at"),
    )

    timestamp = next(
        (dt for dt in (_parse_datetime(value) for value in candidates) if dt is not None),
        None,
    )
    if timestamp is None:
        return False

    cutoff = datetime.now(UTC) - timedelta(days=max_age_days)
    return timestamp >= cutoff


def match_taxonomy(metadata: dict[str, Any], taxonomy_filters: tuple[str, ...]) -> bool:
    if not taxonomy_filters:
        return True

    normalized_filters = {item.lower() for item in taxonomy_filters if item}
    if not normalized_filters:
        return True

    candidates = {
        str(metadata.get("taxonomy") or "").strip().lower(),
        str(metadata.get("semantic_class") or "").strip().lower(),
        str(metadata.get("semantic_type") or "").strip().lower(),
    }

    tags = metadata.get("tags")
    if isinstance(tags, list):
        candidates.update(str(item or "").strip().lower() for item in tags)

    candidates.discard("")
    return bool(candidates.intersection(normalized_filters))


def extract_text_candidate(value: Any) -> str:
    if isinstance(value, str):
        return value.strip()

    if isinstance(value, dict):
        for key in ("text", "content", "chunk_text"):
            snippet = str(value.get(key) or "").strip()
            if snippet:
                return snippet

    return ""


def extract_snippet(hit: dict[str, Any], metadata: dict[str, Any]) -> str:
    candidates = (
        hit.get("data"),
        metadata.get("text"),
        metadata.get("chunk_text"),
        metadata.get("content"),
        hit.get("text"),
        hit.get("content"),
    )
    for candidate in candidates:
        snippet = extract_text_candidate(candidate)
        if snippet:
            return snippet
    return ""


def resolve_filename(metadata: dict[str, Any], fallback: str | None = None) -> str | None:
    candidates = (
        metadata.get("filename"),
        metadata.get("display_name"),
        metadata.get("original_filename"),
        metadata.get("title"),
        fallback,
    )
    for value in candidates:
        name = str(value or "").strip()
        if name:
            return name
    return None
