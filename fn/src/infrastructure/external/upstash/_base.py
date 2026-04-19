"""
Upstash 共用工具 — 錯誤類別與基礎輔助函數。
供 vector_client / redis_client / search_client / qstash_client 共享使用。
"""

from __future__ import annotations

import importlib
import logging

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
