"""
Unit tests for interface/schemas/ — Rule 4 (Contract / Schema) compliance.

Verifies that all HTTPS Callable input schemas reject invalid inputs and
accept valid inputs before reaching the application layer.
"""

from __future__ import annotations

import pytest

from interface.schemas.parse_document import ParseDocumentRequest
from interface.schemas.rag_query import RagQueryRequest
from interface.schemas.rag_reindex import RagReindexRequest


# ── ParseDocumentRequest ──────────────────────────────────────────────────────

class TestParseDocumentRequest:
    def test_fromRaw_WithValidPdf_ReturnsSchema(self) -> None:
        raw = {
            "account_id": "account-1",
            "workspace_id": "workspace-1",
            "gcs_uri": "gs://bucket/uploads/account-1/doc.pdf",
            "filename": "doc.pdf",
            "mime_type": "application/pdf",
        }
        schema = ParseDocumentRequest.from_raw(raw)
        assert schema.account_id == "account-1"
        assert schema.workspace_id == "workspace-1"
        assert schema.gcs_uri == "gs://bucket/uploads/account-1/doc.pdf"
        assert schema.doc_id == "doc"
        assert schema.filename == "doc.pdf"
        assert schema.mime_type == "application/pdf"
        assert schema.run_rag is True

    def test_fromRaw_WithExplicitDocId_UsesProvidedDocId(self) -> None:
        raw = {
            "account_id": "acct",
            "workspace_id": "ws",
            "gcs_uri": "gs://bucket/path/file.pdf",
            "doc_id": "explicit-id",
        }
        schema = ParseDocumentRequest.from_raw(raw)
        assert schema.doc_id == "explicit-id"

    def test_fromRaw_WithRunRagFalse_SetsRunRagFalse(self) -> None:
        raw = {
            "account_id": "acct",
            "workspace_id": "ws",
            "gcs_uri": "gs://bucket/path/file.pdf",
            "run_rag": False,
        }
        schema = ParseDocumentRequest.from_raw(raw)
        assert schema.run_rag is False

    def test_fromRaw_WithParserOcr_AcceptsOcrParser(self) -> None:
        raw = {
            "account_id": "acct",
            "workspace_id": "ws",
            "gcs_uri": "gs://bucket/path/file.pdf",
            "parser": "ocr",
        }
        schema = ParseDocumentRequest.from_raw(raw)
        assert schema.parser == "ocr"

    def test_fromRaw_WithParserGenkit_AcceptsGenkitParser(self) -> None:
        raw = {
            "account_id": "acct",
            "workspace_id": "ws",
            "gcs_uri": "gs://bucket/path/file.pdf",
            "parser": "genkit",
        }
        schema = ParseDocumentRequest.from_raw(raw)
        assert schema.parser == "genkit"

    def test_fromRaw_InfersMimeFromExtension_WhenMimeOmitted(self) -> None:
        raw = {
            "account_id": "acct",
            "workspace_id": "ws",
            "gcs_uri": "gs://bucket/path/scan.tiff",
        }
        schema = ParseDocumentRequest.from_raw(raw)
        assert schema.mime_type == "image/tiff"

    def test_fromRaw_MissingAccountId_RaisesValueError(self) -> None:
        with pytest.raises(ValueError, match="account_id"):
            ParseDocumentRequest.from_raw({
                "workspace_id": "ws",
                "gcs_uri": "gs://bucket/file.pdf",
            })

    def test_fromRaw_MissingWorkspaceId_RaisesValueError(self) -> None:
        with pytest.raises(ValueError, match="workspace_id"):
            ParseDocumentRequest.from_raw({
                "account_id": "acct",
                "gcs_uri": "gs://bucket/file.pdf",
            })

    def test_fromRaw_InvalidGcsUri_RaisesValueError(self) -> None:
        with pytest.raises(ValueError, match="gcs_uri"):
            ParseDocumentRequest.from_raw({
                "account_id": "acct",
                "workspace_id": "ws",
                "gcs_uri": "http://not-gcs/file.pdf",
            })

    def test_fromRaw_UnknownExtensionWithoutMime_RaisesValueError(self) -> None:
        with pytest.raises(ValueError, match="MIME"):
            ParseDocumentRequest.from_raw({
                "account_id": "acct",
                "workspace_id": "ws",
                "gcs_uri": "gs://bucket/path/file.xyz",
            })


# ── RagQueryRequest ───────────────────────────────────────────────────────────

class TestRagQueryRequest:
    def test_fromRaw_WithValidInput_ReturnsSchema(self) -> None:
        schema = RagQueryRequest.from_raw(
            uid="user-1",
            raw={
                "account_id": "acct",
                "workspace_id": "ws",
                "query": "what is RAG?",
            },
            default_require_ready=True,
        )
        assert schema.uid == "user-1"
        assert schema.query == "what is RAG?"
        assert schema.taxonomy_filters == []
        assert schema.top_k is None

    def test_fromRaw_WithTopK_ParsesInt(self) -> None:
        schema = RagQueryRequest.from_raw(
            uid="u",
            raw={"account_id": "a", "workspace_id": "w", "query": "q", "top_k": "5"},
            default_require_ready=True,
        )
        assert schema.top_k == 5

    def test_fromRaw_WithTaxonomyFilters_NormalizesStrings(self) -> None:
        schema = RagQueryRequest.from_raw(
            uid="u",
            raw={
                "account_id": "a",
                "workspace_id": "w",
                "query": "q",
                "taxonomy_filters": ["Finance", "  HR  "],
            },
            default_require_ready=False,
        )
        assert "finance" in schema.taxonomy_filters
        assert "hr" in schema.taxonomy_filters

    def test_fromRaw_EmptyUid_RaisesValueError(self) -> None:
        with pytest.raises(ValueError, match="登入"):
            RagQueryRequest.from_raw(
                uid="",
                raw={"account_id": "a", "workspace_id": "w", "query": "q"},
                default_require_ready=True,
            )

    def test_fromRaw_MissingQuery_RaisesValueError(self) -> None:
        with pytest.raises(ValueError, match="query"):
            RagQueryRequest.from_raw(
                uid="u",
                raw={"account_id": "a", "workspace_id": "w"},
                default_require_ready=True,
            )

    def test_fromRaw_MissingAccountId_RaisesValueError(self) -> None:
        with pytest.raises(ValueError, match="account_id"):
            RagQueryRequest.from_raw(
                uid="u",
                raw={"workspace_id": "w", "query": "q"},
                default_require_ready=True,
            )


# ── RagReindexRequest ─────────────────────────────────────────────────────────

class TestRagReindexRequest:
    def test_fromRaw_WithMinimalValidInput_ReturnsSchema(self) -> None:
        raw = {
            "account_id": "acct",
            "doc_id": "doc-1",
            "json_gcs_uri": "gs://bucket/path/doc-1.json",
        }
        schema = RagReindexRequest.from_raw(raw)
        assert schema.account_id == "acct"
        assert schema.doc_id == "doc-1"
        assert schema.json_gcs_uri == "gs://bucket/path/doc-1.json"
        assert schema.page_count == 0

    def test_fromRaw_MissingAccountId_RaisesValueError(self) -> None:
        with pytest.raises(ValueError, match="account_id"):
            RagReindexRequest.from_raw({"doc_id": "d", "json_gcs_uri": "gs://b/f.json"})

    def test_fromRaw_MissingDocId_RaisesValueError(self) -> None:
        with pytest.raises(ValueError, match="doc_id"):
            RagReindexRequest.from_raw({"account_id": "a", "json_gcs_uri": "gs://b/f.json"})

    def test_fromRaw_MissingJsonGcsUri_RaisesValueError(self) -> None:
        with pytest.raises(ValueError, match="json_gcs_uri"):
            RagReindexRequest.from_raw({"account_id": "a", "doc_id": "d"})

    def test_fromRaw_WithPageCount_ParsesInt(self) -> None:
        raw = {
            "account_id": "a",
            "doc_id": "d",
            "json_gcs_uri": "gs://b/f.json",
            "page_count": "10",
        }
        schema = RagReindexRequest.from_raw(raw)
        assert schema.page_count == 10
