from __future__ import annotations

from typing import Any, Protocol


class RagQueryGateway(Protocol):
    def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str: ...

    def get_query_cache(self, cache_key: str) -> dict[str, Any] | None: ...

    def save_query_cache(self, cache_key: str, payload: dict[str, Any]) -> None: ...

    def to_query_vector(self, query: str) -> list[float]: ...

    def query_vector(self, vector: list[float], top_k: int) -> list[dict[str, Any]]: ...

    def query_search(self, query: str, top_k: int) -> list[dict[str, Any]]: ...

    def generate_answer(self, *, query: str, context_block: str) -> str: ...

    def publish_query_audit(
        self,
        *,
        query: str,
        top_k: int,
        citation_count: int,
        vector_hits: int,
        search_hits: int,
    ) -> None: ...


class RagIngestionGateway(Protocol):
    def embed_texts(self, texts: list[str], model: str) -> list[list[float]]: ...

    def upsert_vectors(self, items: list[dict[str, Any]], namespace: str = "") -> Any: ...

    def upsert_search_documents(self, documents: list[dict[str, Any]]) -> int: ...

    def redis_set_json(self, key: str, value: dict[str, Any], ttl_seconds: int = 0) -> None: ...

    def delete_vectors_by_doc(self, doc_id: str, namespace: str = "") -> int: ...


class DocumentParserGateway(Protocol):
    def process_document_gcs(self, gcs_uri: str, mime_type: str = "application/pdf", parser: str = "layout") -> Any: ...


class DocumentRateLimitGateway(Protocol):
    def redis_fixed_window_allow(
        self,
        key: str,
        max_requests: int,
        window_seconds: int,
    ) -> tuple[bool, int]: ...


class DocumentStatusGateway(Protocol):
    def init_document(
        self,
        *,
        doc_id: str,
        gcs_uri: str,
        filename: str,
        size_bytes: int,
        mime_type: str,
        account_id: str,
        workspace_id: str,
    ) -> None: ...

    def update_parsed(
        self,
        *,
        doc_id: str,
        json_gcs_uri: str,
        page_count: int,
        extraction_ms: int,
        account_id: str,
        chunk_count: int = 0,
        entity_count: int = 0,
    ) -> None: ...

    def update_parsed_layout(
        self,
        *,
        doc_id: str,
        layout_json_gcs_uri: str,
        page_count: int,
        extraction_ms: int,
        account_id: str,
        chunk_count: int = 0,
    ) -> None: ...

    def update_parsed_form(
        self,
        *,
        doc_id: str,
        form_json_gcs_uri: str,
        account_id: str,
        extraction_ms: int = 0,
        entity_count: int = 0,
    ) -> None: ...

    def update_parsed_ocr(
        self,
        *,
        doc_id: str,
        ocr_json_gcs_uri: str,
        account_id: str,
        page_count: int,
        extraction_ms: int = 0,
    ) -> None: ...

    def update_parsed_genkit(
        self,
        *,
        doc_id: str,
        genkit_json_gcs_uri: str,
        account_id: str,
        extraction_ms: int = 0,
    ) -> None: ...

    def mark_rag_ready(
        self,
        *,
        doc_id: str,
        chunk_count: int,
        vector_count: int,
        embedding_model: str,
        embedding_dimensions: int,
        raw_chars: int,
        normalized_chars: int,
        normalization_version: str,
        language_hint: str,
        account_id: str,
    ) -> None: ...

    def record_error(self, doc_id: str, message: str, account_id: str) -> None: ...

    def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None: ...


class DocumentArtifactGateway(Protocol):
    def parsed_json_path(self, upload_object_path: str) -> str: ...

    def layout_json_path(self, upload_object_path: str) -> str: ...

    def form_json_path(self, upload_object_path: str) -> str: ...

    def ocr_json_path(self, upload_object_path: str) -> str: ...

    def genkit_json_path(self, upload_object_path: str) -> str: ...

    def upload_json(self, *, bucket_name: str, object_path: str, data: dict[str, Any]) -> str: ...

    def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes: ...


class DocumentPipelineGateway(
    DocumentParserGateway,
    DocumentRateLimitGateway,
    DocumentStatusGateway,
    DocumentArtifactGateway,
    Protocol,
):
    """Backward-compatible composite port built from the split document ports."""


_rag_query_gateway: RagQueryGateway | None = None
_rag_ingestion_gateway: RagIngestionGateway | None = None
_document_parser_gateway: DocumentParserGateway | None = None
_document_rate_limit_gateway: DocumentRateLimitGateway | None = None
_document_status_gateway: DocumentStatusGateway | None = None
_document_artifact_gateway: DocumentArtifactGateway | None = None
_document_pipeline_gateway: DocumentPipelineGateway | None = None


def register_rag_query_gateway(gateway: RagQueryGateway) -> None:
    global _rag_query_gateway
    _rag_query_gateway = gateway


def get_rag_query_gateway() -> RagQueryGateway:
    if _rag_query_gateway is None:
        raise RuntimeError("RagQueryGateway is not registered")
    return _rag_query_gateway


def register_rag_ingestion_gateway(gateway: RagIngestionGateway) -> None:
    global _rag_ingestion_gateway
    _rag_ingestion_gateway = gateway


def get_rag_ingestion_gateway() -> RagIngestionGateway:
    if _rag_ingestion_gateway is None:
        raise RuntimeError("RagIngestionGateway is not registered")
    return _rag_ingestion_gateway


def register_document_parser_gateway(gateway: DocumentParserGateway) -> None:
    global _document_parser_gateway
    _document_parser_gateway = gateway


def get_document_parser_gateway() -> DocumentParserGateway:
    if _document_parser_gateway is None:
        raise RuntimeError("DocumentParserGateway is not registered")
    return _document_parser_gateway


def register_document_rate_limit_gateway(gateway: DocumentRateLimitGateway) -> None:
    global _document_rate_limit_gateway
    _document_rate_limit_gateway = gateway


def get_document_rate_limit_gateway() -> DocumentRateLimitGateway:
    if _document_rate_limit_gateway is None:
        raise RuntimeError("DocumentRateLimitGateway is not registered")
    return _document_rate_limit_gateway


def register_document_status_gateway(gateway: DocumentStatusGateway) -> None:
    global _document_status_gateway
    _document_status_gateway = gateway


def get_document_status_gateway() -> DocumentStatusGateway:
    if _document_status_gateway is None:
        raise RuntimeError("DocumentStatusGateway is not registered")
    return _document_status_gateway


def register_document_artifact_gateway(gateway: DocumentArtifactGateway) -> None:
    global _document_artifact_gateway
    _document_artifact_gateway = gateway


def get_document_artifact_gateway() -> DocumentArtifactGateway:
    if _document_artifact_gateway is None:
        raise RuntimeError("DocumentArtifactGateway is not registered")
    return _document_artifact_gateway


def register_document_pipeline_gateway(gateway: DocumentPipelineGateway) -> None:
    global _document_pipeline_gateway
    _document_pipeline_gateway = gateway
    register_document_parser_gateway(gateway)
    register_document_rate_limit_gateway(gateway)
    register_document_status_gateway(gateway)
    register_document_artifact_gateway(gateway)


class _ComposedDocumentPipelineGateway:
    def __getattr__(self, name: str) -> Any:
        for gateway in (
            get_document_parser_gateway(),
            get_document_rate_limit_gateway(),
            get_document_status_gateway(),
            get_document_artifact_gateway(),
        ):
            if hasattr(gateway, name):
                return getattr(gateway, name)
        raise AttributeError(name)


def get_document_pipeline_gateway() -> DocumentPipelineGateway:
    if _document_pipeline_gateway is not None:
        return _document_pipeline_gateway
    return _ComposedDocumentPipelineGateway()
