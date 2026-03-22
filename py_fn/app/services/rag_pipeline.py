"""
RAG pipeline service — 1~7 步驟最小可用實作。

1. clean text
2. chunk
3. metadata
4. embeddings
5. vector upsert
6. mark ready
7. query retrieval + LLM answer
"""

from __future__ import annotations

import hashlib
import json
import logging
import re
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any

from app.config import (
    OPENAI_EMBEDDING_DIMENSIONS,
    OPENAI_EMBEDDING_MODEL,
    QSTASH_RAG_AUDIT_URL,
    RAG_DOC_CACHE_TTL_SECONDS,
    RAG_CHUNK_OVERLAP_CHARS,
    RAG_CHUNK_SIZE_CHARS,
    RAG_QUERY_CACHE_TTL_SECONDS,
    RAG_QUERY_TOP_K,
    RAG_REDIS_PREFIX,
    RAG_VECTOR_NAMESPACE,
)
from app.services.embeddings import embed_text, embed_texts
from app.services.llm import chat_complete
from app.services.upstash_clients import (
    publish_qstash_json,
    query_search_documents,
    query_vectors,
    redis_get_json,
    redis_set_json,
    upsert_vectors,
)

logger = logging.getLogger(__name__)


@dataclass
class RagIngestionResult:
    chunk_count: int
    vector_count: int
    embedding_model: str
    embedding_dimensions: int
    raw_chars: int
    normalized_chars: int
    normalization_version: str
    language_hint: str


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


def ingest_document_for_rag(
    *,
    doc_id: str,
    filename: str,
    source_gcs_uri: str,
    json_gcs_uri: str,
    text: str,
    page_count: int,
    account_id: str,
) -> RagIngestionResult:
    """Step 1~5: clean -> chunk -> metadata -> embed -> upsert vector。"""
    if not account_id:
        raise ValueError("account_id is required")

    raw_chars = len(text or "")
    normalized = clean_text(text or "")
    normalized_chars = len(normalized)
    normalization_version = "v2"
    language_hint = detect_language_hint(normalized)

    base_chunks = chunk_text(
        normalized,
        chunk_size=RAG_CHUNK_SIZE_CHARS,
        overlap=RAG_CHUNK_OVERLAP_CHARS,
    )
    if not base_chunks:
        return RagIngestionResult(
            chunk_count=0,
            vector_count=0,
            embedding_model=OPENAI_EMBEDDING_MODEL,
            embedding_dimensions=OPENAI_EMBEDDING_DIMENSIONS,
            raw_chars=raw_chars,
            normalized_chars=normalized_chars,
            normalization_version=normalization_version,
            language_hint=language_hint,
        )

    texts = [item["text"] for item in base_chunks]
    vectors = embed_texts(texts, model=OPENAI_EMBEDDING_MODEL)

    now_iso = datetime.now(UTC).isoformat()
    payload: list[dict[str, Any]] = []

    for i, (chunk, vec) in enumerate(zip(base_chunks, vectors)):
        chunk_id = f"{doc_id}:{i:04d}"
        payload.append(
            {
                "id": chunk_id,
                "vector": vec,
                "metadata": {
                    "namespace": RAG_VECTOR_NAMESPACE,
                    "doc_id": doc_id,
                    "chunk_id": chunk_id,
                    "chunk_index": i,
                    "chunk_count": len(base_chunks),
                    "filename": filename,
                    "source_gcs_uri": source_gcs_uri,
                    "json_gcs_uri": json_gcs_uri,
                    "account_id": account_id,
                    "page_count": page_count,
                    "char_start": chunk["char_start"],
                    "char_end": chunk["char_end"],
                    "text": chunk["text"],
                    "embedding_dimensions": OPENAI_EMBEDDING_DIMENSIONS,
                    "raw_chars": raw_chars,
                    "normalized_chars": normalized_chars,
                    "normalization_version": normalization_version,
                    "language_hint": language_hint,
                    "indexed_at": now_iso,
                },
            }
        )

    upsert_vectors(payload)

    # 文件索引摘要寫入 Redis，方便後續檢視與治理。
    try:
        redis_set_json(
            key=f"{RAG_REDIS_PREFIX}:doc:{doc_id}:latest",
            value={
                "doc_id": doc_id,
                "filename": filename,
                "chunk_count": len(base_chunks),
                "vector_count": len(payload),
                "account_id": account_id,
                "embedding_model": OPENAI_EMBEDDING_MODEL,
                "embedding_dimensions": OPENAI_EMBEDDING_DIMENSIONS,
                "normalization_version": normalization_version,
                "language_hint": language_hint,
                "indexed_at": now_iso,
            },
            ttl_seconds=RAG_DOC_CACHE_TTL_SECONDS,
        )
    except Exception as exc:
        logger.warning("redis doc summary write failed for %s: %s", doc_id, exc)

    return RagIngestionResult(
        chunk_count=len(base_chunks),
        vector_count=len(payload),
        embedding_model=OPENAI_EMBEDDING_MODEL,
        embedding_dimensions=OPENAI_EMBEDDING_DIMENSIONS,
        raw_chars=raw_chars,
        normalized_chars=normalized_chars,
        normalization_version=normalization_version,
        language_hint=language_hint,
    )


def _normalize_metadata(value: Any) -> dict[str, Any]:
    if isinstance(value, dict):
        return value
    if isinstance(value, str):
        raw = value.strip()
        if not raw:
            return {}
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            return {}
    return {}


def _match_account(metadata: dict[str, Any], account_id: str) -> bool:
    candidates = (
        metadata.get("account_id"),
        metadata.get("accountId"),
        metadata.get("account"),
        metadata.get("account_scope"),
        metadata.get("namespace"),
    )
    return any(str(value or "").strip() == account_id for value in candidates)


def _extract_snippet(hit: dict[str, Any], metadata: dict[str, Any]) -> str:
    candidates = (
        metadata.get("text"),
        metadata.get("chunk_text"),
        metadata.get("content"),
        hit.get("text"),
        hit.get("content"),
    )
    for candidate in candidates:
        snippet = str(candidate or "").strip()
        if snippet:
            return snippet
    return ""


def answer_rag_query(
    query: str,
    top_k: int | None = None,
    account_id: str = "",
) -> dict[str, Any]:
    """Step 7: query embedding -> vector retrieval -> LLM answer。"""
    q = query.strip()
    if not q:
        return {"answer": "", "citations": []}
    if not account_id:
        raise ValueError("account_id is required")

    actual_top_k = top_k if top_k and top_k > 0 else RAG_QUERY_TOP_K

    scope_key = account_id
    cache_key_base = f"{scope_key}|{q}|{actual_top_k}|{OPENAI_EMBEDDING_MODEL}|{OPENAI_EMBEDDING_DIMENSIONS}"
    cache_key = f"{RAG_REDIS_PREFIX}:query:{hashlib.sha256(cache_key_base.encode('utf-8')).hexdigest()}"

    try:
        cached = redis_get_json(cache_key)
        if cached and isinstance(cached.get("answer"), str):
            return {
                "answer": cached.get("answer", ""),
                "citations": cached.get("citations", []),
                "cache": "hit",
                "vector_hits": int(cached.get("vector_hits") or 0),
                "search_hits": int(cached.get("search_hits") or 0),
                "account_scope": cached.get("account_scope") or scope_key,
            }
    except Exception as exc:
        logger.warning("redis query cache read failed: %s", exc)

    query_vector = embed_text(q, model=OPENAI_EMBEDDING_MODEL)
    hits = query_vectors(query_vector, top_k=actual_top_k, include_metadata=True)
    search_hits = query_search_documents(q, top_k=actual_top_k)

    contexts: list[str] = []
    citations: list[dict[str, Any]] = []
    seen_snippets: set[str] = set()

    raw_vector_hits = len(hits)
    raw_search_hits = len(search_hits)

    for hit in hits:
        if not isinstance(hit, dict):
            continue
        metadata = _normalize_metadata(hit.get("metadata"))
        if not metadata:
            continue
        if not _match_account(metadata, account_id):
            continue
        snippet = _extract_snippet(hit, metadata)
        if not snippet:
            continue
        if snippet in seen_snippets:
            continue
        seen_snippets.add(snippet)
        contexts.append(snippet)
        citations.append(
            {
                "provider": "vector",
                "doc_id": metadata.get("doc_id"),
                "chunk_id": metadata.get("chunk_id"),
                "score": hit.get("score") if isinstance(hit, dict) else None,
                "filename": metadata.get("filename"),
                "json_gcs_uri": metadata.get("json_gcs_uri"),
                "account_id": metadata.get("account_id") or "",
            }
        )

    for item in search_hits:
        if not isinstance(item, dict):
            continue
        metadata = _normalize_metadata(item.get("metadata"))
        if not _match_account(metadata, account_id):
            continue

        snippet = _extract_snippet(item, metadata)
        if not snippet:
            continue
        if snippet in seen_snippets:
            continue
        seen_snippets.add(snippet)
        contexts.append(snippet)

        citations.append(
            {
                "provider": "search",
                "doc_id": metadata.get("doc_id"),
                "chunk_id": metadata.get("chunk_id"),
                "score": item.get("score"),
                "filename": metadata.get("filename"),
                "json_gcs_uri": metadata.get("json_gcs_uri"),
                "search_id": item.get("id"),
                "account_id": metadata.get("account_id") or "",
            }
        )

    vector_hit_count = len([c for c in citations if c.get("provider") == "vector"])
    search_hit_count = len([c for c in citations if c.get("provider") == "search"])

    context_block = "\n\n---\n\n".join(contexts[:actual_top_k])
    if not context_block:
        return {
            "answer": "找不到足夠的相關內容。",
            "citations": [],
            "cache": "miss",
            "vector_hits": raw_vector_hits,
            "search_hits": raw_search_hits,
            "account_scope": scope_key,
            "debug": {
                "vector_candidates": raw_vector_hits,
                "search_candidates": raw_search_hits,
                "reason": "no-context-after-scope-or-text-filter",
            },
        }

    answer = chat_complete(
        messages=[
            {
                "role": "system",
                "content": "你是 RAG 助手，只能依據提供的 context 回答，若不足請明確說明。",
            },
            {
                "role": "user",
                "content": f"問題：{q}\n\nContext:\n{context_block}",
            },
        ],
        temperature=0.1,
    )

    result = {
        "answer": answer,
        "citations": citations,
        "cache": "miss",
        "vector_hits": vector_hit_count,
        "search_hits": search_hit_count,
        "account_scope": scope_key,
    }

    try:
        redis_set_json(cache_key, result, ttl_seconds=RAG_QUERY_CACHE_TTL_SECONDS)
    except Exception as exc:
        logger.warning("redis query cache write failed: %s", exc)

    if QSTASH_RAG_AUDIT_URL:
        try:
            publish_qstash_json(
                url=QSTASH_RAG_AUDIT_URL,
                body={
                    "event": "rag.query.completed",
                    "query": q,
                    "top_k": actual_top_k,
                    "citation_count": len(citations),
                    "vector_hits": vector_hit_count,
                    "search_hits": search_hit_count,
                    "cached": False,
                },
            )
        except Exception as exc:
            logger.debug("qstash publish skipped: %s", exc)

    return result
