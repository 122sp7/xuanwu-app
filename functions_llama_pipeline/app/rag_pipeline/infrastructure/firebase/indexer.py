"""[Layer 9] Firestore indexer — persist embedded chunks and manage document status.

Implements IndexerPort. Writes to the same Firestore schema as functions-python
so both pipelines share the same knowledge_base data model.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone

from firebase_admin import firestore

from app.rag_pipeline.domain.entities import DocumentChunk

logger = logging.getLogger(__name__)


class FirestoreIndexer:
    """Persist chunks to Firestore and manage document lifecycle."""

    def __init__(self) -> None:
        self._db = firestore.client()

    # ── Status transitions ───────────────────────────────────────────────────

    def mark_processing(
        self, document_id: str, organization_id: str, workspace_id: str
    ) -> None:
        self._doc_ref(organization_id, workspace_id, document_id).set(
            {"status": "processing", "updatedAt": datetime.now(timezone.utc)},
            merge=True,
        )

    def mark_failed(
        self,
        document_id: str,
        organization_id: str,
        workspace_id: str,
        error_code: str,
        error_message: str,
    ) -> None:
        self._doc_ref(organization_id, workspace_id, document_id).set(
            {
                "status": "failed",
                "errorCode": error_code,
                "errorMessage": error_message,
                "updatedAt": datetime.now(timezone.utc),
            },
            merge=True,
        )

    # ── Chunk persistence ────────────────────────────────────────────────────

    def save_ready(
        self,
        document_id: str,
        organization_id: str,
        workspace_id: str,
        taxonomy: str,
        chunks: list[DocumentChunk],
    ) -> None:
        batch = self._db.batch()
        now = datetime.now(timezone.utc)

        for chunk in chunks:
            chunk_ref = (
                self._doc_ref(organization_id, workspace_id, document_id)
                .collection("chunks")
                .document(chunk.chunk_id)
            )
            batch.set(
                chunk_ref,
                {
                    "docId": document_id,
                    "organizationId": organization_id,
                    "workspaceId": workspace_id,
                    "chunkIndex": chunk.chunk_index,
                    "text": chunk.text,
                    "embedding": list(chunk.embedding),
                    "taxonomy": taxonomy,
                    "page": chunk.page,
                    "metadata": chunk.metadata,
                    "pipeline": "llama",
                    "createdAt": now,
                },
            )

        # Also write a top-level chunks collection entry for collection-group queries.
        for chunk in chunks:
            top_chunk_ref = (
                self._db.collection("knowledge_base")
                .document(organization_id)
                .collection("workspaces")
                .document(workspace_id)
                .collection("chunks")
                .document(chunk.chunk_id)
            )
            batch.set(
                top_chunk_ref,
                {
                    "docId": document_id,
                    "organizationId": organization_id,
                    "workspaceId": workspace_id,
                    "chunkIndex": chunk.chunk_index,
                    "text": chunk.text,
                    "embedding": list(chunk.embedding),
                    "taxonomy": taxonomy,
                    "page": chunk.page,
                    "pipeline": "llama",
                    "createdAt": now,
                },
            )

        # Update the document status to ready.
        doc_ref = self._doc_ref(organization_id, workspace_id, document_id)
        batch.set(
            doc_ref,
            {
                "status": "ready",
                "taxonomy": taxonomy,
                "chunkCount": len(chunks),
                "indexedAtISO": now.isoformat(),
                "pipeline": "llama",
                "updatedAt": now,
            },
            merge=True,
        )

        batch.commit()
        logger.info(
            "Saved %d chunks for document %s (pipeline=llama)",
            len(chunks),
            document_id,
        )

    # ── Helpers ──────────────────────────────────────────────────────────────

    def _doc_ref(self, organization_id: str, workspace_id: str, document_id: str):
        return (
            self._db.collection("knowledge_base")
            .document(organization_id)
            .collection("workspaces")
            .document(workspace_id)
            .collection("documents")
            .document(document_id)
        )
