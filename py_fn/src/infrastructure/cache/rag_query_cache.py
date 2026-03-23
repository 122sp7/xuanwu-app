# Backward-compatibility shim — canonical definitions in infrastructure/rag/cache.py
from infrastructure.rag.cache import build_query_cache_key, get_query_cache, save_query_cache

__all__ = ["build_query_cache_key", "get_query_cache", "save_query_cache"]
