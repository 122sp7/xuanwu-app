from firebase_functions import firestore_fn, https_fn

from app.document_ai.interfaces.callables.process_document_with_ai import (
    handle_process_document_with_ai,
)
from app.rag_ingestion.interfaces.callables.process_uploaded_rag_document import (
    handle_process_uploaded_rag_document,
    process_uploaded_rag_document_data,
)


@https_fn.on_call()
def process_document_with_ai(req: https_fn.CallableRequest):
    return handle_process_document_with_ai(req)


@https_fn.on_call()
def process_uploaded_rag_document(req: https_fn.CallableRequest):
    return handle_process_uploaded_rag_document(req)


@firestore_fn.on_document_created(
    document="knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}"
)
def process_uploaded_rag_document_on_create(event: firestore_fn.Event[firestore_fn.DocumentSnapshot]):
    snapshot = event.data
    if snapshot is None:
        return None

    data = snapshot.to_dict() or {}
    if data.get("status") != "uploaded":
        return None

    return process_uploaded_rag_document_data(
        {
            **data,
            "documentId": event.params["documentId"],
            "organizationId": event.params["organizationId"],
            "workspaceId": event.params["workspaceId"],
        }
    )
