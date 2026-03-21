"""Ingest Document Use Case — orchestrates the full LlamaIndex ingestion pipeline.

Layers covered:
  [1] Document Upload — receives command with storage_path / raw_text
  [2] OCR — LlamaParse agentic tier
  [3] Ingestion Layer — this orchestrator
  [4] Parsing & Structuring — LlamaParse Markdown output
  [5] Knowledge Modeling — taxonomy classification
  [6] Text Preprocessing — normalisation
  [7] Text Chunking — LlamaIndex SentenceSplitter
  [8] Embedding — OpenAI text-embedding-3-small via LlamaIndex
  [9] Indexing — Firestore persistence
"""

from __future__ import annotations

import logging

from app.rag_pipeline.domain.entities import (
    DocumentChunk,
    IngestDocumentCommand,
    IngestDocumentResult,
)
from app.rag_pipeline.domain.ports import (
    DocumentParserPort,
    EmbedderPort,
    IndexerPort,
    TaxonomyClassifierPort,
    TextChunkerPort,
    TextPreprocessorPort,
)

logger = logging.getLogger(__name__)


class IngestDocumentUseCase:
    """Orchestrate the full ingestion pipeline for a single document."""

    def __init__(
        self,
        parser: DocumentParserPort,
        taxonomy_classifier: TaxonomyClassifierPort,
        preprocessor: TextPreprocessorPort,
        chunker: TextChunkerPort,
        embedder: EmbedderPort,
        indexer: IndexerPort,
    ) -> None:
        self._parser = parser
        self._taxonomy = taxonomy_classifier
        self._preprocessor = preprocessor
        self._chunker = chunker
        self._embedder = embedder
        self._indexer = indexer

    def execute(self, command: IngestDocumentCommand) -> IngestDocumentResult:
        doc_id = command.document_id
        org_id = command.organization_id
        ws_id = command.workspace_id

        try:
            # ── [3] Mark processing ──────────────────────────────────────────
            self._indexer.mark_processing(doc_id, org_id, ws_id)

            # ── [1–2–4] Parse (with OCR) ─────────────────────────────────────
            parsed = self._parser.parse(command)
            logger.info("Parsed %d chars from document %s", len(parsed.text), doc_id)

            if not parsed.text.strip():
                self._indexer.mark_failed(doc_id, org_id, ws_id, "EMPTY_TEXT", "No text extracted")
                return IngestDocumentResult(
                    document_id=doc_id, status="failed", taxonomy="general", chunk_count=0, node_count=0
                )

            # ── [5] Taxonomy classification ──────────────────────────────────
            taxonomy = self._taxonomy.classify(parsed.text, command.taxonomy_hint)

            # ── [6] Text preprocessing ───────────────────────────────────────
            normalised = self._preprocessor.preprocess(parsed.text)

            # ── [7] Chunking ─────────────────────────────────────────────────
            chunks = self._chunker.chunk(
                normalised,
                metadata={
                    "document_id": doc_id,
                    "organization_id": org_id,
                    "workspace_id": ws_id,
                    "title": command.title,
                },
            )
            logger.info("Created %d chunks for document %s", len(chunks), doc_id)

            # Tag each chunk with taxonomy
            chunks = [
                DocumentChunk(
                    chunk_id=c.chunk_id,
                    document_id=c.document_id,
                    chunk_index=c.chunk_index,
                    text=c.text,
                    embedding=c.embedding,
                    taxonomy=taxonomy,
                    page=c.page,
                    metadata=c.metadata,
                )
                for c in chunks
            ]

            # ── [8] Embedding ────────────────────────────────────────────────
            embedded_chunks = self._embedder.embed_chunks(chunks)

            # ── [9] Indexing (Firestore) ─────────────────────────────────────
            self._indexer.save_ready(doc_id, org_id, ws_id, taxonomy, embedded_chunks)

            return IngestDocumentResult(
                document_id=doc_id,
                status="ready",
                taxonomy=taxonomy,
                chunk_count=len(embedded_chunks),
                node_count=len(embedded_chunks),
            )

        except Exception as exc:
            logger.exception("Ingestion failed for document %s", doc_id)
            self._indexer.mark_failed(
                doc_id, org_id, ws_id, "PIPELINE_ERROR", str(exc)[:500]
            )
            return IngestDocumentResult(
                document_id=doc_id, status="failed", taxonomy="general", chunk_count=0, node_count=0
            )
