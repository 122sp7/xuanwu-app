# Backward-compatibility shim — canonical definitions in application/rag/ingestion_use_case.py
from application.rag.ingestion_use_case import (
    chunk_text,
    clean_text,
    detect_language_hint,
    ingest_document_for_rag,
)

__all__ = [
    "chunk_text",
    "clean_text",
    "detect_language_hint",
    "ingest_document_for_rag",
]
