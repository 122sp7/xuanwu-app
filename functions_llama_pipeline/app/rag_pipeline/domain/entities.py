"""Domain entities for the LlamaIndex RAG pipeline.

Pure Python dataclasses — no SDK imports allowed in the domain layer.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal


# ── Document status ──────────────────────────────────────────────────────────

RagDocumentStatus = Literal["uploaded", "processing", "ready", "failed", "archived"]


# ── Ingestion command / result ───────────────────────────────────────────────

@dataclass(frozen=True)
class IngestDocumentCommand:
    """Input required to ingest a single document through the LlamaIndex pipeline."""
    document_id: str
    organization_id: str
    workspace_id: str
    title: str
    source_file_name: str
    mime_type: str
    storage_path: str
    raw_text: str = ""
    taxonomy_hint: str | None = None
    checksum: str | None = None


@dataclass(frozen=True)
class IngestDocumentResult:
    document_id: str
    status: RagDocumentStatus
    taxonomy: str
    chunk_count: int
    node_count: int


# ── Parsed document ──────────────────────────────────────────────────────────

@dataclass(frozen=True)
class ParsedDocument:
    """Output from the parsing / OCR layer."""
    document_id: str
    text: str
    metadata: dict[str, str] = field(default_factory=dict)


# ── Chunk ────────────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class DocumentChunk:
    chunk_id: str
    document_id: str
    chunk_index: int
    text: str
    embedding: tuple[float, ...] = ()
    taxonomy: str = "general"
    page: int | None = None
    metadata: dict[str, str] = field(default_factory=dict)


# ── Query ────────────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class RagQueryInput:
    organization_id: str
    workspace_id: str | None
    user_query: str
    taxonomy: str | None = None
    top_k: int = 10
    rerank_top_n: int = 5
    enable_reranking: bool = True


@dataclass(frozen=True)
class RagQueryResult:
    answer: str
    sources: list[dict[str, object]] = field(default_factory=list)
    model: str = ""
    trace_id: str = ""
