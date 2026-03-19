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
    RagTaxonomyClassifierPort,
)


class ProcessUploadedDocumentUseCase:
    def __init__(
        self,
        parser: RagParserPort,
        chunker: RagChunkerPort,
        taxonomy_classifier: RagTaxonomyClassifierPort,
        embedder: RagEmbedderPort,
        document_repository: RagDocumentRepositoryPort,
    ) -> None:
        self._parser = parser
        self._chunker = chunker
        self._taxonomy_classifier = taxonomy_classifier
        self._embedder = embedder
        self._document_repository = document_repository

    def execute(self, command: ProcessUploadedDocumentCommand) -> ProcessUploadedDocumentResult:
        self._document_repository.mark_processing(command.document_id)

        try:
            parsed_text = self._parser.parse(command).strip()
            normalized_text = " ".join(parsed_text.split())
            taxonomy = self._taxonomy_classifier.classify(
                normalized_text,
                command.taxonomy_hint,
            )
            chunk_drafts = self._chunker.chunk(normalized_text)
            embeddings = self._embedder.embed(chunk_drafts)
            if len(chunk_drafts) != len(embeddings):
                raise ValueError(
                    f"Embedder returned {len(embeddings)} embeddings for "
                    f"{len(chunk_drafts)} chunks; counts must match."
                )

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
                "INGESTION_PIPELINE_ERROR",
                str(error),
            )
            raise
