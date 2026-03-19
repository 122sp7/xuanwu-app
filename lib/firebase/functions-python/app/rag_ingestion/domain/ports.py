from typing import Protocol

from .entities import ProcessUploadedDocumentCommand, RagChunk, RagChunkDraft


class RagParserPort(Protocol):
    def parse(self, command: ProcessUploadedDocumentCommand) -> str: ...


class RagChunkerPort(Protocol):
    def chunk(self, text: str) -> list[RagChunkDraft]: ...


class RagEmbedderPort(Protocol):
    def embed(self, chunks: list[RagChunkDraft]) -> list[tuple[float, ...]]: ...


class RagDocumentRepositoryPort(Protocol):
    def mark_processing(self, document_id: str) -> None: ...

    def save_ready(
        self,
        document_id: str,
        tenant_id: str,
        workspace_id: str,
        taxonomy: str,
        chunks: list[RagChunk],
    ) -> None: ...

    def mark_failed(self, document_id: str, error_code: str, error_message: str) -> None: ...
