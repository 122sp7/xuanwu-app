# Backward-compatibility shim — canonical definitions in infrastructure/rag/upstash_adapter.py
from infrastructure.rag.upstash_adapter import query_search, query_vector

__all__ = ["query_search", "query_vector"]
