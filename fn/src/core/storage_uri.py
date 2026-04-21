from __future__ import annotations


def parse_gs_uri(gs_uri: str) -> tuple[str, str]:
    if not gs_uri.startswith("gs://"):
        raise ValueError("gcs uri must start with gs://")
    path_part = gs_uri.split("gs://", 1)[1]
    if "/" not in path_part:
        raise ValueError("gcs uri must include object path")
    bucket_name, object_path = path_part.split("/", 1)
    return bucket_name, object_path
