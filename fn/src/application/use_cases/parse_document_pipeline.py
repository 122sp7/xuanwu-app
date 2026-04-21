"""
Parse-document application use case.

Orchestrates the full parse pipeline for a single document:
    init Firestore → Document AI parse → write JSON artifact to GCS
    → update Firestore state → (optionally) ingest into RAG index.

Both the HTTPS Callable handler and the Storage trigger handler
delegate to this use case, keeping interface-layer files thin.
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass
from typing import Callable

from application.services.document_pipeline import (
    get_document_artifact_gateway,
    get_document_parser,
    get_document_status_gateway,
)
from application.use_cases.rag_ingestion import ingest_document_for_rag
from domain.repositories import (
    DocumentArtifactGateway,
    DocumentParserGateway,
    DocumentStatusGateway,
)

logger = logging.getLogger(__name__)


@dataclass
class ParseDocumentCommand:
    """Input contract for the parse-document use case."""

    doc_id: str
    gcs_uri: str
    bucket_name: str
    object_path: str
    filename: str
    size_bytes: int
    mime_type: str
    account_id: str
    workspace_id: str
    parser: str = "layout"   # "layout" | "ocr" | "form" | "genkit"
    run_rag: bool = True


@dataclass
class ParseDocumentResult:
    """Output contract for the parse-document use case."""

    doc_id: str
    parser: str
    page_count: int
    extraction_ms: int
    json_gcs_uri: str
    rag_chunk_count: int | None = None
    rag_vector_count: int | None = None


def execute_parse_document(
    cmd: ParseDocumentCommand,
    *,
    parser_gateway: DocumentParserGateway | None = None,
    artifact_gateway: DocumentArtifactGateway | None = None,
    status_gateway: DocumentStatusGateway | None = None,
    ingest_for_rag: Callable[..., object] = ingest_document_for_rag,
) -> ParseDocumentResult:
    """Orchestrate the full parse pipeline for a single document.

    Raises:
        Exception: propagated from DocumentAI / GCS / Firestore calls;
                   callers are responsible for error recording.
    """
    parser_gateway = parser_gateway or get_document_parser()
    artifact_gateway = artifact_gateway or get_document_artifact_gateway()
    status_gateway = status_gateway or get_document_status_gateway()

    status_gateway.init_document(
        doc_id=cmd.doc_id,
        gcs_uri=cmd.gcs_uri,
        filename=cmd.filename,
        size_bytes=cmd.size_bytes,
        mime_type=cmd.mime_type,
        account_id=cmd.account_id,
        workspace_id=cmd.workspace_id,
    )

    start_time = time.time()
    parsed = parser_gateway.process_document_gcs(
        gcs_uri=cmd.gcs_uri,
        mime_type=cmd.mime_type,
        parser=cmd.parser,
    )
    extraction_ms = int((time.time() - start_time) * 1000)

    json_gcs_uri = _write_artifact_and_update_state(
        cmd=cmd,
        parsed=parsed,
        extraction_ms=extraction_ms,
        artifact_gateway=artifact_gateway,
        status_gateway=status_gateway,
    )

    rag_chunk_count: int | None = None
    rag_vector_count: int | None = None
    if cmd.run_rag and cmd.parser in ("layout", "ocr"):
        layout_chunks = parsed.chunks if cmd.parser == "layout" else None
        try:
            rag = ingest_for_rag(
                doc_id=cmd.doc_id,
                filename=cmd.filename,
                source_gcs_uri=cmd.gcs_uri,
                json_gcs_uri=json_gcs_uri,
                text=parsed.text,
                page_count=parsed.page_count,
                account_id=cmd.account_id,
                workspace_id=cmd.workspace_id,
                layout_chunks=layout_chunks or None,
            )
            status_gateway.mark_rag_ready(
                doc_id=cmd.doc_id,
                chunk_count=rag.chunk_count,
                vector_count=rag.vector_count,
                embedding_model=rag.embedding_model,
                embedding_dimensions=rag.embedding_dimensions,
                raw_chars=rag.raw_chars,
                normalized_chars=rag.normalized_chars,
                normalization_version=rag.normalization_version,
                language_hint=rag.language_hint,
                account_id=cmd.account_id,
            )
            rag_chunk_count = rag.chunk_count
            rag_vector_count = rag.vector_count
        except Exception as rag_exc:
            logger.exception("RAG ingestion failed for %s: %s", cmd.doc_id, rag_exc)
            status_gateway.record_rag_error(
                cmd.doc_id, str(rag_exc)[:200], account_id=cmd.account_id
            )

    logger.info(
        "✓ parse_document done: doc_id=%s parser=%s (%d pages, %d ms) → %s",
        cmd.doc_id,
        cmd.parser,
        parsed.page_count,
        extraction_ms,
        json_gcs_uri,
    )
    return ParseDocumentResult(
        doc_id=cmd.doc_id,
        parser=cmd.parser,
        page_count=parsed.page_count,
        extraction_ms=extraction_ms,
        json_gcs_uri=json_gcs_uri,
        rag_chunk_count=rag_chunk_count,
        rag_vector_count=rag_vector_count,
    )


def _write_artifact_and_update_state(
    *,
    cmd: ParseDocumentCommand,
    parsed: object,
    extraction_ms: int,
    artifact_gateway: DocumentArtifactGateway,
    status_gateway: DocumentStatusGateway,
) -> str:
    """Write the JSON artifact to GCS and update the Firestore state field.

    Returns the GCS URI of the written artifact.
    """
    base = {
        "doc_id": cmd.doc_id,
        "account_id": cmd.account_id,
        "workspace_id": cmd.workspace_id,
        "source_gcs_uri": cmd.gcs_uri,
        "filename": cmd.filename,
        "display_name": cmd.filename,
        "original_filename": cmd.filename,
        "page_count": parsed.page_count,
        "extraction_ms": extraction_ms,
    }

    if cmd.parser == "layout":
        json_path = artifact_gateway.layout_json_path(cmd.object_path)
        data = {**base, "text": parsed.text, "chunk_count": len(parsed.chunks), "chunks": parsed.chunks}
        json_gcs_uri = artifact_gateway.upload_json(
            bucket_name=cmd.bucket_name, object_path=json_path, data=data
        )
        status_gateway.update_parsed_layout(
            doc_id=cmd.doc_id,
            layout_json_gcs_uri=json_gcs_uri,
            page_count=parsed.page_count,
            extraction_ms=extraction_ms,
            account_id=cmd.account_id,
            chunk_count=len(parsed.chunks),
        )
        return json_gcs_uri

    if cmd.parser == "ocr":
        json_path = artifact_gateway.ocr_json_path(cmd.object_path)
        data = {
            **base,
            "text": parsed.text,
            "chunk_count": 0,
            "chunks": [],
        }
        json_gcs_uri = artifact_gateway.upload_json(
            bucket_name=cmd.bucket_name, object_path=json_path, data=data
        )
        status_gateway.update_parsed_ocr(
            doc_id=cmd.doc_id,
            ocr_json_gcs_uri=json_gcs_uri,
            page_count=parsed.page_count,
            account_id=cmd.account_id,
            extraction_ms=extraction_ms,
        )
        return json_gcs_uri

    if cmd.parser == "form":
        json_path = artifact_gateway.form_json_path(cmd.object_path)
        data = {
            **base,
            "entities": parsed.entities,
            "entity_count": len(parsed.entities),
        }
        json_gcs_uri = artifact_gateway.upload_json(
            bucket_name=cmd.bucket_name, object_path=json_path, data=data
        )
        status_gateway.update_parsed_form(
            doc_id=cmd.doc_id,
            form_json_gcs_uri=json_gcs_uri,
            account_id=cmd.account_id,
            extraction_ms=extraction_ms,
            entity_count=len(parsed.entities),
        )
        return json_gcs_uri

    # "genkit"
    json_path = artifact_gateway.genkit_json_path(cmd.object_path)
    data = {
        **base,
        "mode": "genkit-ai",
        "text": parsed.text,
        "chunk_count": len(parsed.chunks),
        "chunks": parsed.chunks,
    }
    json_gcs_uri = artifact_gateway.upload_json(
        bucket_name=cmd.bucket_name, object_path=json_path, data=data
    )
    status_gateway.update_parsed_genkit(
        doc_id=cmd.doc_id,
        genkit_json_gcs_uri=json_gcs_uri,
        account_id=cmd.account_id,
        extraction_ms=extraction_ms,
    )
    return json_gcs_uri
