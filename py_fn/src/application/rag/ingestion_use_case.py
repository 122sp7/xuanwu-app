# Re-export from canonical location: application/use_cases/rag_ingestion.py
from application.use_cases.rag_ingestion import (
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
