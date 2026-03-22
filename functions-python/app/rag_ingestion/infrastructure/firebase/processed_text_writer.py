"""Writes processed (extracted) text and structured Document AI JSON back to Firebase
Storage, and updates the Firestore document record with indexedAtISO, chunkCount,
and storage paths.

Storage path conventions:
    organizations/{organizationId}/workspaces/{workspaceId}/extracted/{documentId}.txt
    organizations/{organizationId}/workspaces/{workspaceId}/extracted/{documentId}.json

The .txt file is a plain-text archive of the extracted content.
The .json file contains the full Document AI structured response (pages, entities,
tables, etc.) used for knowledge modeling.
"""
import logging
import os
from datetime import datetime, timezone

from firebase_admin import firestore
from google.cloud import storage

logger = logging.getLogger(__name__)


def _resolve_storage_bucket() -> str:
    bucket_name = (
        os.getenv("FIREBASE_STORAGE_BUCKET")
        or os.getenv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET")
        or os.getenv("GCLOUD_STORAGE_BUCKET")
    )
    if bucket_name:
        return bucket_name.removeprefix("gs://")

    project_id = os.getenv("GOOGLE_CLOUD_PROJECT") or os.getenv("GCLOUD_PROJECT")
    if project_id:
        return f"{project_id}.firebasestorage.app"

    raise ValueError("Missing Firebase Storage bucket configuration.")


class ProcessedTextWriter:
    """Persists extracted text and structured JSON to Storage and writes back
    indexedAtISO / chunkCount to Firestore."""

    def __init__(self, bucket_name: str | None = None) -> None:
        self._bucket_name = (bucket_name or _resolve_storage_bucket()).removeprefix("gs://")
        self._storage_client = storage.Client()
        self._db = firestore.client()

    def write(
        self,
        *,
        document_id: str,
        organization_id: str,
        workspace_id: str,
        extracted_text: str,
        chunk_count: int,
        taxonomy: str,
        structured_json: str | None = None,
    ) -> str:
        """Save extracted text (and optional structured JSON) to Storage and patch
        the Firestore document.

        Returns the Storage path of the saved text file.
        """
        base_path = (
            f"organizations/{organization_id}/workspaces/{workspace_id}"
            f"/extracted/{document_id}"
        )
        txt_path = f"{base_path}.txt"
        json_path = f"{base_path}.json"

        bucket = self._storage_client.bucket(self._bucket_name)
        blob_metadata = {
            "documentId": document_id,
            "organizationId": organization_id,
            "workspaceId": workspace_id,
            "taxonomy": taxonomy,
        }

        # ── 1. Write extracted text (.txt) to Storage ────────────────────────────────
        try:
            txt_blob = bucket.blob(txt_path)
            txt_blob.upload_from_string(
                extracted_text.encode("utf-8"),
                content_type="text/plain; charset=utf-8",
            )
            txt_blob.metadata = blob_metadata
            txt_blob.patch()
        except Exception as error:
            raise RuntimeError(
                f"Failed to write extracted text for document {document_id} to Storage"
            ) from error

        # ── 2. Write structured JSON (.json) to Storage (when available) ─────────────
        if structured_json:
            try:
                json_blob = bucket.blob(json_path)
                json_blob.upload_from_string(
                    structured_json.encode("utf-8"),
                    content_type="application/json; charset=utf-8",
                )
                json_blob.metadata = blob_metadata
                json_blob.patch()
            except Exception as error:
                # JSON write failure is non-fatal — log and continue.
                logger.warning(
                    "Failed to write structured JSON for document %s: %s",
                    document_id,
                    error,
                )

        # ── 3. Update Firestore document record ─────────────────────────────────────
        now = datetime.now(timezone.utc)
        firestore_update: dict = {
            "indexedAtISO": now.isoformat(),
            "chunkCount": chunk_count,
            "extractedTextStoragePath": txt_path,
            "updatedAt": now,
            "updatedAtISO": now.isoformat(),
        }
        if structured_json:
            firestore_update["extractedJsonStoragePath"] = json_path

        (
            self._db.collection("knowledge_base")
            .document(organization_id)
            .collection("workspaces")
            .document(workspace_id)
            .collection("documents")
            .document(document_id)
            .set(firestore_update, merge=True)
        )

        return txt_path
