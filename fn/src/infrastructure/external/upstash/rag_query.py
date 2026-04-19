from __future__ import annotations

from core.config import RAG_VECTOR_NAMESPACE
from infrastructure.external.upstash.clients import query_search_documents, query_vectors


def query_vector(vector: list[float], top_k: int) -> list[dict]:
    return query_vectors(
        vector,
        top_k=top_k,
        include_metadata=True,
        include_data=True,
        namespace=RAG_VECTOR_NAMESPACE,
    )


def query_search(query: str, top_k: int) -> list[dict]:
    return query_search_documents(query, top_k=top_k)
