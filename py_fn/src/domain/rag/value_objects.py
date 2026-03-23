from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class RagQueryInput:
    query: str
    account_scope: str
    workspace_scope: str
    top_k: int
    taxonomy_filters: tuple[str, ...]
    max_age_days: int
    require_ready: bool

    @classmethod
    def from_raw(
        cls,
        *,
        query: str,
        account_scope: str,
        workspace_scope: str,
        top_k: int | None,
        taxonomy_filters: list[str] | tuple[str, ...] | None,
        max_age_days: int | None,
        require_ready: bool,
        default_top_k: int,
        default_max_age_days: int,
        max_top_k: int = 40,
    ) -> "RagQueryInput":
        normalized_query = (query or "").strip()
        normalized_scope = (account_scope or "").strip()
        normalized_workspace_scope = (workspace_scope or "").strip()
        if not normalized_scope:
            raise ValueError("account_scope is required")
        if not normalized_workspace_scope:
            raise ValueError("workspace_scope is required")

        if top_k is None:
            effective_top_k = default_top_k
        else:
            effective_top_k = int(top_k)

        if effective_top_k <= 0:
            effective_top_k = default_top_k

        effective_top_k = min(effective_top_k, max_top_k)

        normalized_filters = tuple(
            filter(
                None,
                [str(value or "").strip().lower() for value in (taxonomy_filters or ())],
            )
        )

        if max_age_days is None:
            effective_max_age_days = default_max_age_days
        else:
            effective_max_age_days = int(max_age_days)
        if effective_max_age_days <= 0:
            effective_max_age_days = default_max_age_days

        return cls(
            query=normalized_query,
            account_scope=normalized_scope,
            workspace_scope=normalized_workspace_scope,
            top_k=effective_top_k,
            taxonomy_filters=normalized_filters,
            max_age_days=effective_max_age_days,
            require_ready=require_ready,
        )

    @property
    def has_query(self) -> bool:
        return bool(self.query)

    def retrieval_top_k(self, multiplier: int = 4, cap: int = 40) -> int:
        return min(max(self.top_k * multiplier, self.top_k), cap)


@dataclass(frozen=True)
class RagCitation:
    provider: str
    doc_id: str | None = None
    chunk_id: str | None = None
    score: float | int | None = None
    filename: str | None = None
    json_gcs_uri: str | None = None
    search_id: str | None = None
    account_id: str | None = None
    workspace_id: str | None = None
    taxonomy: str | None = None
    processing_status: str | None = None
    indexed_at: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "provider": self.provider,
            "doc_id": self.doc_id,
            "chunk_id": self.chunk_id,
            "score": self.score,
            "filename": self.filename,
            "json_gcs_uri": self.json_gcs_uri,
            "search_id": self.search_id,
            "account_id": self.account_id or "",
            "workspace_id": self.workspace_id or "",
            "taxonomy": self.taxonomy or "",
            "processing_status": self.processing_status or "",
            "indexed_at": self.indexed_at or "",
        }


@dataclass(frozen=True)
class RagQueryResult:
    answer: str
    citations: tuple[RagCitation, ...]
    cache: str
    vector_hits: int
    search_hits: int
    account_scope: str
    workspace_scope: str
    taxonomy_filters: tuple[str, ...]
    max_age_days: int
    require_ready: bool
    debug: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "answer": self.answer,
            "citations": [citation.to_dict() for citation in self.citations],
            "cache": self.cache,
            "vector_hits": self.vector_hits,
            "search_hits": self.search_hits,
            "account_scope": self.account_scope,
            "workspace_scope": self.workspace_scope,
            "taxonomy_filters": list(self.taxonomy_filters),
            "max_age_days": self.max_age_days,
            "require_ready": self.require_ready,
        }
        if self.debug:
            payload["debug"] = self.debug
        return payload
