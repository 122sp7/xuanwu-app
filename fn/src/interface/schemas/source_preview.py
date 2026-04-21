"""
Input schema for document_preview_signed_url HTTPS Callable (Rule 4 — Contract / Schema).
"""

from __future__ import annotations

from dataclasses import dataclass

_MIN_EXPIRY_SECONDS = 60
_MAX_EXPIRY_SECONDS = 900


@dataclass
class SourcePreviewSignedUrlRequest:
    """Validated input contract for document_preview_signed_url callable."""

    uid: str
    account_id: str
    workspace_id: str
    gcs_uri: str
    expires_in_seconds: int

    @classmethod
    def from_raw(cls, *, uid: str, raw: dict) -> "SourcePreviewSignedUrlRequest":
        if not uid.strip():
            raise ValueError("請先登入後再取得預覽連結")

        account_id = str(raw.get("account_id", "")).strip()
        if not account_id:
            raise ValueError("account_id 為必填欄位")

        workspace_id = str(raw.get("workspace_id", "")).strip()
        if not workspace_id:
            raise ValueError("workspace_id 為必填欄位")

        gcs_uri = str(raw.get("gcs_uri", "")).strip()
        if not gcs_uri.startswith("gs://"):
            raise ValueError("gcs_uri 為必填欄位（格式：gs://bucket/path）")

        raw_expiry = raw.get("expires_in_seconds", 300)
        try:
            expires_in_seconds = int(raw_expiry)
        except (TypeError, ValueError) as exc:
            raise ValueError("expires_in_seconds 必須是整數秒數") from exc

        if expires_in_seconds < _MIN_EXPIRY_SECONDS or expires_in_seconds > _MAX_EXPIRY_SECONDS:
            raise ValueError(
                f"expires_in_seconds 必須介於 {_MIN_EXPIRY_SECONDS} 到 {_MAX_EXPIRY_SECONDS} 秒"
            )

        return cls(
            uid=uid,
            account_id=account_id,
            workspace_id=workspace_id,
            gcs_uri=gcs_uri,
            expires_in_seconds=expires_in_seconds,
        )
