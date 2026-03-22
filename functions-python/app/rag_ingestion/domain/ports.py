from typing import Protocol

from .entities import ProcessUploadedDocumentCommand, RagChunk, RagChunkDraft, RagParseResult


class RagParserPort(Protocol):
    def parse(self, command: ProcessUploadedDocumentCommand) -> RagParseResult: ...


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
    """Optional port — persists extracted text and structured JSON to Storage and patches Firestore metadata."""

    def write(
        self,
        *,
        document_id: str,
        organization_id: str,
        workspace_id: str,
        extracted_text: str,
        chunk_count: int,
        taxonomy: str,
        structured_json: str | None = None,
    ) -> str:
        """Returns the Storage path of the saved text file."""
        ...
