from dataclasses import dataclass
from typing import Literal

RagDocumentStatus = Literal["uploaded", "processing", "ready", "failed"]

ALLOWED_STATUS_TRANSITIONS: dict[RagDocumentStatus, tuple[RagDocumentStatus, ...]] = {
    "uploaded": ("processing",),
    "processing": ("ready", "failed"),
    "ready": ("processing",),
    "failed": ("processing",),
}


@dataclass(frozen=True)
class RagChunkDraft:
    chunk_index: int
    text: str
    page: int | None = None
    tags: tuple[str, ...] = ()


@dataclass(frozen=True)
class RagChunk:
    chunk_id: str
    doc_id: str
    chunk_index: int
    text: str
    embedding: tuple[float, ...]
    taxonomy: str
    page: int | None = None
    tags: tuple[str, ...] = ()


@dataclass(frozen=True)
class ProcessUploadedDocumentCommand:
    document_id: str
    tenant_id: str
    workspace_id: str
    title: str
    source_file_name: str
    mime_type: str
    storage_path: str
    raw_text: str
    checksum: str | None = None
    taxonomy_hint: str | None = None


@dataclass(frozen=True)
class ProcessUploadedDocumentResult:
    document_id: str
    status: RagDocumentStatus
    taxonomy: str
    chunk_count: int


def can_transition_status(from_status: RagDocumentStatus, to_status: RagDocumentStatus) -> bool:
    return to_status in ALLOWED_STATUS_TRANSITIONS.get(from_status, ())
