"""
Upstash Search 客戶端 — 全文搜尋 upsert / query 操作。
"""

from __future__ import annotations

import json
import logging
from urllib import error as urlerror
from urllib import request as urlrequest
from typing import Any

from core.config import (
    UPSTASH_SEARCH_REST_TOKEN,
    UPSTASH_SEARCH_REST_URL,
    UPSTASH_SEARCH_INDEX,
    UPSTASH_SEARCH_TIMEOUT_SECONDS,
)
from infrastructure.external.upstash._base import UpstashSdkError, _require, _import_module

_SEARCH_INDEX: Any | None = None

logger = logging.getLogger(__name__)


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
