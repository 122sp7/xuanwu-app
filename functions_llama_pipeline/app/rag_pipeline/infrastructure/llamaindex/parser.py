"""[Layer 1–2–4] LlamaParse-based document parser with agentic OCR.

Implements DocumentParserPort using the LlamaParse SDK.
Handles: Document Upload → OCR → Parsing & Structuring.
"""

from __future__ import annotations

import logging
import tempfile

import nest_asyncio
from llama_parse import LlamaParse

from app.config.settings import LlamaPipelineSettings
from app.rag_pipeline.domain.entities import IngestDocumentCommand, ParsedDocument

nest_asyncio.apply()
logger = logging.getLogger(__name__)


class LlamaParseDocumentParser:
    """Parse documents via LlamaParse with agentic OCR.

    Covers pipeline layers:
      [1] Document Upload — receives the storage path / raw text
      [2] OCR — LlamaParse agentic tier handles scanned PDFs, images
      [4] Parsing & Structuring — returns clean Markdown text
    """

    def __init__(self) -> None:
        self._api_key = LlamaPipelineSettings.llama_cloud_api_key()

    def parse(self, command: IngestDocumentCommand) -> ParsedDocument:
        """Parse a document. Prefers binary file from storage_path; falls back to raw_text."""
        if command.raw_text.strip():
            logger.info("Using raw_text for document %s", command.document_id)
            return ParsedDocument(
                document_id=command.document_id,
                text=command.raw_text,
                metadata={
                    "source_file_name": command.source_file_name,
                    "mime_type": command.mime_type,
                    "title": command.title,
                },
            )

        logger.info("Parsing document %s via LlamaParse", command.document_id)
        parser = LlamaParse(
            api_key=self._api_key,
            result_type="markdown",
            verbose=False,
            language="en",
        )

        # LlamaParse expects a local file path, so download from storage first.
        from app.rag_pipeline.infrastructure.firebase.storage_reader import (
            FirebaseStorageReader,
        )

        reader = FirebaseStorageReader()
        content_bytes = reader.read_bytes(command.storage_path)

        suffix = _mime_to_suffix(command.mime_type)
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=True) as tmp:
            tmp.write(content_bytes)
            tmp.flush()
            documents = parser.load_data(tmp.name)

        full_text = "\n\n".join(doc.text for doc in documents if doc.text)
        return ParsedDocument(
            document_id=command.document_id,
            text=full_text,
            metadata={
                "source_file_name": command.source_file_name,
                "mime_type": command.mime_type,
                "title": command.title,
                "page_count": str(len(documents)),
            },
        )


def _mime_to_suffix(mime_type: str) -> str:
    mapping = {
        "application/pdf": ".pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
        "application/msword": ".doc",
        "text/html": ".html",
        "text/plain": ".txt",
        "text/markdown": ".md",
        "image/png": ".png",
        "image/jpeg": ".jpg",
    }
    return mapping.get(mime_type, ".bin")
