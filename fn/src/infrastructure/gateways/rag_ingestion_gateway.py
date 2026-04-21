"""Infrastructure implementation of RagIngestionGateway.

Handles embedding generation, vector/search upsert, Redis metadata
writes, and stale-vector cleanup — all delegated to focused clients.
"""

from __future__ import annotations

import logging
from typing import Any

from infrastructure.external.openai.embeddings import embed_texts
from infrastructure.external.upstash.clients import (
    delete_search_documents_by_doc as _delete_search_documents_by_doc,
    delete_vectors_by_doc as _delete_vectors_by_doc,
    redis_set_json,
    upsert_search_documents,
    upsert_vectors,
)

logger = logging.getLogger(__name__)


class InfraRagIngestionGateway:
    def embed_texts(self, texts: list[str], model: str) -> list[list[float]]:
        return embed_texts(texts, model=model)

    def upsert_vectors(self, items: list[dict[str, Any]], namespace: str = "") -> Any:
        return upsert_vectors(items, namespace=namespace)

    def upsert_search_documents(self, documents: list[dict[str, Any]]) -> int:
        return upsert_search_documents(documents)

    def redis_set_json(self, key: str, value: dict[str, Any], ttl_seconds: int = 0) -> None:
        redis_set_json(key, value, ttl_seconds=ttl_seconds)

    def delete_vectors_by_doc(self, doc_id: str, namespace: str = "") -> int:
        deleted_vec = _delete_vectors_by_doc(doc_id=doc_id, namespace=namespace)
        deleted_search = _delete_search_documents_by_doc(doc_id=doc_id)
        logger.info(
            "delete_vectors_by_doc: doc_id=%s vector=%d search=%d",
            doc_id,
            deleted_vec,
            deleted_search,
        )
        return deleted_vec
