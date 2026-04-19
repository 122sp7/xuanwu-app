"""
Upstash clients — 向後相容的重新匯出桶。
各功能已拆分至對應的聚焦模組：
  - vector_client.py  (upsert_vectors, query_vectors)
  - redis_client.py   (redis_get_json, redis_set_json, redis_fixed_window_allow)
  - search_client.py  (upsert_search_documents, query_search_documents)
  - qstash_client.py  (publish_qstash_json)
  - _base.py          (UpstashConfigError, UpstashSdkError)

此檔案保留所有原始公開符號以維持向後相容。
"""

from __future__ import annotations

from infrastructure.external.upstash._base import (
    UpstashConfigError,
    UpstashSdkError,
)
from infrastructure.external.upstash.vector_client import (
    get_vector_index,
    upsert_vectors,
    query_vectors,
)
from infrastructure.external.upstash.redis_client import (
    get_redis_client,
    redis_get_json,
    redis_set_json,
    redis_fixed_window_allow,
)
from infrastructure.external.upstash.search_client import (
    get_search_index,
    upsert_search_documents,
    query_search_documents,
)
from infrastructure.external.upstash.qstash_client import (
    get_qstash_client,
    publish_qstash_json,
)

__all__ = [
    "UpstashConfigError",
    "UpstashSdkError",
    "get_vector_index",
    "upsert_vectors",
    "query_vectors",
    "get_redis_client",
    "redis_get_json",
    "redis_set_json",
    "redis_fixed_window_allow",
    "get_search_index",
    "upsert_search_documents",
    "query_search_documents",
    "get_qstash_client",
    "publish_qstash_json",
]
