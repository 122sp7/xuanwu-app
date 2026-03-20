import os
from dataclasses import dataclass

# Processor IDs for the two Google Document AI processors deployed in asia-southeast1.
# These values are the canonical defaults; override via env vars in production.
_DEFAULT_OCR_EXTRACTOR_PROCESSOR_ID = "1516a32299c1709e"
_DEFAULT_OCR_CLASSIFIER_PROCESSOR_ID = "17f1013111dec644"


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
class AppSettings:
    document_ai: DocumentAiSettings


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

    return AppSettings(
        document_ai=DocumentAiSettings(
            project_id=project_id,
            location=location,
            ocr_extractor_processor_id=ocr_extractor_processor_id,
            ocr_classifier_processor_id=ocr_classifier_processor_id,
        )
    )
