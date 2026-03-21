"""[Layer 7] Text chunker using LlamaIndex SentenceSplitter.

Implements TextChunkerPort.
"""

from __future__ import annotations

from llama_index.core.node_parser import SentenceSplitter

from app.config.settings import LlamaPipelineSettings
from app.rag_pipeline.domain.entities import DocumentChunk


class LlamaIndexChunker:
    """Split text into retrieval-sized chunks via LlamaIndex SentenceSplitter."""

    def __init__(self) -> None:
        self._chunk_size = LlamaPipelineSettings.chunk_size()
        self._chunk_overlap = LlamaPipelineSettings.chunk_overlap()

    def chunk(
        self, text: str, metadata: dict[str, str] | None = None
    ) -> list[DocumentChunk]:
        splitter = SentenceSplitter(
            chunk_size=self._chunk_size,
            chunk_overlap=self._chunk_overlap,
        )
        splits = splitter.split_text(text)

        chunks: list[DocumentChunk] = []
        doc_id = (metadata or {}).get("document_id", "unknown")
        for idx, split_text in enumerate(splits):
            chunks.append(
                DocumentChunk(
                    chunk_id=f"{doc_id}_{idx}",
                    document_id=doc_id,
                    chunk_index=idx,
                    text=split_text,
                    metadata=metadata or {},
                )
            )
        return chunks
