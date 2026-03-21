"""Domain ports (interfaces) for the LlamaIndex RAG pipeline.

All ports are Protocol-typed so implementations can stay in the infrastructure layer.
Domain layer stays free of any SDK or framework import.
"""

from __future__ import annotations

from typing import Protocol

from app.rag_pipeline.domain.entities import (
    DocumentChunk,
    IngestDocumentCommand,
    ParsedDocument,
    RagQueryInput,
    RagQueryResult,
)


# ── Layer 1–2: Document Upload + OCR / Parsing ──────────────────────────────

class DocumentParserPort(Protocol):
    """[Layer 1–2–4] Parse a raw document (with OCR) into structured text."""

    def parse(self, command: IngestDocumentCommand) -> ParsedDocument: ...


# ── Layer 5: Knowledge Modeling (taxonomy classification) ────────────────────

class TaxonomyClassifierPort(Protocol):
    """[Layer 5] Classify a document into a taxonomy category."""

    def classify(self, text: str, hint: str | None = None) -> str: ...


# ── Layer 6: Text Preprocessing ──────────────────────────────────────────────

class TextPreprocessorPort(Protocol):
    """[Layer 6] Normalise and clean extracted text."""

    def preprocess(self, text: str) -> str: ...


# ── Layer 7: Text Chunking ───────────────────────────────────────────────────

class TextChunkerPort(Protocol):
    """[Layer 7] Split normalised text into retrieval-sized chunks."""

    def chunk(self, text: str, metadata: dict[str, str] | None = None) -> list[DocumentChunk]: ...


# ── Layer 8: Embedding ───────────────────────────────────────────────────────

class EmbedderPort(Protocol):
    """[Layer 8] Embed text chunks into vectors."""

    def embed_chunks(self, chunks: list[DocumentChunk]) -> list[DocumentChunk]: ...


# ── Layer 9: Indexing (persistence) ──────────────────────────────────────────

class IndexerPort(Protocol):
    """[Layer 9] Persist embedded chunks + update document status."""

    def save_ready(
        self,
        document_id: str,
        organization_id: str,
        workspace_id: str,
        taxonomy: str,
        chunks: list[DocumentChunk],
    ) -> None: ...

    def mark_processing(
        self, document_id: str, organization_id: str, workspace_id: str
    ) -> None: ...

    def mark_failed(
        self,
        document_id: str,
        organization_id: str,
        workspace_id: str,
        error_code: str,
        error_message: str,
    ) -> None: ...


# ── Layer 10–13: Full RAG query (retrieval + filter + rerank + generation) ──

class RagQueryPort(Protocol):
    """[Layer 10–13] Execute the full RAG query pipeline."""

    def query(self, input: RagQueryInput) -> RagQueryResult: ...
