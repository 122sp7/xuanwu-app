"""Writes processed (extracted) text back to Firebase Storage and updates the
Firestore document record with indexedAtISO, chunkCount, and statusMessage.

Storage path convention:
    organizations/{organizationId}/workspaces/{workspaceId}/extracted/{documentId}.txt

This mirrors the raw-file path pattern under:
    organizations/{organizationId}/workspaces/{workspaceId}/files/...
"""
import os
from datetime import datetime, timezone

from firebase_admin import firestore
from google.cloud import storage


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
    """Persists extracted text to Storage and writes back indexedAtISO / chunkCount to Firestore."""

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
    ) -> str:
        """Save extracted text to Storage and patch the Firestore document.

        Returns the Storage path of the saved text file.
        """
        storage_path = (
            f"organizations/{organization_id}/workspaces/{workspace_id}"
            f"/extracted/{document_id}.txt"
        )

        # ── 1. Write extracted text to Storage ──────────────────────────────────────
        try:
            blob = self._storage_client.bucket(self._bucket_name).blob(storage_path)
            blob.upload_from_string(
                extracted_text.encode("utf-8"),
                content_type="text/plain; charset=utf-8",
            )
            blob.metadata = {
                "documentId": document_id,
                "organizationId": organization_id,
                "workspaceId": workspace_id,
                "taxonomy": taxonomy,
            }
            blob.patch()
        except Exception as error:
            raise RuntimeError(
                f"Failed to write extracted text for document {document_id} to Storage"
            ) from error

        # ── 2. Update Firestore document record ─────────────────────────────────────
        now = datetime.now(timezone.utc)
        (
            self._db.collection("knowledge_base")
            .document(organization_id)
            .collection("workspaces")
            .document(workspace_id)
            .collection("documents")
            .document(document_id)
            .set(
                {
                    "indexedAtISO": now.isoformat(),
                    "chunkCount": chunk_count,
                    "extractedTextStoragePath": storage_path,
                    "updatedAt": now,
                    "updatedAtISO": now.isoformat(),
                },
                merge=True,
            )
        )

        return storage_path
