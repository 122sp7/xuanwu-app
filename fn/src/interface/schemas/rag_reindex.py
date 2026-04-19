"""
Input schema for rag_reindex_document HTTPS Callable (Rule 4 — Contract / Schema).

All data entering the system through this function must pass through this
schema before being forwarded to the application layer.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class RagReindexRequest:
    """Validated input contract for the rag_reindex_document callable."""

    account_id: str
    doc_id: str
    json_gcs_uri: str
    source_gcs_uri: str
    workspace_id: str
    filename: str
    page_count: int

    @classmethod
    def from_raw(cls, raw: dict) -> "RagReindexRequest":
        """Parse and validate raw request data.

        Raises:
            ValueError: if any required field is missing or invalid.
        """
        account_id = str(raw.get("account_id", "")).strip()
        if not account_id:
            raise ValueError("account_id 為必填欄位")

        doc_id = str(raw.get("doc_id", "")).strip()
        if not doc_id:
            raise ValueError("doc_id 為必填欄位")

        json_gcs_uri = str(raw.get("json_gcs_uri", "")).strip()
        if not json_gcs_uri:
            raise ValueError("json_gcs_uri 為必填欄位")

        source_gcs_uri = str(raw.get("source_gcs_uri", "")).strip()
        workspace_id = str(raw.get("workspace_id", "")).strip()

        filename = (
            str(raw.get("filename", "")).strip()
            or str(raw.get("display_name", "")).strip()
            or str(raw.get("original_filename", "")).strip()
            or doc_id
        )

        try:
            page_count = int(raw.get("page_count", 0) or 0)
        except (TypeError, ValueError):
            page_count = 0

        return cls(
            account_id=account_id,
            doc_id=doc_id,
            json_gcs_uri=json_gcs_uri,
            source_gcs_uri=source_gcs_uri,
            workspace_id=workspace_id,
            filename=filename,
            page_count=page_count,
        )
