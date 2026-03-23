from __future__ import annotations

import hashlib
from typing import Any

from core.config import (
    OPENAI_EMBEDDING_DIMENSIONS,
    OPENAI_EMBEDDING_MODEL,
    RAG_QUERY_CACHE_TTL_SECONDS,
    RAG_REDIS_PREFIX,
)
from infrastructure.external.upstash.clients import redis_get_json, redis_set_json


def build_query_cache_key(*, account_scope: str, query: str, top_k: int) -> str:
    key_base = (
        f"{account_scope}|{query}|{top_k}|"
        f"{OPENAI_EMBEDDING_MODEL}|{OPENAI_EMBEDDING_DIMENSIONS}"
    )
    digest = hashlib.sha256(key_base.encode("utf-8")).hexdigest()
    return f"{RAG_REDIS_PREFIX}:query:{digest}"


def get_query_cache(cache_key: str) -> dict[str, Any] | None:
    return redis_get_json(cache_key)


def save_query_cache(cache_key: str, payload: dict[str, Any]) -> None:
    redis_set_json(cache_key, payload, ttl_seconds=RAG_QUERY_CACHE_TTL_SECONDS)
