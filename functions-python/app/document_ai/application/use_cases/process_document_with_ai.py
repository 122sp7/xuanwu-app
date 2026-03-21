from app.document_ai.domain.entities import DocumentAiProcessCommand, DocumentAiProcessResult
from app.document_ai.domain.ports import (
    DocumentAiAuditLogRepositoryPort,
    DocumentAiProcessorPort,
)


class ProcessDocumentWithAiUseCase:
    def __init__(
        self,
        processor: DocumentAiProcessorPort,
        audit_log_repository: DocumentAiAuditLogRepositoryPort,
    ) -> None:
        self._processor = processor
        self._audit_log_repository = audit_log_repository

    def execute(self, command: DocumentAiProcessCommand) -> DocumentAiProcessResult:
        result = self._processor.process(command)
        self._audit_log_repository.save(
            workspace_id=command.workspace_id,
            file_name=command.file_name,
            mime_type=command.mime_type,
            page_count=result.page_count,
        )
        return result
