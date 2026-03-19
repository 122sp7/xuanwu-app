import os

from google.cloud import storage


def _resolve_storage_bucket() -> str:
    # Runtime-preferred order: dedicated worker env, shared public config fallback, then
    # an explicit GCS override for local/admin execution paths.
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


class FirebaseStorageReader:
    """Read raw bytes or decoded text from Firebase Storage blobs."""

    def __init__(self, bucket_name: str | None = None) -> None:
        self._bucket_name = (bucket_name or _resolve_storage_bucket()).removeprefix("gs://")
        self._client = storage.Client()

    def _download(self, storage_path: str) -> bytes:
        normalized = storage_path.lstrip("/")
        try:
            return (
                self._client.bucket(self._bucket_name)
                .blob(normalized)
                .download_as_bytes()
            )
        except Exception as error:
            raise RuntimeError(
                f"Failed to read {self._bucket_name}/{normalized} from Firebase Storage"
            ) from error

    def read_bytes(self, storage_path: str) -> bytes:
        """Download the blob as raw bytes (suitable for binary formats like PDF)."""
        return self._download(storage_path)

    def read_text(self, storage_path: str) -> str:
        """Download the blob and decode as UTF-8 text (suitable for plain-text uploads)."""
        return self._download(storage_path).decode("utf-8", errors="replace").strip()


# Backward-compatible alias for existing callsites that instantiate FirebaseStorageTextReader.
FirebaseStorageTextReader = FirebaseStorageReader
