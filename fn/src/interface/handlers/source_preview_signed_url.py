"""
HTTPS Callable — handle_document_preview_signed_url.

Generates a short-lived signed URL for private source preview through Google Viewer.

Implementation note — IAM-based signing:
  Cloud Functions runs under Compute Engine (Application Default) credentials,
  which cannot sign bytes locally.  To generate a v4 signed URL we must pass
  ``service_account_email`` + ``access_token`` so the google-cloud-storage
  library delegates signing to the IAM Credentials API instead.
  See: https://cloud.google.com/storage/docs/access-control/signed-urls
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from pathlib import PurePosixPath

import google.auth
import google.auth.transport.requests
from firebase_functions import https_fn
import firebase_admin.storage as fb_storage

from interface.handlers._https_helpers import (
    _assert_account_access,
    _assert_workspace_belongs_account,
    _extract_auth_uid,
    _parse_gs_uri,
)
from interface.schemas.source_preview import SourcePreviewSignedUrlRequest


def _get_signing_credentials() -> tuple[str, str]:
    """Return (service_account_email, access_token) from ADC.

    On Cloud Functions the runtime credentials are Compute Engine credentials.
    Refreshing them fetches ``service_account_email`` from the metadata server
    and a short-lived ``token`` that the GCS library uses to call the IAM
    signBlob API — no private-key file required.
    """
    credentials, _ = google.auth.default(
        # cloud-platform scope is required by the IAM signBlob API.
        # Narrower GCS scopes (devstorage.*) are insufficient for blob signing.
        scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    auth_request = google.auth.transport.requests.Request()
    credentials.refresh(auth_request)
    return credentials.service_account_email, credentials.token


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

    # Guard against path traversal: normalise the path with PurePosixPath and
    # confirm none of the resulting parts are "..".  This catches both literal
    # ".." segments and sequences that collapse to a parent reference after
    # normalisation (e.g. "uploads/foo/../../../etc/passwd").
    normalized_path = str(PurePosixPath(object_path))
    if ".." in PurePosixPath(normalized_path).parts:
        raise https_fn.HttpsError(
            https_fn.FunctionsErrorCode.PERMISSION_DENIED,
            "非法路徑",
        )

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

    # Delegate signing to IAM Credentials API — required on Cloud Functions
    # because runtime credentials cannot sign bytes locally.
    sa_email, access_token = _get_signing_credentials()

    signed_url = blob.generate_signed_url(
        version="v4",
        method="GET",
        expiration=expires_at,
        service_account_email=sa_email,
        access_token=access_token,
    )

    return {
        "preview_url": signed_url,
        "expires_at_iso": expires_at.isoformat(),
    }
