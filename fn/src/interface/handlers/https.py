"""
HTTPS Callable 觸發器 — 向後相容的重新匯出桶。
各 handler 已拆分至對應的聚焦模組：
  - parse_document.py      (handle_parse_document)
  - rag_query_handler.py   (handle_rag_query)
  - rag_reindex_handler.py (handle_rag_reindex_document)
  - _https_helpers.py      (共用驗證/解析工具)

此檔案保留所有原始公開符號以維持向後相容。
"""

from __future__ import annotations

from interface.handlers.parse_document import handle_parse_document
from interface.handlers.rag_query_handler import handle_rag_query
from interface.handlers.rag_reindex_handler import handle_rag_reindex_document

__all__ = [
    "handle_parse_document",
    "handle_rag_query",
    "handle_rag_reindex_document",
]
