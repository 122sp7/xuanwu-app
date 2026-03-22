from __future__ import annotations

import hashlib
import logging
from typing import Any

from app.config import (
    OPENAI_EMBEDDING_DIMENSIONS,
    OPENAI_EMBEDDING_MODEL,
    QSTASH_RAG_AUDIT_URL,
    RAG_QUERY_CACHE_TTL_SECONDS,
    RAG_REDIS_PREFIX,
)
from app.services.embeddings import embed_text
from app.services.llm import chat_complete
from app.services.upstash_clients import (
    publish_qstash_json,
    query_search_documents,
    query_vectors,
    redis_get_json,
    redis_set_json,
)

logger = logging.getLogger(__name__)


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


def to_query_vector(query: str) -> list[float]:
    return embed_text(query, model=OPENAI_EMBEDDING_MODEL)


def query_vector(vector: list[float], top_k: int) -> list[dict[str, Any]]:
    return query_vectors(vector, top_k=top_k, include_metadata=True)


def query_search(query: str, top_k: int) -> list[dict[str, Any]]:
    return query_search_documents(query, top_k=top_k)


def generate_answer(*, query: str, context_block: str) -> str:
    return chat_complete(
        messages=[
            {
                "role": "system",
                "content": "你是 RAG 助手，只能依據提供的 context 回答，若不足請明確說明。",
            },
            {
                "role": "user",
                "content": f"問題：{query}\\n\\nContext:\\n{context_block}",
            },
        ],
        temperature=0.1,
    )


def publish_query_audit(*, query: str, top_k: int, citation_count: int, vector_hits: int, search_hits: int) -> None:
    if not (QSTASH_RAG_AUDIT_URL.startswith("http://") or QSTASH_RAG_AUDIT_URL.startswith("https://")):
        return

    try:
        publish_qstash_json(
            url=QSTASH_RAG_AUDIT_URL,
            body={
                "event": "rag.query.completed",
                "query": query,
                "top_k": top_k,
                "citation_count": citation_count,
                "vector_hits": vector_hits,
                "search_hits": search_hits,
                "cached": False,
            },
        )
    except Exception as exc:
        logger.debug("qstash publish skipped: %s", exc)
