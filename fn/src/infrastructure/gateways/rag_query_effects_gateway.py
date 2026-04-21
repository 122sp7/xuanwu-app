"""Infrastructure implementation of RagQueryEffectsGateway."""

from __future__ import annotations

from typing import Any

from infrastructure.audit.qstash import publish_query_audit
from infrastructure.cache.rag_query_cache import save_query_cache


class InfraRagQueryEffectsGateway:
    def save_query_cache(self, cache_key: str, payload: dict[str, Any]) -> None:
        save_query_cache(cache_key, payload)

    def publish_query_audit(
        self,
        *,
        query: str,
        top_k: int,
        citation_count: int,
        vector_hits: int,
        search_hits: int,
    ) -> None:
        publish_query_audit(
            query=query,
            top_k=top_k,
            citation_count=citation_count,
            vector_hits=vector_hits,
            search_hits=search_hits,
        )
