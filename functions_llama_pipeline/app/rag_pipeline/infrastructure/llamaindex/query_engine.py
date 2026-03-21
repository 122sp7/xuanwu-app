"""[Layer 10–13] Full RAG query engine using LlamaIndex.

Handles:
  [10] Semantic Retrieval — VectorStoreIndex query
  [11] Constraint & Filtering — MetadataFilters (org/workspace/taxonomy/isLatest)
  [12] Reranking — CohereRerank or LLMRerank postprocessor
  [13] Reasoning & Generation — LLM response synthesis
"""

from __future__ import annotations

import logging
import uuid

from llama_index.core import Document, Settings, VectorStoreIndex
from llama_index.core.postprocessor import LLMRerank
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI

from app.config.settings import LlamaPipelineSettings
from app.rag_pipeline.domain.entities import RagQueryInput, RagQueryResult

logger = logging.getLogger(__name__)


class LlamaIndexRagQueryEngine:
    """Full RAG query pipeline using LlamaIndex in-memory VectorStoreIndex.

    In production this would connect to a persistent vector store (Firestore, Pinecone, etc.).
    For the beta scaffold it loads chunks from Firestore at query time and builds an ephemeral
    in-memory index per query.
    """

    def query(self, input: RagQueryInput) -> RagQueryResult:
        trace_id = f"llama-rag-{uuid.uuid4().hex[:12]}"

        # ── Configure LlamaIndex settings ────────────────────────────────────
        Settings.embed_model = OpenAIEmbedding(
            model_name=LlamaPipelineSettings.embedding_model(),
            api_key=LlamaPipelineSettings.openai_api_key(),
            dimensions=LlamaPipelineSettings.embedding_dimensions(),
        )
        llm = OpenAI(
            model=LlamaPipelineSettings.llm_model(),
            api_key=LlamaPipelineSettings.openai_api_key(),
        )
        Settings.llm = llm

        # ── Load chunks from Firestore ───────────────────────────────────────
        from app.rag_pipeline.infrastructure.firebase.chunk_loader import (
            load_ready_chunks,
        )

        raw_chunks = load_ready_chunks(
            organization_id=input.organization_id,
            workspace_id=input.workspace_id,
            taxonomy=input.taxonomy,
        )

        if not raw_chunks:
            return RagQueryResult(
                answer="No indexed documents found for the given scope.",
                sources=[],
                model=LlamaPipelineSettings.llm_model(),
                trace_id=trace_id,
            )

        # ── [9] Build ephemeral in-memory index ─────────────────────────────
        documents = [
            Document(
                text=c["text"],
                metadata={
                    "doc_id": c.get("docId", ""),
                    "chunk_index": c.get("chunkIndex", 0),
                    "taxonomy": c.get("taxonomy", "general"),
                    "organization_id": c.get("organizationId", ""),
                    "workspace_id": c.get("workspaceId", ""),
                },
            )
            for c in raw_chunks
        ]
        index = VectorStoreIndex.from_documents(documents)

        # ── [12] Reranking postprocessor ─────────────────────────────────────
        postprocessors = []
        if input.enable_reranking:
            try:
                from llama_index.postprocessor.cohere_rerank import CohereRerank  # type: ignore[import-untyped]

                cohere_key = LlamaPipelineSettings.cohere_api_key()
                if cohere_key:
                    postprocessors.append(
                        CohereRerank(
                            model=LlamaPipelineSettings.rerank_model(),
                            api_key=cohere_key,
                            top_n=input.rerank_top_n,
                        )
                    )
                    logger.info("Cohere reranker enabled (model=%s)", LlamaPipelineSettings.rerank_model())
                else:
                    postprocessors.append(LLMRerank(top_n=input.rerank_top_n))
                    logger.info("LLM reranker fallback enabled")
            except ImportError:
                postprocessors.append(LLMRerank(top_n=input.rerank_top_n))
                logger.info("Cohere rerank not installed — using LLMRerank fallback")

        # ── [10–11] Semantic retrieval + constraint filter via query engine ──
        query_engine = index.as_query_engine(
            similarity_top_k=input.top_k,
            node_postprocessors=postprocessors if postprocessors else None,
        )

        # ── [13] Generation ──────────────────────────────────────────────────
        response = query_engine.query(input.user_query)

        sources = []
        if hasattr(response, "source_nodes"):
            for node in response.source_nodes:
                meta = node.metadata or {}
                sources.append(
                    {
                        "doc_id": meta.get("doc_id", ""),
                        "chunk_index": meta.get("chunk_index", 0),
                        "taxonomy": meta.get("taxonomy", "general"),
                        "score": round(node.score or 0.0, 4) if node.score else 0.0,
                    }
                )

        return RagQueryResult(
            answer=str(response),
            sources=sources,
            model=LlamaPipelineSettings.llm_model(),
            trace_id=trace_id,
        )
