from __future__ import annotations

from application.use_cases.parse_document_command import execute_parse_document_command
from application.use_cases.parse_document_pipeline import (
    ParseDocumentCommand,
    ParseDocumentResult,
)
from application.use_cases.rag_reindex import RagReindexCommand, RagReindexResult
from application.use_cases.rag_reindex_command import execute_rag_reindex_command


class _FakeAuthorizationGateway:
    def __init__(self) -> None:
        self.calls: list[tuple[str, tuple[str, str]]] = []

    def assert_actor_can_access_account(self, *, actor_id: str, account_id: str) -> None:
        self.calls.append(("account", (actor_id, account_id)))

    def assert_workspace_belongs_account(self, *, account_id: str, workspace_id: str) -> None:
        self.calls.append(("workspace", (account_id, workspace_id)))


class _FakeDocumentStatusGateway:
    def __init__(self) -> None:
        self.recorded_errors: list[tuple[str, str, str]] = []
        self.recorded_rag_errors: list[tuple[str, str, str]] = []

    def record_error(self, doc_id: str, message: str, account_id: str) -> None:
        self.recorded_errors.append((doc_id, message, account_id))

    def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None:
        self.recorded_rag_errors.append((doc_id, message, account_id))


def test_execute_parse_document_command_authorizes_then_runs_pipeline(monkeypatch) -> None:
    auth_gateway = _FakeAuthorizationGateway()
    status_gateway = _FakeDocumentStatusGateway()
    cmd = ParseDocumentCommand(
        doc_id="doc-1",
        gcs_uri="gs://bucket/uploads/doc-1.pdf",
        bucket_name="bucket",
        object_path="uploads/doc-1.pdf",
        filename="doc-1.pdf",
        size_bytes=10,
        mime_type="application/pdf",
        account_id="acct-1",
        workspace_id="ws-1",
    )

    def _fake_execute_parse_document(inner_cmd: ParseDocumentCommand) -> ParseDocumentResult:
        assert inner_cmd is cmd
        return ParseDocumentResult(
            doc_id=inner_cmd.doc_id,
            parser=inner_cmd.parser,
            page_count=1,
            extraction_ms=10,
            json_gcs_uri="gs://bucket/files/doc-1.layout.json",
        )

    monkeypatch.setattr(
        "application.use_cases.parse_document_command.execute_parse_document",
        _fake_execute_parse_document,
    )

    result = execute_parse_document_command(
        actor_id="user-1",
        cmd=cmd,
        auth_gateway=auth_gateway,
        status_gateway=status_gateway,
    )

    assert result.doc_id == "doc-1"
    assert auth_gateway.calls == [
        ("account", ("user-1", "acct-1")),
        ("workspace", ("acct-1", "ws-1")),
    ]
    assert status_gateway.recorded_errors == []


def test_execute_parse_document_command_records_error_on_failure(monkeypatch) -> None:
    auth_gateway = _FakeAuthorizationGateway()
    status_gateway = _FakeDocumentStatusGateway()
    cmd = ParseDocumentCommand(
        doc_id="doc-2",
        gcs_uri="gs://bucket/uploads/doc-2.pdf",
        bucket_name="bucket",
        object_path="uploads/doc-2.pdf",
        filename="doc-2.pdf",
        size_bytes=10,
        mime_type="application/pdf",
        account_id="acct-2",
        workspace_id="ws-2",
    )

    def _fake_execute_parse_document(_: ParseDocumentCommand) -> ParseDocumentResult:
        raise ValueError("boom")

    monkeypatch.setattr(
        "application.use_cases.parse_document_command.execute_parse_document",
        _fake_execute_parse_document,
    )

    try:
        execute_parse_document_command(
            actor_id="user-2",
            cmd=cmd,
            auth_gateway=auth_gateway,
            status_gateway=status_gateway,
        )
    except RuntimeError as exc:
        assert str(exc) == "parse_document execution failed for doc_id=doc-2"
    else:
        raise AssertionError("RuntimeError expected")

    assert status_gateway.recorded_errors == [("doc-2", "boom", "acct-2")]


def test_execute_rag_reindex_command_authorizes_then_runs_use_case(monkeypatch) -> None:
    auth_gateway = _FakeAuthorizationGateway()
    status_gateway = _FakeDocumentStatusGateway()
    cmd = RagReindexCommand(
        doc_id="doc-3",
        json_gcs_uri="gs://bucket/files/doc-3.layout.json",
        account_id="acct-3",
        workspace_id="ws-3",
    )

    def _fake_execute_rag_reindex(inner_cmd: RagReindexCommand) -> RagReindexResult:
        assert inner_cmd is cmd
        return RagReindexResult(
            doc_id=inner_cmd.doc_id,
            account_id=inner_cmd.account_id,
            chunk_count=2,
            vector_count=2,
            raw_chars=10,
            normalized_chars=9,
            normalization_version="v1",
            language_hint="en",
        )

    monkeypatch.setattr(
        "application.use_cases.rag_reindex_command.execute_rag_reindex",
        _fake_execute_rag_reindex,
    )

    result = execute_rag_reindex_command(
        actor_id="user-3",
        cmd=cmd,
        auth_gateway=auth_gateway,
        status_gateway=status_gateway,
    )

    assert result.doc_id == "doc-3"
    assert auth_gateway.calls == [
        ("account", ("user-3", "acct-3")),
        ("workspace", ("acct-3", "ws-3")),
    ]
    assert status_gateway.recorded_rag_errors == []


def test_execute_rag_reindex_command_records_error_on_failure(monkeypatch) -> None:
    auth_gateway = _FakeAuthorizationGateway()
    status_gateway = _FakeDocumentStatusGateway()
    cmd = RagReindexCommand(
        doc_id="doc-4",
        json_gcs_uri="gs://bucket/files/doc-4.layout.json",
        account_id="acct-4",
        workspace_id="ws-4",
    )

    def _fake_execute_rag_reindex(_: RagReindexCommand) -> RagReindexResult:
        raise ValueError("rag boom")

    monkeypatch.setattr(
        "application.use_cases.rag_reindex_command.execute_rag_reindex",
        _fake_execute_rag_reindex,
    )

    try:
        execute_rag_reindex_command(
            actor_id="user-4",
            cmd=cmd,
            auth_gateway=auth_gateway,
            status_gateway=status_gateway,
        )
    except RuntimeError as exc:
        assert str(exc) == "rag_reindex execution failed for doc_id=doc-4"
    else:
        raise AssertionError("RuntimeError expected")

    assert status_gateway.recorded_rag_errors == [("doc-4", "rag boom", "acct-4")]
