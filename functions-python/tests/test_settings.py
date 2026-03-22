import os

import pytest

from app.config.settings import (
    MissingEnvironmentVariableError,
    load_document_ai_settings,
    load_settings,
)


def test_load_document_ai_settings_without_openai(monkeypatch: pytest.MonkeyPatch) -> None:
    """Document AI settings must load successfully even when OPENAI_API_KEY is missing."""
    monkeypatch.setenv("DOCUMENTAI_PROJECT_ID", "12345")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    settings = load_document_ai_settings()

    assert settings.project_id == "12345"
    assert settings.location == "asia-southeast1"
    assert settings.ocr_extractor_processor_id == "1516a32299c1709e"
    assert settings.ocr_classifier_processor_id == "17f1013111dec644"
    assert settings.ocr_splitter_processor_id == "ba69ac6cf5650371"


def test_load_document_ai_settings_with_custom_processors(monkeypatch: pytest.MonkeyPatch) -> None:
    """Custom processor IDs override the defaults."""
    monkeypatch.setenv("DOCUMENTAI_PROJECT_ID", "99999")
    monkeypatch.setenv("DOCUMENTAI_LOCATION", "us-central1")
    monkeypatch.setenv("DOCUMENTAI_OCR_EXTRACTOR_PROCESSOR_ID", "custom-extractor")
    monkeypatch.setenv("DOCUMENTAI_OCR_CLASSIFIER_PROCESSOR_ID", "custom-classifier")
    monkeypatch.setenv("DOCUMENTAI_OCR_SPLITTER_PROCESSOR_ID", "custom-splitter")

    settings = load_document_ai_settings()

    assert settings.project_id == "99999"
    assert settings.location == "us-central1"
    assert settings.ocr_extractor_processor_id == "custom-extractor"
    assert settings.ocr_classifier_processor_id == "custom-classifier"
    assert settings.ocr_splitter_processor_id == "custom-splitter"


def test_load_document_ai_settings_fails_without_project_id(monkeypatch: pytest.MonkeyPatch) -> None:
    """Missing DOCUMENTAI_PROJECT_ID must raise MissingEnvironmentVariableError."""
    monkeypatch.delenv("DOCUMENTAI_PROJECT_ID", raising=False)

    with pytest.raises(MissingEnvironmentVariableError, match="DOCUMENTAI_PROJECT_ID"):
        load_document_ai_settings()


def test_load_settings_fails_without_openai_key(monkeypatch: pytest.MonkeyPatch) -> None:
    """load_settings() still requires OPENAI_API_KEY (for the full AppSettings)."""
    monkeypatch.setenv("DOCUMENTAI_PROJECT_ID", "12345")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    with pytest.raises(MissingEnvironmentVariableError, match="OPENAI_API_KEY"):
        load_settings()
