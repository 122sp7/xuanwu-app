"""Document AI OCR Extractor adapter for the rag_ingestion RagParserPort.

Reads binary content from Firebase Storage and sends it to the Google Document AI
OCR Extractor processor to produce clean extracted text and structured JSON for
downstream chunking and knowledge modeling.
"""
import logging

from google.cloud import documentai
from google.protobuf.json_format import MessageToJson

from app.config.settings import DocumentAiSettings
from app.rag_ingestion.domain.entities import ProcessUploadedDocumentCommand, RagParseResult
from app.rag_ingestion.domain.ports import RagParserPort
from app.rag_ingestion.infrastructure.firebase.storage_reader import FirebaseStorageReader

logger = logging.getLogger(__name__)


class DocumentAiRagParser(RagParserPort):
    """Implements RagParserPort using the Document AI OCR Extractor.

    For each document, it:
    1. Downloads the binary file from Firebase Storage via ``storage_path``.
    2. Submits it to the OCR Extractor processor.
    3. Returns the extracted plain text and the full structured Document AI JSON.

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

    def parse(self, command: ProcessUploadedDocumentCommand) -> RagParseResult:
        # Download binary content from Storage.
        try:
            content_bytes = self._storage_reader.read_bytes(command.storage_path)
        except RuntimeError as exc:
            # If binary read fails, fall back to raw_text (e.g. plain-text uploads).
            if command.raw_text.strip():
                logger.info("Storage read failed for %s (%s); using raw_text fallback (no structured JSON)", command.storage_path, exc)
                return RagParseResult(text=command.raw_text)
            raise

        logger.info(
            "Sending %d bytes (%s) to Document AI OCR Extractor: %s",
            len(content_bytes),
            command.mime_type,
            self._settings.ocr_extractor_resource,
        )

        request = documentai.ProcessRequest(
            name=self._settings.ocr_extractor_resource,
            raw_document=documentai.RawDocument(
                content=content_bytes,
                mime_type=command.mime_type,
            ),
        )

        response = self._client.process_document(request=request)
        document = response.document
        extracted_text = (document.text or "").strip()

        if not extracted_text and command.raw_text.strip():
            # Document AI returned nothing; fall back to any raw text we already have.
            logger.warning("Document AI returned empty text for %s; using raw_text fallback", command.storage_path)
            return RagParseResult(text=command.raw_text)

        # Serialize the full Document AI response to JSON for structured storage.
        # This preserves pages, entities, tables, and other metadata for knowledge modeling.
        structured_json = MessageToJson(documentai.Document.pb(document))

        logger.info(
            "Document AI parsed %s: %d chars text, %d pages, %d chars JSON",
            command.storage_path,
            len(extracted_text),
            len(document.pages),
            len(structured_json) if structured_json else 0,
        )

        return RagParseResult(
            text=extracted_text,
            structured_json=structured_json,
            page_count=len(document.pages),
        )
