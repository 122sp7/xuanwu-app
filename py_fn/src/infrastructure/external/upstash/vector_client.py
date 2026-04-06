"""
Upstash Vector 客戶端 — 向量 upsert / query 操作。
"""

from __future__ import annotations

import logging
from typing import Any

from core.config import UPSTASH_VECTOR_REST_TOKEN, UPSTASH_VECTOR_REST_URL
from infrastructure.external.upstash._base import UpstashSdkError, _require, _import_module

_VECTOR_INDEX: Any | None = None

logger = logging.getLogger(__name__)


def get_vector_index() -> Any:
    """取得 Upstash Vector 官方 SDK Index 實例（單例）。"""
    global _VECTOR_INDEX
    if _VECTOR_INDEX is None:
        mod = _import_module("upstash_vector", "pip install upstash-vector")
        index_cls = getattr(mod, "Index", None)
        if index_cls is None:
            raise UpstashSdkError("upstash_vector.Index not found")
        _VECTOR_INDEX = index_cls(
            url=_require(UPSTASH_VECTOR_REST_URL, "UPSTASH_VECTOR_REST_URL"),
            token=_require(UPSTASH_VECTOR_REST_TOKEN, "UPSTASH_VECTOR_REST_TOKEN"),
        )
    return _VECTOR_INDEX


def _normalize_vector_item(item: Any) -> dict[str, Any]:
    if isinstance(item, dict):
        return item
    try:
        return {
            "id": getattr(item, "id", None),
            "score": getattr(item, "score", None),
            "vector": getattr(item, "vector", None),
            "metadata": getattr(item, "metadata", None),
            "data": getattr(item, "data", None),
        }
    except Exception:
        return {}


def upsert_vectors(items: list[dict[str, Any]], namespace: str = "") -> Any:
    """
    批次 upsert 向量資料到 Upstash Vector。

    items 每筆至少包含：
      - id: str
      - vector: list[float]
      - metadata: dict[str, Any]
    """
    index = get_vector_index()
    sdk_payload = [
        {
            "id": item["id"],
            "vector": item["vector"],
            "metadata": item.get("metadata", {}),
            "data": item.get("data"),
        }
        for item in items
    ]
    tuples_payload = [
        (item["id"], item["vector"], item.get("metadata", {}))
        for item in items
    ]

    try:
        return index.upsert(vectors=sdk_payload, namespace=namespace)
    except TypeError:
        try:
            return index.upsert(sdk_payload, namespace=namespace)
        except TypeError:
            try:
                return index.upsert(tuples_payload, namespace=namespace)
            except TypeError:
                return index.upsert(items, namespace=namespace)


def query_vectors(
    vector: list[float],
    top_k: int,
    include_metadata: bool = True,
    include_data: bool = True,
    namespace: str = "",
    filter: str = "",
) -> list[dict[str, Any]]:
    """查詢 Upstash Vector，統一輸出為 list[dict]。"""
    index = get_vector_index()

    try:
        result = index.query(
            vector=vector,
            top_k=top_k,
            include_metadata=include_metadata,
            include_data=include_data,
            namespace=namespace,
            filter=filter,
        )
    except TypeError:
        try:
            result = index.query(
                vector,
                top_k=top_k,
                include_metadata=include_metadata,
                include_data=include_data,
                namespace=namespace,
                filter=filter,
            )
        except TypeError:
            result = index.query(vector=vector, top_k=top_k, namespace=namespace)

    if isinstance(result, list):
        return [_normalize_vector_item(item) for item in result]

    if isinstance(result, dict):
        candidates = result.get("result") or result.get("matches") or result.get("data") or []
        if isinstance(candidates, list):
            return [_normalize_vector_item(item) for item in candidates]

    if hasattr(result, "data") and isinstance(result.data, list):
        return [_normalize_vector_item(item) for item in result.data]

    return []
