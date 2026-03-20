from typing import Protocol

from .entities import ProcessUploadedDocumentCommand, RagChunk, RagChunkDraft


class RagParserPort(Protocol):
    def parse(self, command: ProcessUploadedDocumentCommand) -> str: ...


class RagChunkerPort(Protocol):
    def chunk(self, text: str) -> list[RagChunkDraft]: ...


class RagTaxonomyClassifierPort(Protocol):
    def classify(self, text: str, taxonomy_hint: str | None = None) -> str: ...


class RagEmbedderPort(Protocol):
    def embed(self, chunks: list[RagChunkDraft]) -> list[tuple[float, ...]]: ...


class RagDocumentRepositoryPort(Protocol):
    def mark_processing(self, document_id: str, organization_id: str, workspace_id: str) -> None: ...

    def save_ready(
        self,
        document_id: str,
        organization_id: str,
        workspace_id: str,
        taxonomy: str,
        chunks: list[RagChunk],
    ) -> None: ...

    def mark_failed(
        self,
        document_id: str,
        organization_id: str,
        workspace_id: str,
        error_code: str,
        error_message: str,
    ) -> None: ...


class ProcessedTextWriterPort(Protocol):
    """Optional port — persists extracted text to Storage and patches Firestore metadata."""

    def write(
        self,
        *,
        document_id: str,
        organization_id: str,
        workspace_id: str,
        extracted_text: str,
        chunk_count: int,
        taxonomy: str,
    ) -> str:
        """Returns the Storage path of the saved text file."""
        ...
