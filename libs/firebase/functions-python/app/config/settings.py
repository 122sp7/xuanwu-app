import os
from dataclasses import dataclass

# Processor IDs for the two Google Document AI processors deployed in asia-southeast1.
# These values are the canonical defaults; override via env vars in production.
_DEFAULT_OCR_EXTRACTOR_PROCESSOR_ID = "1516a32299c1709e"
_DEFAULT_OCR_CLASSIFIER_PROCESSOR_ID = "17f1013111dec644"

# OpenAI embedding defaults aligned with wiki-core domain contracts.
# Model: text-embedding-3-small; dimensions: 1536; max batch size: 20.
_DEFAULT_OPENAI_EMBEDDING_MODEL = "text-embedding-3-small"
_DEFAULT_OPENAI_EMBEDDING_DIMENSIONS = 1536
_DEFAULT_OPENAI_EMBEDDING_BATCH_SIZE = 20


class MissingEnvironmentVariableError(ValueError):
    pass


@dataclass(frozen=True)
class DocumentAiSettings:
    project_id: str
    location: str
    # OCR Extractor processor — extracts full text from documents (PDF, images, etc.)
    ocr_extractor_processor_id: str
    # OCR Classifier processor — classifies document type (invoice, contract, policy, …)
    ocr_classifier_processor_id: str

    @property
    def ocr_extractor_resource(self) -> str:
        return (
            f"projects/{self.project_id}/locations/{self.location}"
            f"/processors/{self.ocr_extractor_processor_id}"
        )

    @property
    def ocr_classifier_resource(self) -> str:
        return (
            f"projects/{self.project_id}/locations/{self.location}"
            f"/processors/{self.ocr_classifier_processor_id}"
        )

    # Backward-compatible property for existing `process_document_with_ai` callable
    @property
    def processor_resource(self) -> str:
        return self.ocr_extractor_resource


@dataclass(frozen=True)
class OpenAiSettings:
    """OpenAI API configuration for the embedding adapter.

    api_key        — OPENAI_API_KEY secret (required at runtime).
    model          — embedding model identifier (default: text-embedding-3-small).
    dimensions     — output vector dimension; must match the Firestore/Upstash vector index.
    max_batch_size — maximum number of text chunks per API call (max 20 per OpenAI rate limits).
    """

    api_key: str
    model: str
    dimensions: int
    max_batch_size: int

    def __post_init__(self) -> None:
        if not self.api_key.strip():
            raise MissingEnvironmentVariableError("OPENAI_API_KEY is required but not set")
        if self.dimensions <= 0:
            raise ValueError(f"OpenAI embedding dimensions must be positive, got {self.dimensions}")
        if not (1 <= self.max_batch_size <= 20):
            raise ValueError(
                f"max_batch_size must be between 1 and 20 (OpenAI rate-limit), got {self.max_batch_size}"
            )


@dataclass(frozen=True)
class AppSettings:
    document_ai: DocumentAiSettings
    openai: OpenAiSettings


def _required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise MissingEnvironmentVariableError(f"Missing required environment variable: {name}")
    return value


def _optional_env(name: str, default: str) -> str:
    return os.getenv(name) or default


def load_settings() -> AppSettings:
    project_id = _required_env("DOCUMENTAI_PROJECT_ID")
    location = _optional_env("DOCUMENTAI_LOCATION", "asia-southeast1")

    # Allow individual env vars; fall back to the shared legacy var, then to hardcoded defaults.
    legacy_processor_id = os.getenv("DOCUMENTAI_PROCESSOR_ID", "")
    ocr_extractor_processor_id = (
        os.getenv("DOCUMENTAI_OCR_EXTRACTOR_PROCESSOR_ID")
        or legacy_processor_id
        or _DEFAULT_OCR_EXTRACTOR_PROCESSOR_ID
    )
    ocr_classifier_processor_id = (
        os.getenv("DOCUMENTAI_OCR_CLASSIFIER_PROCESSOR_ID")
        or _DEFAULT_OCR_CLASSIFIER_PROCESSOR_ID
    )

    openai_api_key = _required_env("OPENAI_API_KEY")
    openai_model = _optional_env("OPENAI_EMBEDDING_MODEL", _DEFAULT_OPENAI_EMBEDDING_MODEL)
    openai_dimensions = int(
        _optional_env("OPENAI_EMBEDDING_DIMENSIONS", str(_DEFAULT_OPENAI_EMBEDDING_DIMENSIONS))
    )
    openai_batch_size = int(
        _optional_env("OPENAI_EMBEDDING_BATCH_SIZE", str(_DEFAULT_OPENAI_EMBEDDING_BATCH_SIZE))
    )

    return AppSettings(
        document_ai=DocumentAiSettings(
            project_id=project_id,
            location=location,
            ocr_extractor_processor_id=ocr_extractor_processor_id,
            ocr_classifier_processor_id=ocr_classifier_processor_id,
        ),
        openai=OpenAiSettings(
            api_key=openai_api_key,
            model=openai_model,
            dimensions=openai_dimensions,
            max_batch_size=openai_batch_size,
        ),
    )
