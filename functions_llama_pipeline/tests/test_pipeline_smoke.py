"""Smoke tests for the LlamaIndex RAG pipeline domain and infrastructure wiring."""

from app.rag_pipeline.domain.entities import (
    DocumentChunk,
    IngestDocumentCommand,
    IngestDocumentResult,
    ParsedDocument,
    RagQueryInput,
    RagQueryResult,
)
from app.rag_pipeline.infrastructure.llamaindex.preprocessor import LlamaTextPreprocessor
from app.rag_pipeline.infrastructure.llamaindex.taxonomy import SimpleTaxonomyClassifier


# ── Entity instantiation tests ───────────────────────────────────────────────

def test_ingest_command_creates():
    cmd = IngestDocumentCommand(
        document_id="d1",
        organization_id="org1",
        workspace_id="ws1",
        title="Test",
        source_file_name="test.pdf",
        mime_type="application/pdf",
        storage_path="orgs/org1/files/test.pdf",
    )
    assert cmd.document_id == "d1"
    assert cmd.raw_text == ""


def test_parsed_document_creates():
    doc = ParsedDocument(document_id="d1", text="hello world")
    assert doc.text == "hello world"


def test_document_chunk_creates():
    chunk = DocumentChunk(
        chunk_id="d1_0", document_id="d1", chunk_index=0, text="hello"
    )
    assert chunk.embedding == ()
    assert chunk.taxonomy == "general"


def test_ingest_result_creates():
    result = IngestDocumentResult(
        document_id="d1", status="ready", taxonomy="finance", chunk_count=5, node_count=5
    )
    assert result.status == "ready"


def test_rag_query_input_defaults():
    qi = RagQueryInput(organization_id="org1", workspace_id=None, user_query="test")
    assert qi.top_k == 10
    assert qi.enable_reranking is True


def test_rag_query_result_creates():
    r = RagQueryResult(answer="hello", model="gpt-4o-mini", trace_id="t1")
    assert r.sources == []


# ── Preprocessor tests ───────────────────────────────────────────────────────

def test_preprocessor_collapses_whitespace():
    p = LlamaTextPreprocessor()
    assert p.preprocess("  hello   world  \n\n  foo  ") == "hello world foo"


def test_preprocessor_strips_markdown_headers():
    p = LlamaTextPreprocessor()
    assert p.preprocess("### Hello World") == "Hello World"


# ── Taxonomy classifier tests ───────────────────────────────────────────────

def test_taxonomy_hint_overrides():
    tc = SimpleTaxonomyClassifier()
    assert tc.classify("random text", "legal") == "legal"


def test_taxonomy_detects_finance():
    tc = SimpleTaxonomyClassifier()
    assert tc.classify("This invoice has payment details and revenue") == "finance"


def test_taxonomy_defaults_to_general():
    tc = SimpleTaxonomyClassifier()
    assert tc.classify("lorem ipsum dolor sit amet") == "general"
