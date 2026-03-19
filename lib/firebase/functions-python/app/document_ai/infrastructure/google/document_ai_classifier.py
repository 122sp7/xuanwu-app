from google.cloud import documentai

from app.config.settings import DocumentAiSettings
from app.document_ai.domain.entities import DocumentAiClassifyResult, DocumentAiProcessCommand
from app.document_ai.domain.ports import DocumentAiClassifierPort


class GoogleCloudDocumentAiClassifier(DocumentAiClassifierPort):
    """OCR Classifier — identifies document type using the Document AI Classifier processor.

    The classifier returns one or more entity predictions.  The first entity (highest confidence)
    is used as the canonical document_type; all entity type names are preserved in
    raw_entity_types for downstream consumers that want the full distribution.
    """

    def __init__(self, settings: DocumentAiSettings) -> None:
        self._settings = settings
        self._client = documentai.DocumentProcessorServiceClient(
            client_options={
                "api_endpoint": f"{settings.location}-documentai.googleapis.com",
            }
        )

    def classify(self, command: DocumentAiProcessCommand) -> DocumentAiClassifyResult:
        raw_document = documentai.RawDocument(
            content=command.content_bytes,
            mime_type=command.mime_type,
        )

        request = documentai.ProcessRequest(
            name=self._settings.ocr_classifier_resource,
            raw_document=raw_document,
        )

        response = self._client.process_document(request=request)
        document = response.document
        entities = list(document.entities)

        if not entities:
            return DocumentAiClassifyResult(
                document_type="general",
                confidence=0.0,
                raw_entity_types=(),
            )

        # Entities are already sorted by confidence (highest first) by the API.
        primary = entities[0]
        return DocumentAiClassifyResult(
            document_type=primary.type_ or "general",
            confidence=float(primary.confidence),
            raw_entity_types=tuple(e.type_ for e in entities if e.type_),
        )
