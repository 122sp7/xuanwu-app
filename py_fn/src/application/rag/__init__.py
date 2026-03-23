"""RAG bounded context — application layer.

Re-exports DTOs, port interfaces, and use-case functions from their canonical locations.
"""

from application.dto.rag import RagIngestionResult
from application.ports.output.gateways import (
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
from application.use_cases.rag_ingestion import (
    chunk_text,
    clean_text,
    detect_language_hint,
    ingest_document_for_rag,
)
from application.use_cases.rag_query import execute_rag_query

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
