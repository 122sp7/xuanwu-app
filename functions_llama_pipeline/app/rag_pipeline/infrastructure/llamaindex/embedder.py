"""[Layer 8] Embedder using LlamaIndex OpenAI embeddings.

Implements EmbedderPort.
"""

from __future__ import annotations

import logging

from llama_index.embeddings.openai import OpenAIEmbedding

from app.config.settings import LlamaPipelineSettings
from app.rag_pipeline.domain.entities import DocumentChunk

logger = logging.getLogger(__name__)


class LlamaIndexEmbedder:
    """Embed document chunks via OpenAI text-embedding model."""

    def __init__(self) -> None:
        self._model = LlamaPipelineSettings.embedding_model()
        self._dimensions = LlamaPipelineSettings.embedding_dimensions()

    def embed_chunks(self, chunks: list[DocumentChunk]) -> list[DocumentChunk]:
        embed_model = OpenAIEmbedding(
            model_name=self._model,
            api_key=LlamaPipelineSettings.openai_api_key(),
            dimensions=self._dimensions,
        )

        texts = [c.text for c in chunks]
        logger.info("Embedding %d chunks with model=%s dims=%d", len(texts), self._model, self._dimensions)
        embeddings = embed_model.get_text_embedding_batch(texts, show_progress=False)

        result: list[DocumentChunk] = []
        for chunk, emb in zip(chunks, embeddings, strict=True):
            result.append(
                DocumentChunk(
                    chunk_id=chunk.chunk_id,
                    document_id=chunk.document_id,
                    chunk_index=chunk.chunk_index,
                    text=chunk.text,
                    embedding=tuple(emb),
                    taxonomy=chunk.taxonomy,
                    page=chunk.page,
                    metadata=chunk.metadata,
                )
            )
        return result
