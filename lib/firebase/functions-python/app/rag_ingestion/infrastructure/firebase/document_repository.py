from datetime import datetime, timezone

from firebase_admin import firestore

from app.rag_ingestion.domain.entities import RagChunk
from app.rag_ingestion.domain.ports import RagDocumentRepositoryPort


class FirebaseRagDocumentRepository(RagDocumentRepositoryPort):
    def __init__(self) -> None:
        self._db = firestore.client()

    def mark_processing(self, document_id: str) -> None:
        self._db.collection("documents").document(document_id).set(
            {
                "status": "processing",
                "processingStartedAt": datetime.now(timezone.utc),
                "updatedAt": datetime.now(timezone.utc),
            },
            merge=True,
        )

    def save_ready(
        self,
        document_id: str,
        tenant_id: str,
        workspace_id: str,
        taxonomy: str,
        chunks: list[RagChunk],
    ) -> None:
        batch = self._db.batch()
        chunks_collection = self._db.collection("chunks")
        document_ref = self._db.collection("documents").document(document_id)

        for chunk in chunks:
            batch.set(
                chunks_collection.document(chunk.chunk_id),
                {
                    "docId": chunk.doc_id,
                    "tenantId": tenant_id,
                    "workspaceId": workspace_id,
                    "chunkIndex": chunk.chunk_index,
                    "text": chunk.text,
                    "embedding": list(chunk.embedding),
                    "taxonomy": chunk.taxonomy,
                    "page": chunk.page,
                    "tags": list(chunk.tags),
                },
            )

        batch.set(
            document_ref,
            {
                "status": "ready",
                "taxonomy": taxonomy,
                "readyAt": datetime.now(timezone.utc),
                "updatedAt": datetime.now(timezone.utc),
            },
            merge=True,
        )
        batch.commit()

    def mark_failed(self, document_id: str, error_code: str, error_message: str) -> None:
        self._db.collection("documents").document(document_id).set(
            {
                "status": "failed",
                "errorCode": error_code,
                "errorMessage": error_message,
                "failedAt": datetime.now(timezone.utc),
                "updatedAt": datetime.now(timezone.utc),
            },
            merge=True,
        )
