"""Infrastructure implementation of DocumentParserGateway."""

from __future__ import annotations

import logging
from typing import Any

from infrastructure.external.documentai.client import ParsedDocument, process_document_gcs

logger = logging.getLogger(__name__)


class InfraDocumentParserGateway:
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

        if parser in {"ocr", "genkit"}:
            if not DOCAI_OCR_PROCESSOR_NAME:
                raise ValueError(f"DOCAI_OCR_PROCESSOR_NAME is required when parser='{parser}'")
            return process_document_gcs(
                gcs_uri=gcs_uri,
                mime_type=mime_type,
                processor_name=DOCAI_OCR_PROCESSOR_NAME,
            )

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
