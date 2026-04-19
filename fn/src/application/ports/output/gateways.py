"""Backward-compatible application-layer re-export of domain repository contracts."""

from domain.repositories.rag import (
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

__all__ = [
    "DocumentPipelineGateway",
    "RagIngestionGateway",
    "RagQueryGateway",
    "get_document_pipeline_gateway",
    "get_rag_ingestion_gateway",
    "get_rag_query_gateway",
    "register_document_pipeline_gateway",
    "register_rag_ingestion_gateway",
    "register_rag_query_gateway",
]
