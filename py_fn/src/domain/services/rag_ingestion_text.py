"""
Domain Service — RAG ingestion text processing.

Pure business logic for text normalization, language detection, and
chunking.  No infrastructure dependency.
"""

from __future__ import annotations

import re
from typing import Any


def detect_language_hint(text: str) -> str:
    """粗略語系判斷：cjk / latin / mixed。"""
    cjk_count = len(re.findall(r"[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]", text))
    latin_count = len(re.findall(r"[A-Za-z]", text))
    if cjk_count > latin_count * 1.2:
        return "cjk"
    if latin_count > cjk_count * 1.2:
        return "latin"
    return "mixed"


def clean_text(raw_text: str) -> str:
    """Step 1: Normalization v2，保留段落與可引用性。"""
    text = raw_text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[\u200b\u200c\u200d\ufeff]", "", text)
    text = text.replace("\u3000", " ")
    text = re.sub(r"[\t ]+", " ", text)
    text = re.sub(r"\n[\t ]+", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def chunk_text(text: str, chunk_size: int, overlap: int) -> list[dict[str, Any]]:
    """Step 2 + Step 3: 分塊並建立 chunk metadata。"""
    if not text:
        return []

    if chunk_size <= 0:
        chunk_size = 1200
    if overlap < 0:
        overlap = 0
    if overlap >= chunk_size:
        overlap = max(0, chunk_size // 4)

    chunks: list[dict[str, Any]] = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = min(start + chunk_size, text_len)
        content = text[start:end].strip()
        if content:
            chunks.append(
                {
                    "text": content,
                    "char_start": start,
                    "char_end": end,
                }
            )
        if end >= text_len:
            break
        start = end - overlap

    return chunks
