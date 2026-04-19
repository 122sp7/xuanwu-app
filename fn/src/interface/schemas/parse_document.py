"""
Input schema for parse_document HTTPS Callable (Rule 4 — Contract / Schema).

All data entering the system through this function must pass through this
schema before being forwarded to the application layer.  Validation raises
ValueError so that the handler can convert it to a typed HttpsError.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field

_MIME_MAP: dict[str, str] = {
    ".pdf": "application/pdf",
    ".tiff": "image/tiff",
    ".tif": "image/tiff",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
}

_ALLOWED_MIMES: frozenset[str] = frozenset(_MIME_MAP.values())


@dataclass
class ParseDocumentRequest:
    """Validated input contract for the parse_document callable."""

    account_id: str
    workspace_id: str
    gcs_uri: str
    doc_id: str
    filename: str
    mime_type: str
    size_bytes: int
    run_rag: bool

    @classmethod
    def from_raw(cls, raw: dict) -> "ParseDocumentRequest":
        """Parse and validate raw request data.

        Raises:
            ValueError: if any required field is missing or invalid.
        """
        account_id = str(raw.get("account_id", "")).strip()
        if not account_id:
            raise ValueError("account_id 為必填欄位")

        workspace_id = str(raw.get("workspace_id", "")).strip()
        if not workspace_id:
            raise ValueError("workspace_id 為必填欄位")

        gcs_uri = str(raw.get("gcs_uri", "")).strip()
        if not gcs_uri or not gcs_uri.startswith("gs://"):
            raise ValueError("gcs_uri 為必填欄位（格式：gs://bucket/path）")

        # Derive doc_id and filename from URI when not provided explicitly.
        path_part = gcs_uri.split("gs://", 1)[1]
        storage_filename = os.path.basename(path_part)
        default_doc_id, ext = os.path.splitext(storage_filename)

        doc_id = str(raw.get("doc_id", "")).strip() or default_doc_id
        filename = (
            str(raw.get("filename", "")).strip()
            or str(raw.get("original_filename", "")).strip()
            or str(raw.get("display_name", "")).strip()
            or storage_filename
        )

        mime_type = str(raw.get("mime_type", "")).strip()
        if not mime_type:
            resolved = _MIME_MAP.get(ext.lower())
            if resolved is None:
                raise ValueError(
                    f"無法判斷 MIME 類型，請手動指定（副檔名：{ext}）"
                )
            mime_type = resolved
        elif mime_type not in _ALLOWED_MIMES:
            raise ValueError(f"不支援的 MIME 類型：{mime_type}")

        try:
            size_bytes = int(raw.get("size_bytes", 0) or 0)
        except (TypeError, ValueError):
            size_bytes = 0

        run_rag = bool(raw.get("run_rag", True))

        return cls(
            account_id=account_id,
            workspace_id=workspace_id,
            gcs_uri=gcs_uri,
            doc_id=doc_id,
            filename=filename,
            mime_type=mime_type,
            size_bytes=size_bytes,
            run_rag=run_rag,
        )
