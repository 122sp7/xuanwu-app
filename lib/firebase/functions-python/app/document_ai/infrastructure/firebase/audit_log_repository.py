from datetime import datetime, timezone

from firebase_admin import firestore

from app.document_ai.domain.ports import DocumentAiAuditLogRepositoryPort


class FirebaseDocumentAiAuditLogRepository(DocumentAiAuditLogRepositoryPort):
    def __init__(self) -> None:
        self._db = firestore.client()

    def save(
        self,
        workspace_id: str,
        file_name: str,
        mime_type: str,
        page_count: int,
    ) -> None:
        self._db.collection("documentAiProcessLogs").add(
            {
                "workspaceId": workspace_id,
                "fileName": file_name,
                "mimeType": mime_type,
                "pageCount": page_count,
                "createdAt": datetime.now(timezone.utc),
            }
        )
