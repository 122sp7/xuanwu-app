"""
chunk_job.py

Pydantic mirror of the TypeScript ChunkJobPayload schema.
Defined in: src/modules/ai/subdomains/chunk/adapters/outbound/dto/chunk-job-payload.ts

Both sides must stay semantically aligned. Changes to the TypeScript schema
require corresponding updates here, and vice versa.

See: docs/contexts/ai/cross-runtime-contracts.md
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, UUID4


class ChunkingStrategy(str, Enum):
    FIXED_SIZE = "fixed-size"
    SEMANTIC = "semantic"
    MARKDOWN_SECTION = "markdown-section"


class ChunkJobPayload(BaseModel):
    """QStash message payload for document chunking jobs dispatched by Next.js."""

    job_id: UUID4 = Field(..., description="Unique identifier for this job (idempotency key)")
    document_id: str = Field(..., min_length=1, description="Raw document ID to be chunked")
    workspace_id: str = Field(..., min_length=1, description="Workspace scope for multi-tenant isolation")
    source_type: str = Field(..., min_length=1, description='Source type (e.g. "notion-page", "uploaded-file")')
    strategy_hint: Optional[ChunkingStrategy] = Field(None, description="Preferred chunking strategy")
    max_tokens_per_chunk: Optional[int] = Field(
        None, ge=1, le=8192, description="Max tokens per chunk; uses default if omitted"
    )
    requested_at: datetime = Field(..., description="ISO 8601 timestamp when the job was requested")

    model_config = {"str_strip_whitespace": True}
