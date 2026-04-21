"""Infrastructure implementation of DocumentStatusGateway."""

from __future__ import annotations

from infrastructure.persistence.firestore.document_repository import (
    init_document,
    mark_rag_ready,
    record_error,
    record_rag_error,
    update_parsed,
    update_parsed_form,
    update_parsed_genkit,
    update_parsed_layout,
    update_parsed_ocr,
)


class InfraDocumentStatusGateway:
    def init_document(
        self,
        *,
        doc_id: str,
        gcs_uri: str,
        filename: str,
        size_bytes: int,
        mime_type: str,
        account_id: str,
        workspace_id: str,
    ) -> None:
        init_document(
            doc_id=doc_id,
            gcs_uri=gcs_uri,
            filename=filename,
            size_bytes=size_bytes,
            mime_type=mime_type,
            account_id=account_id,
            workspace_id=workspace_id,
        )

    def update_parsed(
        self,
        *,
        doc_id: str,
        json_gcs_uri: str,
        page_count: int,
        extraction_ms: int,
        account_id: str,
        chunk_count: int = 0,
        entity_count: int = 0,
    ) -> None:
        update_parsed(
            doc_id=doc_id,
            json_gcs_uri=json_gcs_uri,
            page_count=page_count,
            extraction_ms=extraction_ms,
            account_id=account_id,
            chunk_count=chunk_count,
            entity_count=entity_count,
        )

    def update_parsed_layout(
        self,
        *,
        doc_id: str,
        layout_json_gcs_uri: str,
        page_count: int,
        extraction_ms: int,
        account_id: str,
        chunk_count: int = 0,
    ) -> None:
        update_parsed_layout(
            doc_id=doc_id,
            layout_json_gcs_uri=layout_json_gcs_uri,
            page_count=page_count,
            extraction_ms=extraction_ms,
            account_id=account_id,
            chunk_count=chunk_count,
        )

    def update_parsed_form(
        self,
        *,
        doc_id: str,
        form_json_gcs_uri: str,
        account_id: str,
        extraction_ms: int = 0,
        entity_count: int = 0,
    ) -> None:
        update_parsed_form(
            doc_id=doc_id,
            form_json_gcs_uri=form_json_gcs_uri,
            account_id=account_id,
            extraction_ms=extraction_ms,
            entity_count=entity_count,
        )

    def update_parsed_ocr(
        self,
        *,
        doc_id: str,
        ocr_json_gcs_uri: str,
        account_id: str,
        page_count: int,
        extraction_ms: int = 0,
    ) -> None:
        update_parsed_ocr(
            doc_id=doc_id,
            ocr_json_gcs_uri=ocr_json_gcs_uri,
            account_id=account_id,
            page_count=page_count,
            extraction_ms=extraction_ms,
        )

    def update_parsed_genkit(
        self,
        *,
        doc_id: str,
        genkit_json_gcs_uri: str,
        account_id: str,
        extraction_ms: int = 0,
    ) -> None:
        update_parsed_genkit(
            doc_id=doc_id,
            genkit_json_gcs_uri=genkit_json_gcs_uri,
            account_id=account_id,
            extraction_ms=extraction_ms,
        )

    def mark_rag_ready(
        self,
        *,
        doc_id: str,
        chunk_count: int,
        vector_count: int,
        embedding_model: str,
        embedding_dimensions: int,
        raw_chars: int,
        normalized_chars: int,
        normalization_version: str,
        language_hint: str,
        account_id: str,
    ) -> None:
        mark_rag_ready(
            doc_id=doc_id,
            chunk_count=chunk_count,
            vector_count=vector_count,
            embedding_model=embedding_model,
            embedding_dimensions=embedding_dimensions,
            raw_chars=raw_chars,
            normalized_chars=normalized_chars,
            normalization_version=normalization_version,
            language_hint=language_hint,
            account_id=account_id,
        )

    def record_error(self, doc_id: str, message: str, account_id: str) -> None:
        record_error(doc_id=doc_id, message=message, account_id=account_id)

    def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None:
        record_rag_error(doc_id=doc_id, message=message, account_id=account_id)
