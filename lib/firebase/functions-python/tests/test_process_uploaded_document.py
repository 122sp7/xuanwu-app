from app.rag_ingestion.application.use_cases.process_uploaded_document import (
    ProcessUploadedDocumentUseCase,
)
from app.rag_ingestion.domain.entities import (
    ProcessUploadedDocumentCommand,
    RagChunk,
    RagChunkDraft,
)


class StubParser:
    def parse(self, command: ProcessUploadedDocumentCommand) -> str:
        return command.raw_text


class StubChunker:
    def chunk(self, text: str) -> list[RagChunkDraft]:
        return [
            RagChunkDraft(chunk_index=0, text=text[:12], page=1),
            RagChunkDraft(chunk_index=1, text=text[12:], page=2),
        ]


class StubTaxonomyClassifier:
    def classify(self, text: str, taxonomy_hint: str | None = None) -> str:
        if taxonomy_hint:
            return taxonomy_hint
        return "finance" if "invoice" in text.lower() else "general"


class StubEmbedder:
    def embed(self, chunks: list[RagChunkDraft]) -> list[tuple[float, ...]]:
        return [(1.0, float(index), 0.5, 0.25) for index, _chunk in enumerate(chunks)]


class SpyRepository:
    def __init__(self) -> None:
        self.processing_ids: list[str] = []
        self.ready_payloads: list[tuple[str, str, str, str, list[RagChunk]]] = []
        self.failed_payloads: list[tuple[str, str, str]] = []

    def mark_processing(self, document_id: str) -> None:
        self.processing_ids.append(document_id)

    def save_ready(
        self,
        document_id: str,
        tenant_id: str,
        workspace_id: str,
        taxonomy: str,
        chunks: list[RagChunk],
    ) -> None:
        self.ready_payloads.append((document_id, tenant_id, workspace_id, taxonomy, chunks))

    def mark_failed(self, document_id: str, error_code: str, error_message: str) -> None:
        self.failed_payloads.append((document_id, error_code, error_message))


def test_process_uploaded_document_marks_ready_with_chunks() -> None:
    repository = SpyRepository()
    use_case = ProcessUploadedDocumentUseCase(
        parser=StubParser(),
        chunker=StubChunker(),
        taxonomy_classifier=StubTaxonomyClassifier(),
        embedder=StubEmbedder(),
        document_repository=repository,
    )

    result = use_case.execute(
        ProcessUploadedDocumentCommand(
            document_id="doc-1",
            tenant_id="tenant-1",
            workspace_id="workspace-1",
            title="Invoice",
            source_file_name="invoice.pdf",
            mime_type="application/pdf",
            storage_path="workspaces/workspace-1/files/doc-1/invoice.pdf",
            raw_text="Invoice payment terms and policy summary",
        )
    )

    assert result.status == "ready"
    assert result.taxonomy == "finance"
    assert result.chunk_count == 2
    assert repository.processing_ids == ["doc-1"]
    assert repository.failed_payloads == []
    assert len(repository.ready_payloads) == 1

    document_id, tenant_id, workspace_id, taxonomy, chunks = repository.ready_payloads[0]
    assert document_id == "doc-1"
    assert tenant_id == "tenant-1"
    assert workspace_id == "workspace-1"
    assert taxonomy == "finance"
    assert [chunk.chunk_id for chunk in chunks] == ["doc-1_0", "doc-1_1"]


def test_process_uploaded_document_marks_failed_when_parser_raises() -> None:
    class FailingParser:
        def parse(self, command: ProcessUploadedDocumentCommand) -> str:
            raise RuntimeError("parser exploded")

    repository = SpyRepository()
    use_case = ProcessUploadedDocumentUseCase(
        parser=FailingParser(),
        chunker=StubChunker(),
        taxonomy_classifier=StubTaxonomyClassifier(),
        embedder=StubEmbedder(),
        document_repository=repository,
    )

    try:
        use_case.execute(
            ProcessUploadedDocumentCommand(
                document_id="doc-2",
                tenant_id="tenant-1",
                workspace_id="workspace-1",
                title="Contract",
                source_file_name="contract.pdf",
                mime_type="application/pdf",
                storage_path="workspaces/workspace-1/files/doc-2/contract.pdf",
                raw_text="contract body",
            )
        )
    except RuntimeError as error:
        assert str(error) == "parser exploded"
    else:
        raise AssertionError("Expected parser failure to be re-raised")

    assert repository.processing_ids == ["doc-2"]
    assert repository.ready_payloads == []
    assert repository.failed_payloads == [
        ("doc-2", "INGESTION_PIPELINE_ERROR", "parser exploded")
    ]
