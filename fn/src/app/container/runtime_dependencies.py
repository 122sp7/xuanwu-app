"""Dependency registration — thin composer wiring gateways into the registry.

Each gateway implementation lives in its own module under
infrastructure/gateways/ following SRP. This file only wires them.
"""

from __future__ import annotations

from domain.repositories import (
    register_authorization_gateway,
    register_document_artifact_gateway,
    register_document_parser_gateway,
    register_document_rate_limit_gateway,
    register_document_status_gateway,
    register_rag_ingestion_gateway,
    register_rag_query_effects_gateway,
    register_rag_query_gateway,
)
from infrastructure.gateways.authorization_gateway import FirestoreAuthorizationGateway
from infrastructure.gateways.document_artifact_gateway import InfraDocumentArtifactGateway
from infrastructure.gateways.document_parser_gateway import InfraDocumentParserGateway
from infrastructure.gateways.document_rate_limit_gateway import InfraDocumentRateLimitGateway
from infrastructure.gateways.document_status_gateway import InfraDocumentStatusGateway
from infrastructure.gateways.rag_ingestion_gateway import InfraRagIngestionGateway
from infrastructure.gateways.rag_query_effects_gateway import InfraRagQueryEffectsGateway
from infrastructure.gateways.rag_query_gateway import InfraRagQueryGateway


def register_runtime_dependencies() -> None:
    register_authorization_gateway(FirestoreAuthorizationGateway())
    register_rag_query_gateway(InfraRagQueryGateway())
    register_rag_query_effects_gateway(InfraRagQueryEffectsGateway())
    register_rag_ingestion_gateway(InfraRagIngestionGateway())
    register_document_parser_gateway(InfraDocumentParserGateway())
    register_document_artifact_gateway(InfraDocumentArtifactGateway())
    register_document_status_gateway(InfraDocumentStatusGateway())
    register_document_rate_limit_gateway(InfraDocumentRateLimitGateway())
