"""Infrastructure implementation of RagQueryGateway."""

from __future__ import annotations

from typing import Any

from infrastructure.cache.rag_query_cache import build_query_cache_key, get_query_cache
from infrastructure.external.openai.rag_query import generate_answer, to_query_vector
from infrastructure.external.upstash.rag_query import query_search, query_vector


class InfraRagQueryGateway:
    def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str:
        return build_query_cache_key(account_scope=account_scope, query=query, top_k=top_k)

    def get_query_cache(self, cache_key: str) -> dict[str, Any] | None:
        return get_query_cache(cache_key)

    def to_query_vector(self, query: str) -> list[float]:
        from core.config import OPENAI_EMBEDDING_MODEL

        return to_query_vector(query, model=OPENAI_EMBEDDING_MODEL)

    def query_vector(self, vector: list[float], top_k: int) -> list[dict[str, Any]]:
        return query_vector(vector, top_k=top_k)

    def query_search(self, query: str, top_k: int) -> list[dict[str, Any]]:
        return query_search(query, top_k=top_k)

    def generate_answer(self, *, query: str, context_block: str) -> str:
        return generate_answer(query=query, context_block=context_block)
