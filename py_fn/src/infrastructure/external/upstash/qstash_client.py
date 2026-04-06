"""
Upstash QStash 客戶端 — 非同步訊息投遞操作。
"""

from __future__ import annotations

import logging
from typing import Any

from core.config import (
    QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY,
    QSTASH_TOKEN,
    QSTASH_URL,
)
from infrastructure.external.upstash._base import UpstashSdkError, _require, _import_module

_QSTASH_CLIENT: Any | None = None

logger = logging.getLogger(__name__)


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
