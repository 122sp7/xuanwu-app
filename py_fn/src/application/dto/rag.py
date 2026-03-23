from __future__ import annotations

from dataclasses import dataclass


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
