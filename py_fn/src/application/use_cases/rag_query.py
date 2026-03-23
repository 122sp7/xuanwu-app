from __future__ import annotations

import logging
import json
from datetime import UTC, datetime, timedelta
from typing import Any

from core.config import RAG_QUERY_DEFAULT_MAX_AGE_DAYS, RAG_QUERY_TOP_K
from domain.repositories import RagQueryGateway, get_rag_query_gateway
from domain.value_objects import RagCitation, RagQueryInput, RagQueryResult

logger = logging.getLogger(__name__)


def _normalize_metadata(value: Any) -> dict[str, Any]:
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


def _match_account(metadata: dict[str, Any], account_scope: str) -> bool:
    candidates = (
        metadata.get("account_id"),
        metadata.get("accountId"),
        metadata.get("account"),
        metadata.get("account_scope"),
    )
    return any(str(value or "").strip() == account_scope for value in candidates)


def _match_workspace(metadata: dict[str, Any], workspace_scope: str) -> bool:
    candidates = (
        metadata.get("workspace_id"),
        metadata.get("workspaceId"),
        metadata.get("space_id"),
        metadata.get("spaceId"),
    )
    return any(str(value or "").strip() == workspace_scope for value in candidates)


def _match_ready_status(metadata: dict[str, Any], require_ready: bool) -> bool:
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


def _match_freshness(metadata: dict[str, Any], max_age_days: int) -> bool:
    if max_age_days <= 0:
        return True

    candidates = (
        metadata.get("indexed_at"),
        metadata.get("parsed_at"),
        metadata.get("uploaded_at"),
    )

    timestamp = next((dt for dt in (_parse_datetime(value) for value in candidates) if dt is not None), None)
    if timestamp is None:
        return False

    cutoff = datetime.now(UTC) - timedelta(days=max_age_days)
    return timestamp >= cutoff


def _match_taxonomy(metadata: dict[str, Any], taxonomy_filters: tuple[str, ...]) -> bool:
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


def _extract_text_candidate(value: Any) -> str:
    if isinstance(value, str):
        return value.strip()

    if isinstance(value, dict):
        candidates = (
            value.get("text"),
            value.get("content"),
            value.get("chunk_text"),
        )
        for candidate in candidates:
            snippet = str(candidate or "").strip()
            if snippet:
                return snippet

    return ""


def _extract_snippet(hit: dict[str, Any], metadata: dict[str, Any]) -> str:
    candidates = (
        hit.get("data"),
        metadata.get("text"),
        metadata.get("chunk_text"),
        metadata.get("content"),
        hit.get("text"),
        hit.get("content"),
    )
    for candidate in candidates:
        snippet = _extract_text_candidate(candidate)
        if snippet:
            return snippet
    return ""


def _resolve_filename(metadata: dict[str, Any], fallback: str | None = None) -> str | None:
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


def execute_rag_query(
    *,
    query: str,
    account_scope: str,
    workspace_scope: str,
    top_k: int | None,
    taxonomy_filters: list[str] | tuple[str, ...] | None,
    max_age_days: int | None,
    require_ready: bool,
    gateway: RagQueryGateway | None = None,
) -> dict:
    """Application use case for RAG query orchestration."""
    gateway = gateway or get_rag_query_gateway()

    request = RagQueryInput.from_raw(
        query=query,
        account_scope=account_scope,
        workspace_scope=workspace_scope,
        top_k=top_k,
        taxonomy_filters=taxonomy_filters,
        max_age_days=max_age_days,
        require_ready=require_ready,
        default_top_k=RAG_QUERY_TOP_K,
        default_max_age_days=RAG_QUERY_DEFAULT_MAX_AGE_DAYS,
    )
    if not request.has_query:
        return {
            "answer": "",
            "citations": [],
            "cache": "miss",
            "vector_hits": 0,
            "search_hits": 0,
            "account_scope": request.account_scope,
            "workspace_scope": request.workspace_scope,
            "taxonomy_filters": list(request.taxonomy_filters),
            "max_age_days": request.max_age_days,
            "require_ready": request.require_ready,
        }

    cache_key = gateway.build_query_cache_key(
        account_scope=request.account_scope,
        query=(
            f"workspace={request.workspace_scope};"
            f"taxonomy={','.join(request.taxonomy_filters)};"
            f"maxAge={request.max_age_days};"
            f"ready={request.require_ready};"
            f"q={request.query}"
        ),
        top_k=request.top_k,
    )
    try:
        cached = gateway.get_query_cache(cache_key)
        if cached and isinstance(cached.get("answer"), str):
            return {
                "answer": cached.get("answer", ""),
                "citations": cached.get("citations", []),
                "cache": "hit",
                "vector_hits": int(cached.get("vector_hits") or 0),
                "search_hits": int(cached.get("search_hits") or 0),
                "account_scope": cached.get("account_scope") or request.account_scope,
                "workspace_scope": cached.get("workspace_scope") or request.workspace_scope,
            }
    except Exception as exc:
        logger.warning("redis query cache read failed: %s", exc)

    retrieval_top_k = request.retrieval_top_k()
    vector = gateway.to_query_vector(request.query)
    vector_hits_raw = gateway.query_vector(vector, top_k=retrieval_top_k)
    search_hits_raw = gateway.query_search(request.query, top_k=retrieval_top_k)

    contexts: list[str] = []
    citations: list[RagCitation] = []
    seen_snippets: set[str] = set()

    raw_vector_hits = len(vector_hits_raw)
    raw_search_hits = len(search_hits_raw)
    dropped_by_workspace = 0
    dropped_by_status = 0
    dropped_by_freshness = 0
    dropped_by_taxonomy = 0

    for hit in vector_hits_raw:
        if not isinstance(hit, dict):
            continue
        metadata = _normalize_metadata(hit.get("metadata"))
        if not metadata:
            continue
        if not _match_account(metadata, request.account_scope):
            continue
        if not _match_workspace(metadata, request.workspace_scope):
            dropped_by_workspace += 1
            continue
        if not _match_ready_status(metadata, request.require_ready):
            dropped_by_status += 1
            continue
        if not _match_freshness(metadata, request.max_age_days):
            dropped_by_freshness += 1
            continue
        if not _match_taxonomy(metadata, request.taxonomy_filters):
            dropped_by_taxonomy += 1
            continue

        snippet = _extract_snippet(hit, metadata)
        if not snippet or snippet in seen_snippets:
            continue

        seen_snippets.add(snippet)
        contexts.append(snippet)
        citations.append(
            RagCitation(
                provider="vector",
                doc_id=metadata.get("doc_id"),
                chunk_id=metadata.get("chunk_id"),
                score=hit.get("score") if isinstance(hit, dict) else None,
                filename=_resolve_filename(metadata),
                json_gcs_uri=metadata.get("json_gcs_uri"),
                account_id=metadata.get("account_id") or "",
                workspace_id=metadata.get("workspace_id") or metadata.get("space_id") or "",
                taxonomy=metadata.get("taxonomy") or metadata.get("semantic_class") or "",
                processing_status=metadata.get("processing_status") or metadata.get("status") or "",
                indexed_at=metadata.get("indexed_at") or "",
            )
        )

    for hit in search_hits_raw:
        if not isinstance(hit, dict):
            continue
        metadata = _normalize_metadata(hit.get("metadata"))
        if not _match_account(metadata, request.account_scope):
            continue
        if not _match_workspace(metadata, request.workspace_scope):
            dropped_by_workspace += 1
            continue
        if not _match_ready_status(metadata, request.require_ready):
            dropped_by_status += 1
            continue
        if not _match_freshness(metadata, request.max_age_days):
            dropped_by_freshness += 1
            continue
        if not _match_taxonomy(metadata, request.taxonomy_filters):
            dropped_by_taxonomy += 1
            continue

        snippet = _extract_snippet(hit, metadata)
        if not snippet or snippet in seen_snippets:
            continue

        seen_snippets.add(snippet)
        contexts.append(snippet)
        citations.append(
            RagCitation(
                provider="search",
                doc_id=metadata.get("doc_id"),
                chunk_id=metadata.get("chunk_id"),
                score=hit.get("score"),
                filename=_resolve_filename(metadata),
                json_gcs_uri=metadata.get("json_gcs_uri"),
                search_id=hit.get("id"),
                account_id=metadata.get("account_id") or "",
                workspace_id=metadata.get("workspace_id") or metadata.get("space_id") or "",
                taxonomy=metadata.get("taxonomy") or metadata.get("semantic_class") or "",
                processing_status=metadata.get("processing_status") or metadata.get("status") or "",
                indexed_at=metadata.get("indexed_at") or "",
            )
        )

    vector_hit_count = len([c for c in citations if c.provider == "vector"])
    search_hit_count = len([c for c in citations if c.provider == "search"])

    context_block = "\n\n---\n\n".join(contexts[:request.top_k])
    if not context_block:
        return RagQueryResult(
            answer="找不到足夠的相關內容。",
            citations=(),
            cache="miss",
            vector_hits=raw_vector_hits,
            search_hits=raw_search_hits,
            account_scope=request.account_scope,
            workspace_scope=request.workspace_scope,
            taxonomy_filters=request.taxonomy_filters,
            max_age_days=request.max_age_days,
            require_ready=request.require_ready,
            debug={
                "vector_candidates": raw_vector_hits,
                "search_candidates": raw_search_hits,
                "retrieval_top_k": retrieval_top_k,
                "workspace_scope": request.workspace_scope,
                "taxonomy_filters": list(request.taxonomy_filters),
                "max_age_days": request.max_age_days,
                "require_ready": request.require_ready,
                "dropped_by_workspace": dropped_by_workspace,
                "dropped_by_status": dropped_by_status,
                "dropped_by_freshness": dropped_by_freshness,
                "dropped_by_taxonomy": dropped_by_taxonomy,
                "reason": "no-context-after-scope-or-text-filter",
            },
        ).to_dict()

    answer = gateway.generate_answer(query=request.query, context_block=context_block)
    result = RagQueryResult(
        answer=answer,
        citations=tuple(citations),
        cache="miss",
        vector_hits=vector_hit_count,
        search_hits=search_hit_count,
        account_scope=request.account_scope,
        workspace_scope=request.workspace_scope,
        taxonomy_filters=request.taxonomy_filters,
        max_age_days=request.max_age_days,
        require_ready=request.require_ready,
    ).to_dict()

    try:
        gateway.save_query_cache(cache_key, result)
    except Exception as exc:
        logger.warning("redis query cache write failed: %s", exc)

    gateway.publish_query_audit(
        query=request.query,
        top_k=request.top_k,
        citation_count=len(citations),
        vector_hits=vector_hit_count,
        search_hits=search_hit_count,
    )

    return result
