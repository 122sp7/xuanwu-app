from __future__ import annotations

from domain.repositories import (
    DocumentArtifactGateway,
    DocumentParserGateway,
    DocumentRateLimitGateway,
    DocumentStatusGateway,
    get_document_artifact_gateway as _get_document_artifact_gateway,
    get_document_parser_gateway as _get_document_parser_gateway,
    get_document_rate_limit_gateway as _get_document_rate_limit_gateway,
    get_document_status_gateway as _get_document_status_gateway,
)


def get_document_parser() -> DocumentParserGateway:
    return _get_document_parser_gateway()


def get_document_artifact_gateway() -> DocumentArtifactGateway:
    return _get_document_artifact_gateway()


def get_document_status_gateway() -> DocumentStatusGateway:
    return _get_document_status_gateway()


def allow_rag_query_rate_limit(
    *,
    account_id: str,
    max_requests: int,
    window_seconds: int,
) -> tuple[bool, int]:
    return _get_document_rate_limit_gateway().redis_fixed_window_allow(
        key=f"rag:rl:{account_id}",
        max_requests=max_requests,
        window_seconds=window_seconds,
    )
