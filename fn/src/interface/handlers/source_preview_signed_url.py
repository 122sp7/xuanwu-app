"""
HTTPS Callable — handle_document_preview_signed_url.

Generates a short-lived signed URL for private source preview through Google Viewer.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from firebase_functions import https_fn
import firebase_admin.storage as fb_storage

from interface.handlers._https_helpers import (
    _assert_account_access,
    _assert_workspace_belongs_account,
    _extract_auth_uid,
    _parse_gs_uri,
)
from interface.schemas.source_preview import SourcePreviewSignedUrlRequest


def handle_document_preview_signed_url(req: https_fn.CallableRequest) -> dict:
    uid = _extract_auth_uid(req)

    try:
        schema = SourcePreviewSignedUrlRequest.from_raw(uid=uid, raw=req.data or {})
    except ValueError as exc:
        code = (
            https_fn.FunctionsErrorCode.UNAUTHENTICATED
            if "登入" in str(exc)
            else https_fn.FunctionsErrorCode.INVALID_ARGUMENT
        )
        raise https_fn.HttpsError(code, str(exc)) from exc

    _assert_account_access(schema.uid, schema.account_id)
    _assert_workspace_belongs_account(schema.account_id, schema.workspace_id)

    bucket_name, object_path = _parse_gs_uri(schema.gcs_uri)
    expected_prefix = f"uploads/{schema.account_id}/{schema.workspace_id}/"
    if not object_path.startswith(expected_prefix):
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.PERMISSION_DENIED,
            "gcs_uri 不屬於目前 account/workspace 範圍",
        )

    expires_at = datetime.now(timezone.utc) + timedelta(seconds=schema.expires_in_seconds)
    blob = fb_storage.bucket(bucket_name).blob(object_path)

    if not blob.exists():
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.NOT_FOUND,
            "找不到來源檔案",
        )

    signed_url = blob.generate_signed_url(
        version="v4",
        method="GET",
        expiration=expires_at,
    )

    return {
        "preview_url": signed_url,
        "expires_at_iso": expires_at.isoformat(),
    }
