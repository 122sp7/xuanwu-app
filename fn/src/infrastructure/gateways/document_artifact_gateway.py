"""Infrastructure implementation of DocumentArtifactGateway."""

from __future__ import annotations

from typing import Any

from infrastructure.persistence.storage.client import (
    download_bytes,
    form_json_path,
    genkit_json_path,
    layout_json_path,
    ocr_json_path,
    parsed_json_path,
    upload_json,
)


class InfraDocumentArtifactGateway:
    def parsed_json_path(self, upload_object_path: str) -> str:
        return parsed_json_path(upload_object_path)

    def layout_json_path(self, upload_object_path: str) -> str:
        return layout_json_path(upload_object_path)

    def form_json_path(self, upload_object_path: str) -> str:
        return form_json_path(upload_object_path)

    def ocr_json_path(self, upload_object_path: str) -> str:
        return ocr_json_path(upload_object_path)

    def genkit_json_path(self, upload_object_path: str) -> str:
        return genkit_json_path(upload_object_path)

    def upload_json(self, *, bucket_name: str, object_path: str, data: dict[str, Any]) -> str:
        return upload_json(bucket_name=bucket_name, object_path=object_path, data=data)

    def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes:
        return download_bytes(bucket_name=bucket_name, object_path=object_path)
