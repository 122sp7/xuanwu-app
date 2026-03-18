from typing import Protocol

from .entities import DocumentAiProcessCommand, DocumentAiProcessResult


class DocumentAiProcessorPort(Protocol):
    def process(self, command: DocumentAiProcessCommand) -> DocumentAiProcessResult: ...


class DocumentAiAuditLogRepositoryPort(Protocol):
    def save(
        self,
        workspace_id: str,
        file_name: str,
        mime_type: str,
        page_count: int,
    ) -> None: ...
