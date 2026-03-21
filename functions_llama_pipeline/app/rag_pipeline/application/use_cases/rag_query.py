"""RAG Query Use Case — orchestrates retrieval + reranking + generation.

Layers covered:
  [10] Semantic Retrieval — LlamaIndex VectorStoreIndex
  [11] Constraint & Filtering — MetadataFilters (org/workspace/taxonomy)
  [12] Reranking — Cohere or LLM reranker
  [13] Reasoning & Generation — LLM response synthesis
"""

from __future__ import annotations

import logging

from app.rag_pipeline.domain.entities import RagQueryInput, RagQueryResult
from app.rag_pipeline.domain.ports import RagQueryPort

logger = logging.getLogger(__name__)


class RagQueryUseCase:
    """Execute the full RAG query pipeline."""

    def __init__(self, query_engine: RagQueryPort) -> None:
        self._engine = query_engine

    def execute(self, input: RagQueryInput) -> RagQueryResult:
        logger.info(
            "RAG query: org=%s ws=%s taxonomy=%s top_k=%d rerank=%s",
            input.organization_id,
            input.workspace_id,
            input.taxonomy,
            input.top_k,
            input.enable_reranking,
        )
        return self._engine.query(input)
