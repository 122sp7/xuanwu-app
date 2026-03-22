"""
Upstash clients — 使用官方 Python SDK 建立 Vector / Redis / QStash 客戶端。
"""

from __future__ import annotations

import importlib
from typing import Any

from app.config import (
    QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY,
    QSTASH_TOKEN,
    QSTASH_URL,
    UPSTASH_REDIS_REST_TOKEN,
    UPSTASH_REDIS_REST_URL,
    UPSTASH_VECTOR_REST_TOKEN,
    UPSTASH_VECTOR_REST_URL,
)

_VECTOR_INDEX: Any | None = None
_REDIS_CLIENT: Any | None = None
_QSTASH_CLIENT: Any | None = None


class UpstashConfigError(RuntimeError):
    """Upstash 配置缺失。"""


class UpstashSdkError(RuntimeError):
    """Upstash SDK 載入失敗。"""


def _require(value: str, name: str) -> str:
    if not value:
        raise UpstashConfigError(f"{name} is not set")
    return value


def _import_module(module_name: str, install_hint: str):
    try:
        return importlib.import_module(module_name)
    except ImportError as exc:
        raise UpstashSdkError(f"Missing dependency: {install_hint}") from exc


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


def get_redis_client() -> Any:
    """取得 Upstash Redis 官方 SDK client（單例）。"""
    global _REDIS_CLIENT
    if _REDIS_CLIENT is None:
        mod = _import_module("upstash_redis", "pip install upstash-redis")
        redis_cls = getattr(mod, "Redis", None)
        if redis_cls is None:
            raise UpstashSdkError("upstash_redis.Redis not found")
        _REDIS_CLIENT = redis_cls(
            url=_require(UPSTASH_REDIS_REST_URL, "UPSTASH_REDIS_REST_URL"),
            token=_require(UPSTASH_REDIS_REST_TOKEN, "UPSTASH_REDIS_REST_TOKEN"),
        )
    return _REDIS_CLIENT


def get_qstash_client() -> Any:
    """取得 QStash 官方 SDK client（單例）。"""
    global _QSTASH_CLIENT
    if _QSTASH_CLIENT is None:
        mod = _import_module("upstash_qstash", "pip install upstash-qstash")
        client_cls = getattr(mod, "Client", None) or getattr(mod, "QStash", None)
        if client_cls is None:
            raise UpstashSdkError("upstash_qstash.Client/QStash not found")

        # 新舊 SDK 參數名稱兼容
        kwargs: dict[str, Any] = {
            "token": _require(QSTASH_TOKEN, "QSTASH_TOKEN"),
        }
        if QSTASH_URL:
            kwargs["base_url"] = QSTASH_URL
        if QSTASH_CURRENT_SIGNING_KEY:
            kwargs["current_signing_key"] = QSTASH_CURRENT_SIGNING_KEY
        if QSTASH_NEXT_SIGNING_KEY:
            kwargs["next_signing_key"] = QSTASH_NEXT_SIGNING_KEY

        try:
            _QSTASH_CLIENT = client_cls(**kwargs)
        except TypeError:
            # 退回最小初始化方式
            _QSTASH_CLIENT = client_cls(token=_require(QSTASH_TOKEN, "QSTASH_TOKEN"))

    return _QSTASH_CLIENT


def upsert_vectors(items: list[dict[str, Any]]) -> Any:
    """
    批次 upsert 向量資料到 Upstash Vector。

    items 每筆至少包含：
      - id: str
      - vector: list[float]
      - metadata: dict[str, Any]
    """
    index = get_vector_index()
    tuples_payload = [
        (item["id"], item["vector"], item.get("metadata", {}))
        for item in items
    ]

    try:
        return index.upsert(vectors=tuples_payload)
    except TypeError:
        try:
            return index.upsert(tuples_payload)
        except TypeError:
            return index.upsert(items)


def query_vectors(
    vector: list[float],
    top_k: int,
    include_metadata: bool = True,
) -> list[dict[str, Any]]:
    """查詢 Upstash Vector，統一輸出為 list[dict]。"""
    index = get_vector_index()

    try:
        result = index.query(vector=vector, top_k=top_k, include_metadata=include_metadata)
    except TypeError:
        try:
            result = index.query(vector, top_k=top_k)
        except TypeError:
            result = index.query(data=vector, top_k=top_k)

    if isinstance(result, list):
        return [dict(item) if isinstance(item, dict) else {"raw": item} for item in result]

    if isinstance(result, dict):
        candidates = result.get("result") or result.get("matches") or result.get("data") or []
        if isinstance(candidates, list):
            return [dict(item) if isinstance(item, dict) else {"raw": item} for item in candidates]

    if hasattr(result, "data") and isinstance(result.data, list):
        parsed: list[dict[str, Any]] = []
        for item in result.data:
            parsed.append(
                {
                    "id": getattr(item, "id", None),
                    "score": getattr(item, "score", None),
                    "metadata": getattr(item, "metadata", None),
                }
            )
        return parsed

    return []
