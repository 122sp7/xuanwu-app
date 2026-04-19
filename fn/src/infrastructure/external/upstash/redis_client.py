"""
Upstash Redis 客戶端 — JSON 讀寫與固定窗口限流操作。
"""

from __future__ import annotations

import json
import logging
from typing import Any

from core.config import UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL
from infrastructure.external.upstash._base import UpstashSdkError, _require, _import_module

_REDIS_CLIENT: Any | None = None

logger = logging.getLogger(__name__)


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


def redis_get_json(key: str) -> dict[str, Any] | None:
    """從 Upstash Redis 讀取 JSON 字串並反序列化。"""
    client = get_redis_client()
    raw = client.get(key)
    if raw is None:
        return None

    if isinstance(raw, (bytes, bytearray)):
        raw_text = raw.decode("utf-8", errors="ignore")
    else:
        raw_text = str(raw)

    if not raw_text:
        return None

    try:
        parsed = json.loads(raw_text)
        return parsed if isinstance(parsed, dict) else None
    except Exception:
        logger.warning("redis_get_json: invalid json at key=%s", key)
        return None


def redis_set_json(key: str, value: dict[str, Any], ttl_seconds: int = 0) -> None:
    """將 dict 寫入 Upstash Redis；可選擇 TTL。"""
    client = get_redis_client()
    payload = json.dumps(value, ensure_ascii=False, separators=(",", ":"))

    if ttl_seconds > 0:
        try:
            client.set(key, payload, ex=ttl_seconds)
            return
        except TypeError:
            pass
        except Exception:
            logger.exception("redis_set_json set(ex=) failed: key=%s", key)
            raise

        try:
            client.setex(key, ttl_seconds, payload)
            return
        except Exception:
            logger.exception("redis_set_json setex failed: key=%s", key)
            raise

    client.set(key, payload)


def redis_fixed_window_allow(
    key: str,
    max_requests: int,
    window_seconds: int,
) -> tuple[bool, int]:
    """固定窗限流：回傳 (allowed, remaining)。"""
    if max_requests <= 0 or window_seconds <= 0:
        return True, max_requests

    client = get_redis_client()
    current = int(client.incr(key) or 0)
    if current == 1:
        client.expire(key, window_seconds)

    allowed = current <= max_requests
    remaining = max(0, max_requests - current)
    return allowed, remaining
