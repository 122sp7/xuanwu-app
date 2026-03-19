from app.rag_ingestion.domain.entities import (
    ProcessUploadedDocumentCommand,
    ProcessUploadedDocumentResult,
    RagChunk,
)
from app.rag_ingestion.domain.ports import (
    RagChunkerPort,
    RagDocumentRepositoryPort,
    RagEmbedderPort,
    RagParserPort,
)


class ProcessUploadedDocumentUseCase:
    def __init__(
        self,
        parser: RagParserPort,
        chunker: RagChunkerPort,
        embedder: RagEmbedderPort,
        document_repository: RagDocumentRepositoryPort,
    ) -> None:
        self._parser = parser
        self._chunker = chunker
        self._embedder = embedder
        self._document_repository = document_repository

    def execute(self, command: ProcessUploadedDocumentCommand) -> ProcessUploadedDocumentResult:
        self._document_repository.mark_processing(command.document_id)

        try:
            parsed_text = self._parser.parse(command).strip()
            normalized_text = " ".join(parsed_text.split())
            taxonomy = (command.taxonomy_hint or self._derive_taxonomy(normalized_text)).strip()
            chunk_drafts = self._chunker.chunk(normalized_text)
            embeddings = self._embedder.embed(chunk_drafts)

            chunks = [
                RagChunk(
                    chunk_id=f"{command.document_id}_{draft.chunk_index}",
                    doc_id=command.document_id,
                    chunk_index=draft.chunk_index,
                    text=draft.text,
                    embedding=embedding,
                    taxonomy=taxonomy,
                    page=draft.page,
                    tags=draft.tags,
                )
                for draft, embedding in zip(chunk_drafts, embeddings, strict=True)
            ]

            self._document_repository.save_ready(
                command.document_id,
                command.tenant_id,
                command.workspace_id,
                taxonomy,
                chunks,
            )

            return ProcessUploadedDocumentResult(
                document_id=command.document_id,
                status="ready",
                taxonomy=taxonomy,
                chunk_count=len(chunks),
            )
        except Exception as error:
            self._document_repository.mark_failed(
                command.document_id,
                "PARSER_RUNTIME_ERROR",
                str(error),
            )
            raise

    @staticmethod
    def _derive_taxonomy(text: str) -> str:
        if not text:
            return "general"

        lowered = text.lower()
        if "invoice" in lowered or "payment" in lowered:
            return "finance"
        if "policy" in lowered or "compliance" in lowered:
            return "governance"
        if "contract" in lowered or "agreement" in lowered:
            return "legal"
        return "general"
