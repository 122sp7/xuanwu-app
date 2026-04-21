"""
Unit tests for handle_document_preview_signed_url.

Verifies that the handler:
  1. Delegates URL signing to IAM Credentials API via _get_signing_credentials()
     (service_account_email + access_token), NOT bare RSA key signing.
  2. Raises PERMISSION_DENIED for path traversal or out-of-scope GCS paths.
  3. Raises NOT_FOUND when the blob does not exist.
"""

from __future__ import annotations

from datetime import datetime, timezone
from unittest.mock import MagicMock, patch

import pytest

from interface.handlers.source_preview_signed_url import (
    _get_signing_credentials,
    handle_document_preview_signed_url,
)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _make_req(
    *,
    uid: str = "user-1",
    account_id: str = "acct-1",
    workspace_id: str = "ws-1",
    gcs_uri: str = "gs://xuanwu-i-00708880-4e2d8.firebasestorage.app/uploads/acct-1/ws-1/doc.pdf",
    expires_in_seconds: int = 300,
) -> MagicMock:
    req = MagicMock()
    req.auth = MagicMock()
    req.auth.uid = uid
    req.data = {
        "account_id": account_id,
        "workspace_id": workspace_id,
        "gcs_uri": gcs_uri,
        "expires_in_seconds": expires_in_seconds,
    }
    return req


# ── _get_signing_credentials ──────────────────────────────────────────────────

class TestGetSigningCredentials:
    def test_returnsServiceAccountEmailAndToken(self) -> None:
        """Verify ADC refresh is called and email/token are returned."""
        mock_creds = MagicMock()
        mock_creds.service_account_email = "fn@project.iam.gserviceaccount.com"
        mock_creds.token = "mock-access-token"

        with (
            patch("interface.handlers.source_preview_signed_url.google.auth.default", return_value=(mock_creds, "project-id")) as mock_default,
            patch("interface.handlers.source_preview_signed_url.google.auth.transport.requests.Request") as mock_request_cls,
        ):
            sa_email, token = _get_signing_credentials()

        mock_default.assert_called_once_with(
            scopes=["https://www.googleapis.com/auth/cloud-platform"]
        )
        mock_creds.refresh.assert_called_once_with(mock_request_cls.return_value)
        assert sa_email == "fn@project.iam.gserviceaccount.com"
        assert token == "mock-access-token"


# ── handle_document_preview_signed_url ───────────────────────────────────────

def _patch_handler(*, blob_exists: bool = True, signed_url: str = "https://signed.url/file.pdf"):
    """Return a context-manager stack that stubs all external calls."""
    import contextlib

    @contextlib.contextmanager
    def _ctx():
        mock_blob = MagicMock()
        mock_blob.exists.return_value = blob_exists
        mock_blob.generate_signed_url.return_value = signed_url

        mock_bucket = MagicMock()
        mock_bucket.blob.return_value = mock_blob

        with (
            patch(
                "interface.handlers.source_preview_signed_url._assert_account_access"
            ),
            patch(
                "interface.handlers.source_preview_signed_url._assert_workspace_belongs_account"
            ),
            patch(
                "interface.handlers.source_preview_signed_url.fb_storage.bucket",
                return_value=mock_bucket,
            ),
            patch(
                "interface.handlers.source_preview_signed_url._get_signing_credentials",
                return_value=("sa@project.iam.gserviceaccount.com", "tok-abc"),
            ),
        ):
            yield mock_blob

    return _ctx()


class TestHandleDocumentPreviewSignedUrl:
    def test_happyPath_UsesIamCredentialsForSigning(self) -> None:
        """generate_signed_url must receive service_account_email and access_token."""
        req = _make_req()

        with _patch_handler(signed_url="https://storage.googleapis.com/signed") as mock_blob:
            result = handle_document_preview_signed_url(req)

        call_kwargs = mock_blob.generate_signed_url.call_args.kwargs
        assert call_kwargs.get("service_account_email") == "sa@project.iam.gserviceaccount.com"
        assert call_kwargs.get("access_token") == "tok-abc"
        assert call_kwargs.get("version") == "v4"
        assert call_kwargs.get("method") == "GET"
        assert result["preview_url"] == "https://storage.googleapis.com/signed"
        assert "expires_at_iso" in result

    def test_pathTraversal_RaisesPermissionDenied(self) -> None:
        from firebase_functions import https_fn

        req = _make_req(
            gcs_uri="gs://bucket/uploads/acct-1/ws-1/../../../etc/passwd"
        )
        with (
            patch("interface.handlers.source_preview_signed_url._assert_account_access"),
            patch("interface.handlers.source_preview_signed_url._assert_workspace_belongs_account"),
            pytest.raises(https_fn.HttpsError) as exc_info,
        ):
            handle_document_preview_signed_url(req)

        assert exc_info.value.code == https_fn.FunctionsErrorCode.PERMISSION_DENIED

    def test_pathTraversalDotSegments_RaisesPermissionDenied(self) -> None:
        from firebase_functions import https_fn

        req = _make_req(
            gcs_uri="gs://bucket/uploads/acct-1/../acct-1/ws-1/file.pdf"
        )
        with (
            patch("interface.handlers.source_preview_signed_url._assert_account_access"),
            patch("interface.handlers.source_preview_signed_url._assert_workspace_belongs_account"),
            pytest.raises(https_fn.HttpsError) as exc_info,
        ):
            handle_document_preview_signed_url(req)

        assert exc_info.value.code == https_fn.FunctionsErrorCode.PERMISSION_DENIED

    def test_outOfScopePath_RaisesPermissionDenied(self) -> None:
        from firebase_functions import https_fn

        req = _make_req(
            gcs_uri="gs://bucket/uploads/other-account/ws-1/file.pdf"
        )
        with (
            patch("interface.handlers.source_preview_signed_url._assert_account_access"),
            patch("interface.handlers.source_preview_signed_url._assert_workspace_belongs_account"),
            pytest.raises(https_fn.HttpsError) as exc_info,
        ):
            handle_document_preview_signed_url(req)

        assert exc_info.value.code == https_fn.FunctionsErrorCode.PERMISSION_DENIED

    def test_blobNotFound_RaisesNotFound(self) -> None:
        from firebase_functions import https_fn

        req = _make_req()
        with (
            _patch_handler(blob_exists=False),
            pytest.raises(https_fn.HttpsError) as exc_info,
        ):
            handle_document_preview_signed_url(req)

        assert exc_info.value.code == https_fn.FunctionsErrorCode.NOT_FOUND

    def test_unauthenticated_RaisesUnauthenticated(self) -> None:
        from firebase_functions import https_fn

        req = _make_req(uid="")
        with pytest.raises(https_fn.HttpsError) as exc_info:
            handle_document_preview_signed_url(req)

        assert exc_info.value.code == https_fn.FunctionsErrorCode.UNAUTHENTICATED
