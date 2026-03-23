"""
Upstash clients — 使用官方 Python SDK 建立 Vector / Redis / QStash 客戶端。
"""

from __future__ import annotations

import importlib
import json
import logging
from urllib import error as urlerror
from urllib import request as urlrequest
from typing import Any

from core.config import (
    QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY,
    QSTASH_TOKEN,
    QSTASH_URL,
    UPSTASH_REDIS_REST_TOKEN,
    UPSTASH_REDIS_REST_URL,
    UPSTASH_SEARCH_REST_TOKEN,
    UPSTASH_SEARCH_REST_URL,
    UPSTASH_SEARCH_INDEX,
    UPSTASH_SEARCH_TIMEOUT_SECONDS,
    UPSTASH_VECTOR_REST_TOKEN,
    UPSTASH_VECTOR_REST_URL,
)

_VECTOR_INDEX: Any | None = None
_REDIS_CLIENT: Any | None = None
_QSTASH_CLIENT: Any | None = None
_SEARCH_INDEX: Any | None = None

logger = logging.getLogger(__name__)


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
        mod = _import_module("qstash", "pip install qstash")
        client_cls = getattr(mod, "QStash", None)
        if client_cls is None:
            raise UpstashSdkError("qstash.QStash not found")

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


def get_search_index() -> Any:
    """取得 Upstash Search 官方 SDK index（單例）。"""
    global _SEARCH_INDEX
    if _SEARCH_INDEX is None:
        mod = _import_module("upstash_search", "pip install upstash-search")
        search_cls = getattr(mod, "Search", None)
        if search_cls is None:
            raise UpstashSdkError("upstash_search.Search not found")

        index_name = UPSTASH_SEARCH_INDEX or "default"
        client = search_cls(
            url=_require(UPSTASH_SEARCH_REST_URL, "UPSTASH_SEARCH_REST_URL"),
            token=_require(UPSTASH_SEARCH_REST_TOKEN, "UPSTASH_SEARCH_REST_TOKEN"),
            allow_telemetry=False,
        )
        _SEARCH_INDEX = client.index(index_name)
    return _SEARCH_INDEX


def _normalize_vector_item(item: Any) -> dict[str, Any]:
    if isinstance(item, dict):
        return {
            "id": item.get("id"),
            "score": item.get("score"),
            "metadata": item.get("metadata"),
            "data": item.get("data"),
        }

    return {
        "id": getattr(item, "id", None),
        "score": getattr(item, "score", None),
        "metadata": getattr(item, "metadata", None),
        "data": getattr(item, "data", None),
    }


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


def upsert_search_documents(documents: list[dict[str, Any]]) -> int:
    """批次寫入 Upstash Search index（best effort，不拋出上層）。"""
    if not UPSTASH_SEARCH_REST_URL or not UPSTASH_SEARCH_REST_TOKEN:
        return 0

    if not documents:
        return 0

    normalized: list[dict[str, Any]] = []
    for item in documents:
        if not isinstance(item, dict):
            continue
        doc_id = str(item.get("id") or "").strip()
        if not doc_id:
            continue

        content = item.get("content") if isinstance(item.get("content"), dict) else {}
        metadata = item.get("metadata") if isinstance(item.get("metadata"), dict) else {}
        normalized.append({
            "id": doc_id,
            "content": content,
            "metadata": metadata,
        })

    if not normalized:
        return 0

    try:
        index = get_search_index()
        try:
            index.upsert(documents=normalized)
        except TypeError:
            index.upsert(normalized)
        return len(normalized)
    except Exception as exc:
        logger.warning("upsert_search_documents failed: %s", exc)
        return 0


def query_search_documents(query: str, top_k: int) -> list[dict[str, Any]]:
    """
    以 Upstash Search REST 進行補充檢索（best effort）。

    回傳格式統一為 list[dict]，單筆含 text / score / source 等欄位。
    """
    if not UPSTASH_SEARCH_REST_URL or not UPSTASH_SEARCH_REST_TOKEN:
        return []

    if not query.strip() or top_k <= 0:
        return []

    # Prefer official SDK first; fallback to REST probing for compatibility.
    try:
        index = get_search_index()
        result = index.search(query=query, limit=top_k)
        normalized: list[dict[str, Any]] = []

        if isinstance(result, list):
            items = result
        elif isinstance(result, dict):
            items = (
                result.get("result")
                or result.get("matches")
                or result.get("hits")
                or result.get("data")
                or []
            )
        else:
            items = getattr(result, "results", None) or getattr(result, "data", None) or []

        if isinstance(items, list):
            for item in items:
                if not isinstance(item, dict):
                    try:
                        item = dict(item)
                    except Exception:
                        continue

                metadata = item.get("metadata") if isinstance(item.get("metadata"), dict) else {}
                content = item.get("content") if isinstance(item.get("content"), dict) else {}
                text = str(
                    item.get("text")
                    or content.get("text")
                    or content.get("content")
                    or metadata.get("text")
                    or item.get("content")
                    or ""
                ).strip()
                if not text:
                    continue

                normalized.append(
                    {
                        "id": item.get("id"),
                        "score": item.get("score"),
                        "text": text,
                        "metadata": metadata,
                        "source": "upstash-search-sdk",
                    }
                )

        if normalized:
            return normalized
    except Exception as exc:
        logger.debug("query_search_documents sdk path failed, fallback to REST: %s", exc)

    endpoint_base = UPSTASH_SEARCH_REST_URL.rstrip("/")
    body_candidates = [
        {"query": query, "topK": top_k},
        {"query": query, "top_k": top_k},
        {"q": query, "limit": top_k},
    ]
    path_candidates = ["/query", "/search"]

    for path in path_candidates:
        url = f"{endpoint_base}{path}"
        for body in body_candidates:
            raw = None
            try:
                req = urlrequest.Request(
                    url=url,
                    method="POST",
                    headers={
                        "Authorization": f"Bearer {UPSTASH_SEARCH_REST_TOKEN}",
                        "Content-Type": "application/json",
                    },
                    data=json.dumps(body, ensure_ascii=False).encode("utf-8"),
                )
                with urlrequest.urlopen(req, timeout=UPSTASH_SEARCH_TIMEOUT_SECONDS) as resp:
                    raw = resp.read().decode("utf-8", errors="ignore")
            except urlerror.HTTPError as exc:
                logger.debug("query_search_documents http error: %s %s", url, exc)
                continue
            except Exception as exc:
                logger.debug("query_search_documents request failed: %s", exc)
                continue

            if not raw:
                continue

            try:
                payload = json.loads(raw)
            except Exception:
                logger.debug("query_search_documents invalid json from %s", url)
                continue

            candidates = []
            if isinstance(payload, dict):
                candidates = (
                    payload.get("result")
                    or payload.get("matches")
                    or payload.get("hits")
                    or payload.get("data")
                    or []
                )
            elif isinstance(payload, list):
                candidates = payload

            if not isinstance(candidates, list):
                continue

            normalized: list[dict[str, Any]] = []
            for item in candidates:
                if isinstance(item, dict):
                    metadata = item.get("metadata") if isinstance(item.get("metadata"), dict) else {}
                    text = str(
                        item.get("text")
                        or metadata.get("text")
                        or item.get("content")
                        or ""
                    ).strip()
                    if not text:
                        continue
                    normalized.append(
                        {
                            "id": item.get("id"),
                            "score": item.get("score"),
                            "text": text,
                            "metadata": metadata,
                            "source": "upstash-search",
                        }
                    )
            if normalized:
                return normalized

    return []


def publish_qstash_json(url: str, body: dict[str, Any], delay: str | None = None) -> bool:
    """透過 QStash 投遞 JSON 訊息（best effort）。"""
    target_url = url.strip()
    if not target_url:
        return False

    try:
        client = get_qstash_client()
    except Exception as exc:
        logger.debug("publish_qstash_json skip: %s", exc)
        return False

    try:
        kwargs: dict[str, Any] = {
            "url": target_url,
            "body": body,
        }
        if delay:
            kwargs["delay"] = delay

        publish_json = getattr(client, "publish_json", None)
        if callable(publish_json):
            publish_json(**kwargs)
            return True

        publish = getattr(client, "publish", None)
        if callable(publish):
            publish(**kwargs)
            return True

        return False
    except TypeError:
        try:
            publish_json = getattr(client, "publish_json", None)
            if callable(publish_json):
                publish_json(target_url, body)
                return True
            publish = getattr(client, "publish", None)
            if callable(publish):
                publish(target_url, body)
                return True
            return False
        except Exception:
            logger.debug("publish_qstash_json fallback failed", exc_info=True)
            return False
    except Exception:
        logger.debug("publish_qstash_json failed", exc_info=True)
        return False
