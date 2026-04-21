from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class RagIngestionResult:
    chunk_count: int
    vector_count: int
    embedding_model: str
    embedding_dimensions: int
    raw_chars: int
    normalized_chars: int
    normalization_version: str
    language_hint: str


@dataclass(frozen=True)
class RagQueryEffectPlan:
    cache_key: str
    query: str
    top_k: int
    citation_count: int
    vector_hits: int
    search_hits: int


@dataclass(frozen=True)
class RagQueryExecution:
    response: dict[str, Any]
    effect_plan: RagQueryEffectPlan | None = None
