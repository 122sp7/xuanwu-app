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


class FirebaseStorageTextReader:
    def __init__(self, bucket_name: str | None = None) -> None:
        self._bucket_name = (bucket_name or _resolve_storage_bucket()).removeprefix("gs://")
        self._client = storage.Client()

    def read_text(self, storage_path: str) -> str:
        normalized_storage_path = storage_path.lstrip("/")
        try:
            raw_bytes = (
                self._client.bucket(self._bucket_name)
                .blob(normalized_storage_path)
                .download_as_bytes()
            )
        except Exception as error:
            raise RuntimeError(
                "Failed to read uploaded source text from "
                f"{self._bucket_name}/{normalized_storage_path}"
            ) from error

        return raw_bytes.decode("utf-8", errors="replace").strip()
