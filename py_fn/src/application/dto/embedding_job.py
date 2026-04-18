"""
embedding_job.py

Pydantic mirror of the TypeScript EmbeddingJobPayload schema.
Defined in: src/modules/ai/subdomains/embedding/adapters/outbound/dto/embedding-job-payload.ts

Both sides must stay semantically aligned. Changes to the TypeScript schema
require corresponding updates here, and vice versa.

See: docs/structure/contexts/ai/cross-runtime-contracts.md
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, UUID4


class EmbeddingJobPayload(BaseModel):
    """QStash message payload for embedding generation jobs dispatched by Next.js."""

    job_id: UUID4 = Field(..., description="Unique identifier for this job (idempotency key)")
    document_id: str = Field(..., min_length=1, description="Source document / artifact ID")
    workspace_id: str = Field(..., min_length=1, description="Workspace scope for multi-tenant isolation")
    chunk_ids: List[str] = Field(..., min_length=1, description="Chunk IDs to generate embeddings for")
    model_hint: Optional[str] = Field(None, description="Preferred embedding model; uses default if omitted")
    requested_at: datetime = Field(..., description="ISO 8601 timestamp when the job was requested")

    model_config = {"str_strip_whitespace": True}
