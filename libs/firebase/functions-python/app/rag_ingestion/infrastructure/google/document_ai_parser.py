"""Document AI OCR Extractor adapter for the rag_ingestion RagParserPort.

Reads binary content from Firebase Storage and sends it to the Google Document AI
OCR Extractor processor to produce clean extracted text for downstream chunking.
"""
from google.cloud import documentai

from app.config.settings import DocumentAiSettings
from app.rag_ingestion.domain.entities import ProcessUploadedDocumentCommand
from app.rag_ingestion.domain.ports import RagParserPort
from app.rag_ingestion.infrastructure.firebase.storage_reader import FirebaseStorageReader


class DocumentAiRagParser(RagParserPort):
    """Implements RagParserPort using the Document AI OCR Extractor.

    For each document, it:
    1. Downloads the binary file from Firebase Storage via ``storage_path``.
    2. Submits it to the OCR Extractor processor.
    3. Returns the extracted plain text.

    Falls back to ``command.raw_text`` when the storage read fails and raw_text is available.
    """

    def __init__(
        self,
        settings: DocumentAiSettings,
        storage_reader: FirebaseStorageReader | None = None,
    ) -> None:
        self._settings = settings
        self._storage_reader = storage_reader or FirebaseStorageReader()
        self._client = documentai.DocumentProcessorServiceClient(
            client_options={
                "api_endpoint": f"{settings.location}-documentai.googleapis.com",
            }
        )

    def parse(self, command: ProcessUploadedDocumentCommand) -> str:
        # Download binary content from Storage.
        try:
            content_bytes = self._storage_reader.read_bytes(command.storage_path)
        except RuntimeError:
            # If binary read fails, fall back to raw_text (e.g. plain-text uploads).
            if command.raw_text.strip():
                return command.raw_text
            raise

        request = documentai.ProcessRequest(
            name=self._settings.ocr_extractor_resource,
            raw_document=documentai.RawDocument(
                content=content_bytes,
                mime_type=command.mime_type,
            ),
        )

        response = self._client.process_document(request=request)
        extracted_text = (response.document.text or "").strip()

        if not extracted_text and command.raw_text.strip():
            # Document AI returned nothing; fall back to any raw text we already have.
            return command.raw_text

        return extracted_text
