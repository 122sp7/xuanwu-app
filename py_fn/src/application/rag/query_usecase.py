from __future__ import annotations

import logging
import json
from typing import Any

from app.config import RAG_QUERY_TOP_K
from domain.rag import RagCitation, RagQueryInput, RagQueryResult
from infrastructure.rag import (
    build_query_cache_key,
    generate_answer,
    get_query_cache,
    publish_query_audit,
    query_search,
    query_vector,
    save_query_cache,
    to_query_vector,
)

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
        metadata.get("namespace"),
    )
    return any(str(value or "").strip() == account_scope for value in candidates)


def _extract_snippet(hit: dict[str, Any], metadata: dict[str, Any]) -> str:
    candidates = (
        metadata.get("text"),
        metadata.get("chunk_text"),
        metadata.get("content"),
        hit.get("text"),
        hit.get("content"),
    )
    for candidate in candidates:
        snippet = str(candidate or "").strip()
        if snippet:
            return snippet
    return ""


def execute_rag_query(*, query: str, account_scope: str, top_k: int | None) -> dict:
    """Application use case for RAG query orchestration."""
    request = RagQueryInput.from_raw(
        query=query,
        account_scope=account_scope,
        top_k=top_k,
        default_top_k=RAG_QUERY_TOP_K,
    )
    if not request.has_query:
        return {
            "answer": "",
            "citations": [],
            "cache": "miss",
            "vector_hits": 0,
            "search_hits": 0,
            "account_scope": request.account_scope,
        }

    cache_key = build_query_cache_key(
        account_scope=request.account_scope,
        query=request.query,
        top_k=request.top_k,
    )
    try:
        cached = get_query_cache(cache_key)
        if cached and isinstance(cached.get("answer"), str):
            return {
                "answer": cached.get("answer", ""),
                "citations": cached.get("citations", []),
                "cache": "hit",
                "vector_hits": int(cached.get("vector_hits") or 0),
                "search_hits": int(cached.get("search_hits") or 0),
                "account_scope": cached.get("account_scope") or request.account_scope,
            }
    except Exception as exc:
        logger.warning("redis query cache read failed: %s", exc)

    retrieval_top_k = request.retrieval_top_k()
    vector = to_query_vector(request.query)
    vector_hits_raw = query_vector(vector, top_k=retrieval_top_k)
    search_hits_raw = query_search(request.query, top_k=retrieval_top_k)

    contexts: list[str] = []
    citations: list[RagCitation] = []
    seen_snippets: set[str] = set()

    raw_vector_hits = len(vector_hits_raw)
    raw_search_hits = len(search_hits_raw)

    for hit in vector_hits_raw:
        if not isinstance(hit, dict):
            continue
        metadata = _normalize_metadata(hit.get("metadata"))
        if not metadata:
            continue
        if not _match_account(metadata, request.account_scope):
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
                filename=metadata.get("filename"),
                json_gcs_uri=metadata.get("json_gcs_uri"),
                account_id=metadata.get("account_id") or "",
            )
        )

    for hit in search_hits_raw:
        if not isinstance(hit, dict):
            continue
        metadata = _normalize_metadata(hit.get("metadata"))
        if not _match_account(metadata, request.account_scope):
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
                filename=metadata.get("filename"),
                json_gcs_uri=metadata.get("json_gcs_uri"),
                search_id=hit.get("id"),
                account_id=metadata.get("account_id") or "",
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
            debug={
                "vector_candidates": raw_vector_hits,
                "search_candidates": raw_search_hits,
                "retrieval_top_k": retrieval_top_k,
                "reason": "no-context-after-scope-or-text-filter",
            },
        ).to_dict()

    answer = generate_answer(query=request.query, context_block=context_block)
    result = RagQueryResult(
        answer=answer,
        citations=tuple(citations),
        cache="miss",
        vector_hits=vector_hit_count,
        search_hits=search_hit_count,
        account_scope=request.account_scope,
    ).to_dict()

    try:
        save_query_cache(cache_key, result)
    except Exception as exc:
        logger.warning("redis query cache write failed: %s", exc)

    publish_query_audit(
        query=request.query,
        top_k=request.top_k,
        citation_count=len(citations),
        vector_hits=vector_hit_count,
        search_hits=search_hit_count,
    )

    return result
