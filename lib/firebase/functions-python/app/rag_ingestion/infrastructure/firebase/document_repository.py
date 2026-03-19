from datetime import datetime, timezone

from firebase_admin import firestore

from app.rag_ingestion.domain.entities import RagChunk
from app.rag_ingestion.domain.ports import RagDocumentRepositoryPort


class FirebaseRagDocumentRepository(RagDocumentRepositoryPort):
    def __init__(self) -> None:
        self._db = firestore.client()

    def _workspace_root(self, organization_id: str, workspace_id: str):
        return (
            self._db.collection("knowledge_base")
            .document(organization_id)
            .collection("workspaces")
            .document(workspace_id)
        )

    def _document_ref(self, document_id: str, organization_id: str, workspace_id: str):
        return self._workspace_root(organization_id, workspace_id).collection("documents").document(
            document_id
        )

    def mark_processing(self, document_id: str, organization_id: str, workspace_id: str) -> None:
        self._document_ref(document_id, organization_id, workspace_id).set(
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
        organization_id: str,
        workspace_id: str,
        taxonomy: str,
        chunks: list[RagChunk],
    ) -> None:
        batch = self._db.batch()
        workspace_root = self._workspace_root(organization_id, workspace_id)
        chunks_collection = workspace_root.collection("chunks")
        document_ref = workspace_root.collection("documents").document(document_id)

        for chunk in chunks:
            batch.set(
                chunks_collection.document(chunk.chunk_id),
                {
                    "chunkId": chunk.chunk_id,
                    "docId": chunk.doc_id,
                    "organizationId": organization_id,
                    "workspaceId": workspace_id,
                    "chunkIndex": chunk.chunk_index,
                    "text": chunk.text,
                    "embedding": list(chunk.embedding),
                    "taxonomy": chunk.taxonomy,
                    "page": chunk.page,
                    "tags": list(chunk.tags),
                },
            )

        now = datetime.now(timezone.utc)
        batch.set(
            document_ref,
            {
                "status": "ready",
                "taxonomy": taxonomy,
                "chunkCount": len(chunks),
                "indexedAtISO": now.isoformat(),
                "readyAt": now,
                "updatedAt": now,
                "updatedAtISO": now.isoformat(),
            },
            merge=True,
        )
        batch.commit()

    def mark_failed(
        self,
        document_id: str,
        organization_id: str,
        workspace_id: str,
        error_code: str,
        error_message: str,
    ) -> None:
        self._document_ref(document_id, organization_id, workspace_id).set(
            {
                "status": "failed",
                "errorCode": error_code,
                "errorMessage": error_message,
                "failedAt": datetime.now(timezone.utc),
                "updatedAt": datetime.now(timezone.utc),
            },
            merge=True,
        )
