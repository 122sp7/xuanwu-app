from __future__ import annotations

from typing import Any

from domain.repositories import (
    register_document_pipeline_gateway,
    register_rag_ingestion_gateway,
    register_rag_query_gateway,
)
from infrastructure.audit.qstash import publish_query_audit
from infrastructure.cache.rag_query_cache import build_query_cache_key, get_query_cache, save_query_cache
from infrastructure.external.documentai.client import process_document_gcs
from infrastructure.external.openai.embeddings import embed_texts
from infrastructure.external.openai.rag_query import generate_answer, to_query_vector
from infrastructure.external.upstash.clients import (
    redis_fixed_window_allow,
    redis_set_json,
    upsert_search_documents,
    upsert_vectors,
)
from infrastructure.external.upstash.rag_query import query_search, query_vector
from infrastructure.persistence.firestore.document_repository import (
    init_document,
    mark_rag_ready,
    record_error,
    record_rag_error,
    update_parsed,
    update_parsed_layout,
    update_parsed_form,
)
from infrastructure.persistence.storage.client import (
    download_bytes,
    parsed_json_path,
    layout_json_path,
    form_json_path,
    upload_json,
)


class InfraRagQueryGateway:
    def build_query_cache_key(self, *, account_scope: str, query: str, top_k: int) -> str:
        return build_query_cache_key(account_scope=account_scope, query=query, top_k=top_k)

    def get_query_cache(self, cache_key: str) -> dict[str, Any] | None:
        return get_query_cache(cache_key)

    def save_query_cache(self, cache_key: str, payload: dict[str, Any]) -> None:
        save_query_cache(cache_key, payload)

    def to_query_vector(self, query: str) -> list[float]:
        from core.config import OPENAI_EMBEDDING_MODEL

        return to_query_vector(query, model=OPENAI_EMBEDDING_MODEL)

    def query_vector(self, vector: list[float], top_k: int) -> list[dict[str, Any]]:
        return query_vector(vector, top_k=top_k)

    def query_search(self, query: str, top_k: int) -> list[dict[str, Any]]:
        return query_search(query, top_k=top_k)

    def generate_answer(self, *, query: str, context_block: str) -> str:
        return generate_answer(query=query, context_block=context_block)

    def publish_query_audit(
        self,
        *,
        query: str,
        top_k: int,
        citation_count: int,
        vector_hits: int,
        search_hits: int,
    ) -> None:
        publish_query_audit(
            query=query,
            top_k=top_k,
            citation_count=citation_count,
            vector_hits=vector_hits,
            search_hits=search_hits,
        )


class InfraRagIngestionGateway:
    def embed_texts(self, texts: list[str], model: str) -> list[list[float]]:
        return embed_texts(texts, model=model)

    def upsert_vectors(self, items: list[dict[str, Any]], namespace: str = "") -> Any:
        return upsert_vectors(items, namespace=namespace)

    def upsert_search_documents(self, documents: list[dict[str, Any]]) -> int:
        return upsert_search_documents(documents)

    def redis_set_json(self, key: str, value: dict[str, Any], ttl_seconds: int = 0) -> None:
        redis_set_json(key, value, ttl_seconds=ttl_seconds)


class InfraDocumentPipelineGateway:
    def process_document_gcs(self, gcs_uri: str, mime_type: str = "application/pdf", parser: str = "layout") -> Any:
        from core.config import DOCAI_FORM_PROCESSOR_NAME, DOCAI_LAYOUT_PROCESSOR_NAME
        processor_name = DOCAI_FORM_PROCESSOR_NAME if parser == "form" else DOCAI_LAYOUT_PROCESSOR_NAME
        return process_document_gcs(gcs_uri=gcs_uri, mime_type=mime_type, processor_name=processor_name)

    def redis_fixed_window_allow(
        self,
        key: str,
        max_requests: int,
        window_seconds: int,
    ) -> tuple[bool, int]:
        return redis_fixed_window_allow(
            key=key,
            max_requests=max_requests,
            window_seconds=window_seconds,
        )

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
        init_document(
            doc_id=doc_id,
            gcs_uri=gcs_uri,
            filename=filename,
            size_bytes=size_bytes,
            mime_type=mime_type,
            account_id=account_id,
            workspace_id=workspace_id,
        )

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
    ) -> None:
        update_parsed(
            doc_id=doc_id,
            json_gcs_uri=json_gcs_uri,
            page_count=page_count,
            extraction_ms=extraction_ms,
            account_id=account_id,
            chunk_count=chunk_count,
            entity_count=entity_count,
        )

    def update_parsed_layout(
        self,
        *,
        doc_id: str,
        layout_json_gcs_uri: str,
        page_count: int,
        extraction_ms: int,
        account_id: str,
        chunk_count: int = 0,
    ) -> None:
        update_parsed_layout(
            doc_id=doc_id,
            layout_json_gcs_uri=layout_json_gcs_uri,
            page_count=page_count,
            extraction_ms=extraction_ms,
            account_id=account_id,
            chunk_count=chunk_count,
        )

    def update_parsed_form(
        self,
        *,
        doc_id: str,
        form_json_gcs_uri: str,
        account_id: str,
        extraction_ms: int = 0,
        entity_count: int = 0,
    ) -> None:
        update_parsed_form(
            doc_id=doc_id,
            form_json_gcs_uri=form_json_gcs_uri,
            account_id=account_id,
            extraction_ms=extraction_ms,
            entity_count=entity_count,
        )

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
        mark_rag_ready(
            doc_id=doc_id,
            chunk_count=chunk_count,
            vector_count=vector_count,
            embedding_model=embedding_model,
            embedding_dimensions=embedding_dimensions,
            raw_chars=raw_chars,
            normalized_chars=normalized_chars,
            normalization_version=normalization_version,
            language_hint=language_hint,
            account_id=account_id,
        )

    def record_error(self, doc_id: str, message: str, account_id: str) -> None:
        record_error(doc_id=doc_id, message=message, account_id=account_id)

    def record_rag_error(self, doc_id: str, message: str, account_id: str) -> None:
        record_rag_error(doc_id=doc_id, message=message, account_id=account_id)

    def parsed_json_path(self, upload_object_path: str) -> str:
        return parsed_json_path(upload_object_path)

    def layout_json_path(self, upload_object_path: str) -> str:
        return layout_json_path(upload_object_path)

    def form_json_path(self, upload_object_path: str) -> str:
        return form_json_path(upload_object_path)

    def upload_json(self, *, bucket_name: str, object_path: str, data: dict[str, Any]) -> str:
        return upload_json(bucket_name=bucket_name, object_path=object_path, data=data)

    def download_bytes(self, *, bucket_name: str, object_path: str) -> bytes:
        return download_bytes(bucket_name=bucket_name, object_path=object_path)


def register_runtime_dependencies() -> None:
    register_rag_query_gateway(InfraRagQueryGateway())
    register_rag_ingestion_gateway(InfraRagIngestionGateway())
    register_document_pipeline_gateway(InfraDocumentPipelineGateway())
