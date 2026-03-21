"""Read binary content from Firebase Storage."""

from __future__ import annotations

import os

from google.cloud import storage


class FirebaseStorageReader:
    """Download file bytes from a Firebase/GCS storage path."""

    def __init__(self) -> None:
        bucket_name = (
            os.getenv("FIREBASE_STORAGE_BUCKET")
            or os.getenv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET")
            or os.getenv("GCLOUD_STORAGE_BUCKET")
        )
        if not bucket_name:
            project_id = os.getenv("GOOGLE_CLOUD_PROJECT") or os.getenv("GCLOUD_PROJECT")
            if project_id:
                bucket_name = f"{project_id}.firebasestorage.app"
            else:
                raise ValueError(
                    "Missing Firebase Storage bucket configuration. "
                    "Set one of: FIREBASE_STORAGE_BUCKET, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, "
                    "GCLOUD_STORAGE_BUCKET, or GOOGLE_CLOUD_PROJECT/GCLOUD_PROJECT."
                )
        self._bucket_name = bucket_name.removeprefix("gs://")
        self._client = storage.Client()

    def read_bytes(self, storage_path: str) -> bytes:
        blob = self._client.bucket(self._bucket_name).blob(storage_path)
        return blob.download_as_bytes()
