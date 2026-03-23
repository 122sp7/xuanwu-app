from __future__ import annotations

from domain.repositories import (
    get_document_pipeline_gateway,
    get_rag_ingestion_gateway,
    get_rag_query_gateway,
    register_document_pipeline_gateway,
    register_rag_ingestion_gateway,
    register_rag_query_gateway,
)


class _FakeRagQueryGateway:
    def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str:
        return f"{account_scope}:{query}:{top_k}"

    def get_query_cache(self, cache_key: str) -> dict | None:
        return None

    def save_query_cache(self, cache_key: str, payload: dict) -> None:
        return None

    def to_query_vector(self, query: str) -> list[float]:
        return [1.0]

    def query_vector(self, vector: list[float], top_k: int) -> list[dict]:
        return []

    def query_search(self, query: str, top_k: int) -> list[dict]:
        return []

    def generate_answer(self, *, query: str, context_block: str) -> str:
        return query

    def publish_query_audit(
        self,
        *,
        query: str,
        top_k: int,
        citation_count: int,
        vector_hits: int,
        search_hits: int,
    ) -> None:
        return None


class _FakeRagIngestionGateway:
    def embed_texts(self, texts: list[str], model: str) -> list[list[float]]:
        return [[1.0] for _ in texts]

    def upsert_vectors(self, items: list[dict], namespace: str = "") -> None:
        return None

    def upsert_search_documents(self, documents: list[dict]) -> int:
        return len(documents)

    def redis_set_json(self, key: str, value: dict, ttl_seconds: int = 0) -> None:
        return None


class _FakeDocumentPipelineGateway:
    def process_document_gcs(self, gcs_uri: str, mime_type: str = "application/pdf") -> dict:
        return {"gcs_uri": gcs_uri, "mime_type": mime_type}

    def redis_fixed_window_allow(
        self,
        key: str,
        max_requests: int,
        window_seconds: int,
    ) -> tuple[bool, int]:
        return True, max_requests

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
    ) -> None:
        return None

    def update_parsed(
        self,
        *,
        doc_id: str,
        json_gcs_uri: str,
        page_count: int,
        extraction_ms: int,
        account_id: str,
    ) -> None:
        return None

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
    ) -> None:
        return None

    def record_error(self, doc_id: str, message: str, account_id: str) -> None:
        return None

    def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None:
        return None

    def parsed_json_path(self, upload_object_path: str) -> str:
        return upload_object_path

    def upload_json(self, *, bucket_name: str, object_path: str, data: dict) -> str:
        return f"gs://{bucket_name}/{object_path}"

    def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes:
        return b""


def test_register_gateways_WithAllGatewayTypes_RetrievesExactInstances() -> None:
    rag_query_gateway = _FakeRagQueryGateway()
    rag_ingestion_gateway = _FakeRagIngestionGateway()
    document_pipeline_gateway = _FakeDocumentPipelineGateway()

    register_rag_query_gateway(rag_query_gateway)
    register_rag_ingestion_gateway(rag_ingestion_gateway)
    register_document_pipeline_gateway(document_pipeline_gateway)

    assert get_rag_query_gateway() is rag_query_gateway
    assert get_rag_ingestion_gateway() is rag_ingestion_gateway
    assert get_document_pipeline_gateway() is document_pipeline_gateway


def test_applicationGatewayShim_AfterDomainRegistration_ReturnsIdenticalInstances() -> None:
    from application.ports.output.gateways import (
        get_document_pipeline_gateway as get_document_pipeline_gateway_from_shim,
    )
    from application.ports.output.gateways import (
        get_rag_ingestion_gateway as get_rag_ingestion_gateway_from_shim,
    )
    from application.ports.output.gateways import (
        get_rag_query_gateway as get_rag_query_gateway_from_shim,
    )

    assert get_rag_query_gateway_from_shim() is get_rag_query_gateway()
    assert get_rag_ingestion_gateway_from_shim() is get_rag_ingestion_gateway()
    assert get_document_pipeline_gateway_from_shim() is get_document_pipeline_gateway()
