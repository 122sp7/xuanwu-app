"""Dependency registration — thin composer wiring gateways into the registry.

Each gateway implementation lives in its own module under
infrastructure/gateways/ following SRP. This file only wires them.
"""

from __future__ import annotations

from domain.repositories import (
    register_document_pipeline_gateway,
    register_rag_ingestion_gateway,
    register_rag_query_gateway,
)
from infrastructure.gateways.document_pipeline_gateway import InfraDocumentPipelineGateway
from infrastructure.gateways.rag_ingestion_gateway import InfraRagIngestionGateway
from infrastructure.gateways.rag_query_gateway import InfraRagQueryGateway


def register_runtime_dependencies() -> None:
    register_rag_query_gateway(InfraRagQueryGateway())
    register_rag_ingestion_gateway(InfraRagIngestionGateway())
    register_document_pipeline_gateway(InfraDocumentPipelineGateway())
