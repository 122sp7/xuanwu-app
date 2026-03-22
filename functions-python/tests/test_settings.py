import os

import pytest

from app.config.settings import (
    MissingEnvironmentVariableError,
    load_document_ai_settings,
    load_settings,
)


def test_load_document_ai_settings_without_openai(monkeypatch: pytest.MonkeyPatch) -> None:
    """Document AI settings load from hardcoded defaults even without any env vars."""
    monkeypatch.delenv("DOCUMENTAI_PROJECT_ID", raising=False)
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    settings = load_document_ai_settings()

    assert settings.project_id == "65970295651"
    assert settings.location == "asia-southeast1"
    assert settings.ocr_extractor_processor_id == "1516a32299c1709e"
    assert settings.ocr_classifier_processor_id == "17f1013111dec644"
    assert settings.ocr_splitter_processor_id == "ba69ac6cf5650371"


def test_load_document_ai_settings_env_overrides_hardcoded(monkeypatch: pytest.MonkeyPatch) -> None:
    """Env vars override hardcoded defaults when present."""
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


def test_load_document_ai_settings_uses_hardcoded_when_no_env(monkeypatch: pytest.MonkeyPatch) -> None:
    """Without DOCUMENTAI_PROJECT_ID env var, hardcoded default 65970295651 is used."""
    monkeypatch.delenv("DOCUMENTAI_PROJECT_ID", raising=False)

    settings = load_document_ai_settings()

    assert settings.project_id == "65970295651"
    assert settings.ocr_extractor_resource == (
        "projects/65970295651/locations/asia-southeast1/processors/1516a32299c1709e"
    )


def test_load_settings_fails_without_openai_key(monkeypatch: pytest.MonkeyPatch) -> None:
    """load_settings() still requires OPENAI_API_KEY (for the full AppSettings)."""
    monkeypatch.setenv("DOCUMENTAI_PROJECT_ID", "12345")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    with pytest.raises(MissingEnvironmentVariableError, match="OPENAI_API_KEY"):
        load_settings()
