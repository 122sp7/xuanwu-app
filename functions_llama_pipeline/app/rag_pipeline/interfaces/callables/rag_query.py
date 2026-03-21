"""Firebase callable handler: RAG query via the LlamaIndex pipeline.

Covers layers [10] Retrieval → [11] Filtering → [12] Reranking → [13] Generation.
"""

from __future__ import annotations

import logging

from app.bootstrap.firebase import ensure_firebase_app
from app.rag_pipeline.application.use_cases.rag_query import RagQueryUseCase
from app.rag_pipeline.domain.entities import RagQueryInput
from app.rag_pipeline.infrastructure.llamaindex.query_engine import (
    LlamaIndexRagQueryEngine,
)

logger = logging.getLogger(__name__)


def handle_rag_query(data: dict) -> dict:
    """Handle the callable request to run a RAG query."""
    ensure_firebase_app()

    input_dto = RagQueryInput(
        organization_id=data["organizationId"],
        workspace_id=data.get("workspaceId"),
        user_query=data["query"],
        taxonomy=data.get("taxonomy"),
        top_k=int(data.get("topK", 10)),
        rerank_top_n=int(data.get("rerankTopN", 5)),
        enable_reranking=data.get("enableReranking", True),
    )

    use_case = RagQueryUseCase(query_engine=LlamaIndexRagQueryEngine())
    result = use_case.execute(input_dto)

    return {
        "answer": result.answer,
        "sources": result.sources,
        "model": result.model,
        "traceId": result.trace_id,
    }
