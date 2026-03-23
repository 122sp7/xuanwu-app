"""RAG bounded context — application layer.

Exposes DTOs, port interfaces, and use-case functions for the RAG pipeline.
"""

from application.rag.dto import RagIngestionResult
from application.rag.ingestion_use_case import (
    chunk_text,
    clean_text,
    detect_language_hint,
    ingest_document_for_rag,
)
from application.rag.ports import (
    DocumentPipelineGateway,
    RagIngestionGateway,
    RagQueryGateway,
    get_document_pipeline_gateway,
    get_rag_ingestion_gateway,
    get_rag_query_gateway,
    register_document_pipeline_gateway,
    register_rag_ingestion_gateway,
    register_rag_query_gateway,
)
from application.rag.query_use_case import execute_rag_query

__all__ = [
    "RagIngestionResult",
    "chunk_text",
    "clean_text",
    "detect_language_hint",
    "ingest_document_for_rag",
    "DocumentPipelineGateway",
    "RagIngestionGateway",
    "RagQueryGateway",
    "get_document_pipeline_gateway",
    "get_rag_ingestion_gateway",
    "get_rag_query_gateway",
    "register_document_pipeline_gateway",
    "register_rag_ingestion_gateway",
    "register_rag_query_gateway",
    "execute_rag_query",
]
