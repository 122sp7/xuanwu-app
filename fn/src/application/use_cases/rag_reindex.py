"""
RAG reindex application use case.

Downloads the layout JSON artifact from GCS, enriches missing fields,
then re-runs the RAG ingestion pipeline and marks the document ready.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass

from application.services.document_pipeline import get_document_pipeline
from application.use_cases.rag_ingestion import ingest_document_for_rag


def _parse_gs_uri(gs_uri: str) -> tuple[str, str]:
    if not gs_uri.startswith("gs://"):
        raise ValueError("gcs uri must start with gs://")
    path_part = gs_uri.split("gs://", 1)[1]
    if "/" not in path_part:
        raise ValueError("gcs uri must include object path")
    bucket_name, object_path = path_part.split("/", 1)
    return bucket_name, object_path

logger = logging.getLogger(__name__)


@dataclass
class RagReindexCommand:
    """Input contract for the rag-reindex use case."""

    doc_id: str
    json_gcs_uri: str
    account_id: str
    # Optional fields — enriched from the stored JSON artifact when absent.
    source_gcs_uri: str = ""
    workspace_id: str = ""
    filename: str = ""
    page_count: int = 0


@dataclass
class RagReindexResult:
    """Output contract for the rag-reindex use case."""

    doc_id: str
    account_id: str
    chunk_count: int
    vector_count: int
    raw_chars: int
    normalized_chars: int
    normalization_version: str
    language_hint: str


def execute_rag_reindex(cmd: RagReindexCommand) -> RagReindexResult:
    """Download the layout JSON, enrich fields, re-ingest into RAG index.

    Raises:
        ValueError: when required fields are absent from both cmd and the stored JSON.
        Exception:  propagated from GCS / embedding / vector calls.
    """
    runtime = get_document_pipeline()

    bucket_name, object_path = _parse_gs_uri(cmd.json_gcs_uri)
    json_bytes = runtime.download_bytes(bucket_name=bucket_name, object_path=object_path)
    payload: dict = json.loads(json_bytes.decode("utf-8")) if json_bytes else {}

    text = str(payload.get("text", "")).strip()
    if not text:
        raise ValueError("layout JSON 缺少 text 欄位，請先執行「解析文件(Layout Parser)」")

    source_gcs_uri = cmd.source_gcs_uri or str(payload.get("source_gcs_uri", "")).strip()

    workspace_id = cmd.workspace_id
    if not workspace_id:
        workspace_id = str(payload.get("workspace_id", "")).strip()
    if not workspace_id:
        workspace_id = str((payload.get("metadata") or {}).get("space_id", "")).strip()
    if not workspace_id:
        raise ValueError("workspace_id 為必填欄位")

    filename = cmd.filename
    if not filename or filename == cmd.doc_id:
        filename = (
            str(payload.get("filename", "")).strip()
            or str(payload.get("display_name", "")).strip()
            or str(payload.get("original_filename", "")).strip()
            or cmd.doc_id
        )

    page_count = cmd.page_count
    if page_count <= 0:
        page_count = int(payload.get("page_count", 0) or 0)

    layout_chunks: list[dict] | None = payload.get("chunks") or None

    rag = ingest_document_for_rag(
        doc_id=cmd.doc_id,
        filename=filename,
        source_gcs_uri=source_gcs_uri,
        json_gcs_uri=cmd.json_gcs_uri,
        text=text,
        page_count=page_count,
        account_id=cmd.account_id,
        workspace_id=workspace_id,
        layout_chunks=layout_chunks,
    )

    runtime.mark_rag_ready(
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

    return RagReindexResult(
        doc_id=cmd.doc_id,
        account_id=cmd.account_id,
        chunk_count=rag.chunk_count,
        vector_count=rag.vector_count,
        raw_chars=rag.raw_chars,
        normalized_chars=rag.normalized_chars,
        normalization_version=rag.normalization_version,
        language_hint=rag.language_hint,
    )
