"""
RAG pipeline — ingestion use case (clean → chunk → embed → upsert).
"""

from __future__ import annotations

import logging
from datetime import UTC, datetime
from typing import Any

from application.dto import RagIngestionResult
from core.config import (
    OPENAI_EMBEDDING_DIMENSIONS,
    OPENAI_EMBEDDING_MODEL,
    RAG_DOC_CACHE_TTL_SECONDS,
    RAG_CHUNK_OVERLAP_CHARS,
    RAG_CHUNK_SIZE_CHARS,
    RAG_REDIS_PREFIX,
    RAG_VECTOR_NAMESPACE,
)
from domain.repositories import RagIngestionGateway, get_rag_ingestion_gateway
from domain.services.rag_ingestion_text import clean_text, chunk_text, detect_language_hint

logger = logging.getLogger(__name__)


def ingest_document_for_rag(
    *,
    doc_id: str,
    filename: str,
    source_gcs_uri: str,
    json_gcs_uri: str,
    text: str,
    page_count: int,
    account_id: str,
    workspace_id: str,
    taxonomy: str = "general",
    gateway: RagIngestionGateway | None = None,
) -> RagIngestionResult:
    """Step 1~5: clean -> chunk -> metadata -> embed -> upsert vector。"""
    gateway = gateway or get_rag_ingestion_gateway()

    if not account_id:
        raise ValueError("account_id is required")
    if not workspace_id:
        raise ValueError("workspace_id is required")

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
    vectors = gateway.embed_texts(texts, model=OPENAI_EMBEDDING_MODEL)

    now_iso = datetime.now(UTC).isoformat()
    payload: list[dict[str, Any]] = []

    for i, (chunk, vec) in enumerate(zip(base_chunks, vectors)):
        chunk_id = f"{doc_id}:{i:04d}"
        payload.append(
            {
                "id": chunk_id,
                "vector": vec,
                "data": chunk["text"],
                "metadata": {
                    "vector_namespace": RAG_VECTOR_NAMESPACE,
                    "doc_id": doc_id,
                    "chunk_id": chunk_id,
                    "chunk_index": i,
                    "chunk_count": len(base_chunks),
                    "filename": filename,
                    "original_filename": filename,
                    "display_name": filename,
                    "source_gcs_uri": source_gcs_uri,
                    "json_gcs_uri": json_gcs_uri,
                    "account_id": account_id,
                    "workspace_id": workspace_id,
                    "taxonomy": taxonomy,
                    "semantic_class": taxonomy,
                    "processing_status": "ready",
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
                    "ingestion_pipeline": "rag-v2",
                },
            }
        )

    gateway.upsert_vectors(payload, namespace=RAG_VECTOR_NAMESPACE)

    # Best effort: keep Upstash Search in sync with vector chunks.
    try:
        search_docs = [
            {
                "id": item["id"],
                "content": {
                    "text": item["metadata"].get("text", ""),
                    "filename": item["metadata"].get("filename", ""),
                    "doc_id": item["metadata"].get("doc_id", ""),
                    "taxonomy": item["metadata"].get("taxonomy", ""),
                },
                "metadata": item["metadata"],
            }
            for item in payload
        ]
        gateway.upsert_search_documents(search_docs)
    except Exception as exc:
        logger.warning("search index upsert skipped for %s: %s", doc_id, exc)

    # 文件索引摘要寫入 Redis，方便後續檢視與治理。
    try:
        gateway.redis_set_json(
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
