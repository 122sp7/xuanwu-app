"""RAG bounded context — infrastructure layer.

Assembles all RAG-specific infrastructure adapters: cache, vector retrieval,
full-text search, LLM generation, and audit publishing.
"""

from infrastructure.rag.audit import publish_query_audit
from infrastructure.rag.cache import build_query_cache_key, get_query_cache, save_query_cache
from infrastructure.rag.openai_adapter import generate_answer, to_query_vector
from infrastructure.rag.upstash_adapter import query_search, query_vector

__all__ = [
    "publish_query_audit",
    "build_query_cache_key",
    "get_query_cache",
    "save_query_cache",
    "generate_answer",
    "to_query_vector",
    "query_search",
    "query_vector",
]
