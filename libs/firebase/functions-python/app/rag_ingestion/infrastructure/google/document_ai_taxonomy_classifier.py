"""Document AI OCR Classifier adapter for the rag_ingestion RagTaxonomyClassifierPort.

Sends the already-extracted text (re-encoded as UTF-8 bytes) to the Document AI
Classifier processor and maps the predicted document_type to a taxonomy string.
"""
from google.cloud import documentai

from app.config.settings import DocumentAiSettings
from app.rag_ingestion.domain.ports import RagTaxonomyClassifierPort

# Maps Document AI entity type labels (lowercased) to internal taxonomy strings.
# Unknown labels fall through to "general".
_DOCUMENT_TYPE_TO_TAXONOMY: dict[str, str] = {
    "invoice": "finance",
    "receipt": "finance",
    "purchase_order": "finance",
    "credit_note": "finance",
    "contract": "legal",
    "agreement": "legal",
    "nda": "legal",
    "policy": "governance",
    "compliance": "governance",
    "regulation": "governance",
    "report": "reporting",
    "memo": "reporting",
    "letter": "correspondence",
    "email": "correspondence",
    "form": "operations",
}


def _map_to_taxonomy(document_type: str) -> str:
    normalized = document_type.lower().replace(" ", "_").replace("-", "_")
    return _DOCUMENT_TYPE_TO_TAXONOMY.get(normalized, "general")


class DocumentAiTaxonomyClassifier(RagTaxonomyClassifierPort):
    """Implements RagTaxonomyClassifierPort using the Document AI OCR Classifier.

    The classifier receives the extracted plain text (encoded as UTF-8) and returns
    a taxonomy label based on the predicted document type.

    When a ``taxonomy_hint`` is provided by the upstream caller it is returned
    immediately without calling Document AI — callers that already know the type
    (e.g. manual tagging in the UI) incur zero extra API cost.
    """

    def __init__(self, settings: DocumentAiSettings) -> None:
        self._settings = settings
        self._client = documentai.DocumentProcessorServiceClient(
            client_options={
                "api_endpoint": f"{settings.location}-documentai.googleapis.com",
            }
        )

    def classify(self, text: str, taxonomy_hint: str | None = None) -> str:
        if taxonomy_hint and taxonomy_hint.strip():
            return taxonomy_hint.strip()

        if not text.strip():
            return "general"

        content_bytes = text.encode("utf-8")
        request = documentai.ProcessRequest(
            name=self._settings.ocr_classifier_resource,
            raw_document=documentai.RawDocument(
                content=content_bytes,
                mime_type="text/plain",
            ),
        )

        try:
            response = self._client.process_document(request=request)
            entities = list(response.document.entities)
        except Exception:
            # Classification failures must never block ingestion; fall back to keyword rules.
            return _fallback_classify(text)

        if not entities:
            return _fallback_classify(text)

        primary_type = entities[0].type_ or ""
        return _map_to_taxonomy(primary_type) or _fallback_classify(text)


# Lightweight keyword fallback — mirrors SimpleRagTaxonomyClassifier logic so that
# DocumentAiTaxonomyClassifier degrades gracefully when the API is unavailable.
_FALLBACK_RULES: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("finance", ("invoice", "payment", "receipt")),
    ("governance", ("policy", "compliance", "regulation")),
    ("legal", ("contract", "agreement", "nda")),
)


def _fallback_classify(text: str) -> str:
    lowered = text.lower()
    for taxonomy, keywords in _FALLBACK_RULES:
        if any(keyword in lowered for keyword in keywords):
            return taxonomy
    return "general"
