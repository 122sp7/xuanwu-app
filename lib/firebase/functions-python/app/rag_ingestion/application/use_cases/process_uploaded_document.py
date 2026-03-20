from app.rag_ingestion.domain.entities import (
    ProcessUploadedDocumentCommand,
    ProcessUploadedDocumentResult,
    RagChunk,
)
from app.rag_ingestion.domain.ports import (
    ProcessedTextWriterPort,
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
        text_writer: ProcessedTextWriterPort | None = None,
    ) -> None:
        self._parser = parser
        self._chunker = chunker
        self._taxonomy_classifier = taxonomy_classifier
        self._embedder = embedder
        self._document_repository = document_repository
        self._text_writer = text_writer

    def execute(self, command: ProcessUploadedDocumentCommand) -> ProcessUploadedDocumentResult:
        self._document_repository.mark_processing(
            command.document_id,
            command.organization_id,
            command.workspace_id,
        )

        try:
            parsed_text = self._parser.parse(command).strip()
            normalized_text = " ".join(parsed_text.split())
            taxonomy = self._taxonomy_classifier.classify(
                normalized_text,
                command.taxonomy_hint,
            )
            chunk_drafts = self._chunker.chunk(normalized_text)
            embeddings = self._embedder.embed(chunk_drafts)
            # Adapters may change independently, so guard the orchestration contract here before
            # the zip-based chunk assembly; the explicit check keeps the document-specific error
            # message clearer than the generic `zip(..., strict=True)` failure alone.
            if len(chunk_drafts) != len(embeddings):
                raise ValueError(
                    f"Embedder returned {len(embeddings)} embeddings for "
                    f"{len(chunk_drafts)} chunks on document {command.document_id}; counts must match."
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
                command.organization_id,
                command.workspace_id,
                taxonomy,
                chunks,
            )

            # Optional: persist extracted text to Storage and patch Firestore metadata.
            if self._text_writer is not None:
                self._text_writer.write(
                    document_id=command.document_id,
                    organization_id=command.organization_id,
                    workspace_id=command.workspace_id,
                    extracted_text=parsed_text,
                    chunk_count=len(chunks),
                    taxonomy=taxonomy,
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
                command.organization_id,
                command.workspace_id,
                "INGESTION_PIPELINE_ERROR",
                str(error),
            )
            raise
