from __future__ import annotations

from domain.repositories import DocumentPipelineGateway, get_document_pipeline_gateway


def get_document_pipeline() -> DocumentPipelineGateway:
    return get_document_pipeline_gateway()


def allow_rag_query_rate_limit(
    *,
    account_id: str,
    max_requests: int,
    window_seconds: int,
) -> tuple[bool, int]:
    return get_document_pipeline_gateway().redis_fixed_window_allow(
        key=f"rag:rl:{account_id}",
        max_requests=max_requests,
        window_seconds=window_seconds,
    )
