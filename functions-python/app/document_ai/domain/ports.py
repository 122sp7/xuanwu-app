from typing import Protocol

from .entities import DocumentAiClassifyResult, DocumentAiProcessCommand, DocumentAiProcessResult


class DocumentAiProcessorPort(Protocol):
    """Extracts full text and page structure from a document via OCR Extractor."""

    def process(self, command: DocumentAiProcessCommand) -> DocumentAiProcessResult: ...


class DocumentAiClassifierPort(Protocol):
    """Classifies document type (invoice, contract, policy, …) via OCR Classifier."""

    def classify(self, command: DocumentAiProcessCommand) -> DocumentAiClassifyResult: ...


class DocumentAiAuditLogRepositoryPort(Protocol):
    def save(
        self,
        workspace_id: str,
        file_name: str,
        mime_type: str,
        page_count: int,
    ) -> None: ...
