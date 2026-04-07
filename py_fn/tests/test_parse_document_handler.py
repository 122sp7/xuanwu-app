from __future__ import annotations

from types import SimpleNamespace

from interface.handlers.parse_document import handle_parse_document


class _FakeParsedDocument:
    def __init__(self, page_count: int = 3, text: str = "parsed content") -> None:
        self.page_count = page_count
        self.text = text


class _FakeRuntime:
    def __init__(self) -> None:
        self.init_kwargs: dict | None = None
        self.update_kwargs: dict | None = None
        self.mark_rag_ready_kwargs: dict | None = None

    def init_document(self, **kwargs) -> None:
        self.init_kwargs = kwargs

    def process_document_gcs(self, *, gcs_uri: str, mime_type: str) -> _FakeParsedDocument:
        return _FakeParsedDocument()

    def parsed_json_path(self, upload_object_path: str) -> str:
        return f"files/{upload_object_path}.json"

    def upload_json(self, *, bucket_name: str, object_path: str, data: dict) -> str:
        return f"gs://{bucket_name}/{object_path}"

    def update_parsed(self, **kwargs) -> None:
        self.update_kwargs = kwargs

    def mark_rag_ready(self, **kwargs) -> None:
        self.mark_rag_ready_kwargs = kwargs

    def record_error(self, doc_id: str, message: str, account_id: str) -> None:
        raise AssertionError(f"record_error should not be called: {doc_id} {message} {account_id}")

    def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None:
        raise AssertionError(f"record_rag_error should not be called: {doc_id} {message} {account_id}")


class _FakeRagResult:
    chunk_count = 2
    vector_count = 2
    embedding_model = "text-embedding-3-small"
    embedding_dimensions = 1024
    raw_chars = 24
    normalized_chars = 20
    normalization_version = "v2"
    language_hint = "en"


def test_handleParseDocument_WithExplicitDocIdAndRunRagFalse_UsesProvidedDocId(monkeypatch) -> None:
    runtime = _FakeRuntime()

    monkeypatch.setattr("interface.handlers.parse_document.get_document_pipeline", lambda: runtime)

    def _unexpected_rag(**kwargs):
        raise AssertionError(f"ingest_document_for_rag should not be called: {kwargs}")

    monkeypatch.setattr("interface.handlers.parse_document.ingest_document_for_rag", _unexpected_rag)

    response = handle_parse_document(
        SimpleNamespace(
            data={
                "account_id": "account-1",
                "workspace_id": "workspace-1",
                "doc_id": "source-file-123",
                "gcs_uri": "gs://bucket/organizations/org/workspaces/workspace-1/files/source-file-123/report.pdf",
                "filename": "report.pdf",
                "mime_type": "application/pdf",
                "run_rag": False,
            }
        )
    )

    assert response["doc_id"] == "source-file-123"
    assert runtime.init_kwargs is not None
    assert runtime.init_kwargs["doc_id"] == "source-file-123"
    assert runtime.update_kwargs is not None
    assert runtime.mark_rag_ready_kwargs is None


def test_handleParseDocument_WithoutDocId_KeepsDefaultRagBehavior(monkeypatch) -> None:
    runtime = _FakeRuntime()

    monkeypatch.setattr("interface.handlers.parse_document.get_document_pipeline", lambda: runtime)
    monkeypatch.setattr(
        "interface.handlers.parse_document.ingest_document_for_rag",
        lambda **kwargs: _FakeRagResult(),
    )

    response = handle_parse_document(
        SimpleNamespace(
            data={
                "account_id": "account-1",
                "workspace_id": "workspace-1",
                "gcs_uri": "gs://bucket/uploads/account-1/report.pdf",
                "filename": "report.pdf",
                "mime_type": "application/pdf",
            }
        )
    )

    assert response["doc_id"] == "report"
    assert runtime.init_kwargs is not None
    assert runtime.init_kwargs["doc_id"] == "report"
    assert runtime.mark_rag_ready_kwargs is not None
    assert runtime.mark_rag_ready_kwargs["chunk_count"] == 2