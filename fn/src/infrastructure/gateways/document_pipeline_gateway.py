"""Infrastructure implementation of DocumentPipelineGateway.

Coordinates Document AI parsing (with fallback strategy), GCS JSON
artifact storage, Firestore document state, and Redis rate-limiting —
all delegated to focused infrastructure clients.
"""

from __future__ import annotations

import logging
from typing import Any

from infrastructure.external.documentai.client import ParsedDocument, process_document_gcs
from infrastructure.external.upstash.clients import redis_fixed_window_allow
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
from infrastructure.persistence.storage.client import (
    download_bytes,
    form_json_path,
    genkit_json_path,
    layout_json_path,
    ocr_json_path,
    parsed_json_path,
    upload_json,
)

logger = logging.getLogger(__name__)


class InfraDocumentPipelineGateway:
    @staticmethod
    def _looks_like_empty_layout(parsed: ParsedDocument) -> bool:
        return parsed.page_count <= 0 or (
            len(parsed.chunks) == 0 and not (parsed.text or "").strip()
        )

    @staticmethod
    def _synthesize_chunks_from_text(text: str) -> list[dict[str, Any]]:
        if not text:
            return []
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        if not lines:
            return []
        return [
            {
                "chunk_id": f"fallback-{i:04d}",
                "text": line,
                "page_start": 0,
                "page_end": 0,
                "source_block_indices": [],
                "synthetic": True,
            }
            for i, line in enumerate(lines)
        ]

    def process_document_gcs(
        self, gcs_uri: str, mime_type: str = "application/pdf", parser: str = "layout"
    ) -> Any:
        from core.config import (
            DOCAI_FORM_PROCESSOR_NAME,
            DOCAI_LAYOUT_PROCESSOR_NAME,
            DOCAI_OCR_PROCESSOR_NAME,
        )

        if parser == "form":
            return process_document_gcs(
                gcs_uri=gcs_uri,
                mime_type=mime_type,
                processor_name=DOCAI_FORM_PROCESSOR_NAME,
            )

        if parser == "ocr":
            if not DOCAI_OCR_PROCESSOR_NAME:
                raise ValueError("DOCAI_OCR_PROCESSOR_NAME is required when parser='ocr'")
            return process_document_gcs(
                gcs_uri=gcs_uri,
                mime_type=mime_type,
                processor_name=DOCAI_OCR_PROCESSOR_NAME,
            )

        if parser == "genkit":
            if not DOCAI_OCR_PROCESSOR_NAME:
                raise ValueError("DOCAI_OCR_PROCESSOR_NAME is required when parser='genkit'")
            # Genkit-AI parse uses OCR text as the canonical source for scanned PDFs.
            return process_document_gcs(
                gcs_uri=gcs_uri,
                mime_type=mime_type,
                processor_name=DOCAI_OCR_PROCESSOR_NAME,
            )

        # parser == "layout" (default) — with OCR/Form fallback when layout yields nothing.
        layout_parsed = process_document_gcs(
            gcs_uri=gcs_uri,
            mime_type=mime_type,
            processor_name=DOCAI_LAYOUT_PROCESSOR_NAME,
        )

        if not self._looks_like_empty_layout(layout_parsed):
            return layout_parsed

        fallback_processor = DOCAI_OCR_PROCESSOR_NAME or DOCAI_FORM_PROCESSOR_NAME
        if not fallback_processor:
            logger.warning(
                "DocumentAI: layout output empty for %s but no OCR/Form fallback processor configured",
                gcs_uri,
            )
            return layout_parsed

        fallback_parsed = process_document_gcs(
            gcs_uri=gcs_uri,
            mime_type=mime_type,
            processor_name=fallback_processor,
        )
        fallback_text = (fallback_parsed.text or layout_parsed.text or "").strip()
        fallback_chunks = (
            layout_parsed.chunks
            if layout_parsed.chunks
            else (
                fallback_parsed.chunks
                if fallback_parsed.chunks
                else self._synthesize_chunks_from_text(fallback_text)
            )
        )
        return ParsedDocument(
            text=fallback_text,
            page_count=max(layout_parsed.page_count, fallback_parsed.page_count),
            mime_type=layout_parsed.mime_type or fallback_parsed.mime_type,
            chunks=fallback_chunks,
            entities=fallback_parsed.entities,
        )

    def redis_fixed_window_allow(
        self,
        key: str,
        max_requests: int,
        window_seconds: int,
    ) -> tuple[bool, int]:
        return redis_fixed_window_allow(
            key=key,
            max_requests=max_requests,
            window_seconds=window_seconds,
        )

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

    def parsed_json_path(self, upload_object_path: str) -> str:
        return parsed_json_path(upload_object_path)

    def layout_json_path(self, upload_object_path: str) -> str:
        return layout_json_path(upload_object_path)

    def form_json_path(self, upload_object_path: str) -> str:
        return form_json_path(upload_object_path)

    def ocr_json_path(self, upload_object_path: str) -> str:
        return ocr_json_path(upload_object_path)

    def genkit_json_path(self, upload_object_path: str) -> str:
        return genkit_json_path(upload_object_path)

    def upload_json(self, *, bucket_name: str, object_path: str, data: dict[str, Any]) -> str:
        return upload_json(bucket_name=bucket_name, object_path=object_path, data=data)

    def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes:
        return download_bytes(bucket_name=bucket_name, object_path=object_path)
