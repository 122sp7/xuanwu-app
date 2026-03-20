from google.cloud import documentai

from app.config.settings import DocumentAiSettings
from app.document_ai.domain.entities import DocumentAiProcessCommand, DocumentAiProcessResult
from app.document_ai.domain.ports import DocumentAiProcessorPort


class GoogleCloudDocumentAiProcessor(DocumentAiProcessorPort):
    """OCR Extractor — extracts full text from PDF, images, and other document types."""

    def __init__(self, settings: DocumentAiSettings) -> None:
        self._settings = settings
        self._client = documentai.DocumentProcessorServiceClient(
            client_options={
                "api_endpoint": f"{settings.location}-documentai.googleapis.com",
            }
        )

    def process(self, command: DocumentAiProcessCommand) -> DocumentAiProcessResult:
        raw_document = documentai.RawDocument(
            content=command.content_bytes,
            mime_type=command.mime_type,
        )

        request = documentai.ProcessRequest(
            name=self._settings.ocr_extractor_resource,
            raw_document=raw_document,
        )

        response = self._client.process_document(request=request)
        document = response.document

        return DocumentAiProcessResult(
            text=document.text or "",
            page_count=len(document.pages),
        )
