"""
Upstash service — Vector / Redis / Search / QStash 的 REST 封裝。

此模組只做基礎連線與 request 封裝，
讓後續 ingestion / embedding / queue 流程可直接重用。
"""

from __future__ import annotations

from typing import Any
from urllib.parse import quote

import httpx

from app.config import (
    QSTASH_TOKEN,
    QSTASH_URL,
    UPSTASH_REDIS_REST_TOKEN,
    UPSTASH_REDIS_REST_URL,
    UPSTASH_SEARCH_REST_TOKEN,
    UPSTASH_SEARCH_REST_URL,
    UPSTASH_VECTOR_REST_TOKEN,
    UPSTASH_VECTOR_REST_URL,
)

_DEFAULT_TIMEOUT = 30.0
_HTTP_CLIENT: httpx.Client | None = None


class UpstashConfigError(RuntimeError):
    """Upstash 必填環境變數缺失。"""


def _get_http_client(timeout: float = _DEFAULT_TIMEOUT) -> httpx.Client:
    global _HTTP_CLIENT
    if _HTTP_CLIENT is None:
        _HTTP_CLIENT = httpx.Client(timeout=timeout, http2=True)
    return _HTTP_CLIENT


def _normalize_base_url(base_url: str) -> str:
    return base_url.rstrip("/")


def _join_url(base_url: str, path: str) -> str:
    if not path:
        return _normalize_base_url(base_url)
    return f"{_normalize_base_url(base_url)}/{path.lstrip('/')}"


def _require(value: str, name: str) -> str:
    if not value:
        raise UpstashConfigError(f"{name} is not set")
    return value


def _request_json(
    *,
    base_url: str,
    token: str,
    method: str,
    path: str = "",
    json_body: dict[str, Any] | list[Any] | None = None,
    timeout: float = _DEFAULT_TIMEOUT,
) -> Any:
    url = _join_url(_require(base_url, "Upstash base_url"), path)
    auth_token = _require(token, "Upstash token")

    headers = {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json",
    }

    client = _get_http_client(timeout=timeout)
    response = client.request(method=method.upper(), url=url, headers=headers, json=json_body)
    response.raise_for_status()
    if not response.content:
        return None
    return response.json()


def upstash_vector_request(
    method: str,
    path: str,
    json_body: dict[str, Any] | list[Any] | None = None,
) -> Any:
    """送出 Upstash Vector REST 請求。"""
    return _request_json(
        base_url=UPSTASH_VECTOR_REST_URL,
        token=UPSTASH_VECTOR_REST_TOKEN,
        method=method,
        path=path,
        json_body=json_body,
    )


def upstash_search_request(
    method: str,
    path: str,
    json_body: dict[str, Any] | list[Any] | None = None,
) -> Any:
    """送出 Upstash Search REST 請求。"""
    return _request_json(
        base_url=UPSTASH_SEARCH_REST_URL,
        token=UPSTASH_SEARCH_REST_TOKEN,
        method=method,
        path=path,
        json_body=json_body,
    )


def upstash_redis_request(
    method: str,
    path: str,
    json_body: dict[str, Any] | list[Any] | None = None,
) -> Any:
    """送出 Upstash Redis REST 請求。"""
    return _request_json(
        base_url=UPSTASH_REDIS_REST_URL,
        token=UPSTASH_REDIS_REST_TOKEN,
        method=method,
        path=path,
        json_body=json_body,
    )


def qstash_request(
    method: str,
    path: str,
    json_body: dict[str, Any] | list[Any] | None = None,
) -> Any:
    """送出 QStash REST 請求。"""
    return _request_json(
        base_url=QSTASH_URL,
        token=QSTASH_TOKEN,
        method=method,
        path=path,
        json_body=json_body,
    )


def qstash_publish_json(destination_url: str, body: dict[str, Any]) -> Any:
    """
    發佈 JSON 訊息到 QStash。

    備註：QStash v2 publish 使用 /v2/publish/{destination_url}。
    """
    encoded_target = quote(destination_url, safe="")
    publish_path = f"v2/publish/{encoded_target}"
    return qstash_request("POST", publish_path, json_body=body)
