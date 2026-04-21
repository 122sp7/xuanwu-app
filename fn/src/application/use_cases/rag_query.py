"""
RAG query — application use case orchestration.

Delegates all domain filtering to domain.services.rag_result_filter.
"""

from __future__ import annotations

import logging
from typing import Any

from application.dto import RagQueryEffectPlan, RagQueryExecution
from core.config import RAG_QUERY_DEFAULT_MAX_AGE_DAYS, RAG_QUERY_TOP_K
from domain.repositories import RagQueryGateway, get_rag_query_gateway
from domain.services.rag_result_filter import (
    extract_snippet,
    match_account,
    match_freshness,
    match_ready_status,
    match_taxonomy,
    match_workspace,
    normalize_metadata,
    resolve_filename,
)
from domain.value_objects import RagCitation, RagQueryInput, RagQueryResult

logger = logging.getLogger(__name__)


def _process_hits(
    hits: list[dict[str, Any]],
    provider: str,
    request: RagQueryInput,
    seen_snippets: set[str],
) -> tuple[list[str], list[RagCitation], int, int, int, int]:
    """Filter and map raw retrieval hits into context snippets and citations.

    Returns (contexts, citations, dropped_workspace, dropped_status,
             dropped_freshness, dropped_taxonomy).
    """
    contexts: list[str] = []
    citations: list[RagCitation] = []
    dropped_workspace = dropped_status = dropped_freshness = dropped_taxonomy = 0

    for hit in hits:
        if not isinstance(hit, dict):
            continue
        metadata = normalize_metadata(hit.get("metadata"))
        if not metadata:
            continue
        if not match_account(metadata, request.account_scope):
            continue
        if not match_workspace(metadata, request.workspace_scope):
            dropped_workspace += 1
            continue
        if not match_ready_status(metadata, request.require_ready):
            dropped_status += 1
            continue
        if not match_freshness(metadata, request.max_age_days):
            dropped_freshness += 1
            continue
        if not match_taxonomy(metadata, request.taxonomy_filters):
            dropped_taxonomy += 1
            continue

        snippet = extract_snippet(hit, metadata)
        if not snippet or snippet in seen_snippets:
            continue

        seen_snippets.add(snippet)
        contexts.append(snippet)
        citations.append(
            RagCitation(
                provider=provider,
                doc_id=metadata.get("doc_id"),
                chunk_id=metadata.get("chunk_id"),
                score=hit.get("score") if isinstance(hit, dict) else None,
                filename=resolve_filename(metadata),
                json_gcs_uri=metadata.get("json_gcs_uri"),
                search_id=hit.get("id") if provider == "search" else None,
                account_id=metadata.get("account_id") or "",
                workspace_id=metadata.get("workspace_id") or metadata.get("space_id") or "",
                taxonomy=metadata.get("taxonomy") or metadata.get("semantic_class") or "",
                processing_status=metadata.get("processing_status") or metadata.get("status") or "",
                indexed_at=metadata.get("indexed_at") or "",
            )
        )

    return contexts, citations, dropped_workspace, dropped_status, dropped_freshness, dropped_taxonomy


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
) -> RagQueryExecution:
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
        return RagQueryExecution(
            response={
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
        )

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
            return RagQueryExecution(
                response={
                    "answer": cached.get("answer", ""),
                    "citations": cached.get("citations", []),
                    "cache": "hit",
                    "vector_hits": int(cached.get("vector_hits") or 0),
                    "search_hits": int(cached.get("search_hits") or 0),
                    "account_scope": cached.get("account_scope") or request.account_scope,
                    "workspace_scope": cached.get("workspace_scope") or request.workspace_scope,
                }
            )
    except Exception as exc:
        logger.warning("redis query cache read failed: %s", exc)

    retrieval_top_k = request.retrieval_top_k()
    vector = gateway.to_query_vector(request.query)
    vector_hits_raw = gateway.query_vector(vector, top_k=retrieval_top_k)
    search_hits_raw = gateway.query_search(request.query, top_k=retrieval_top_k)

    seen_snippets: set[str] = set()

    vec_contexts, vec_citations, dw1, ds1, df1, dt1 = _process_hits(
        vector_hits_raw, "vector", request, seen_snippets
    )
    srch_contexts, srch_citations, dw2, ds2, df2, dt2 = _process_hits(
        search_hits_raw, "search", request, seen_snippets
    )

    contexts = vec_contexts + srch_contexts
    citations = vec_citations + srch_citations
    vector_hit_count = len(vec_citations)
    search_hit_count = len(srch_citations)

    context_block = "\n\n---\n\n".join(contexts[: request.top_k])
    if not context_block:
        return RagQueryExecution(
            response=RagQueryResult(
                answer="找不到足夠的相關內容。",
                citations=(),
                cache="miss",
                vector_hits=len(vector_hits_raw),
                search_hits=len(search_hits_raw),
                account_scope=request.account_scope,
                workspace_scope=request.workspace_scope,
                taxonomy_filters=request.taxonomy_filters,
                max_age_days=request.max_age_days,
                require_ready=request.require_ready,
                debug={
                    "vector_candidates": len(vector_hits_raw),
                    "search_candidates": len(search_hits_raw),
                    "retrieval_top_k": retrieval_top_k,
                    "workspace_scope": request.workspace_scope,
                    "taxonomy_filters": list(request.taxonomy_filters),
                    "max_age_days": request.max_age_days,
                    "require_ready": request.require_ready,
                    "dropped_by_workspace": dw1 + dw2,
                    "dropped_by_status": ds1 + ds2,
                    "dropped_by_freshness": df1 + df2,
                    "dropped_by_taxonomy": dt1 + dt2,
                    "reason": "no-context-after-scope-or-text-filter",
                },
            ).to_dict()
        )

    answer = gateway.generate_answer(query=request.query, context_block=context_block)
    response = RagQueryResult(
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
    return RagQueryExecution(
        response=response,
        effect_plan=RagQueryEffectPlan(
            cache_key=cache_key,
            query=request.query,
            top_k=request.top_k,
            citation_count=len(citations),
            vector_hits=vector_hit_count,
            search_hits=search_hit_count,
        ),
    )
