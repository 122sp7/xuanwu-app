from firebase_functions import https_fn

from app.document_ai.interfaces.callables.process_document_with_ai import (
    handle_process_document_with_ai,
)
from app.rag_ingestion.interfaces.callables.process_uploaded_rag_document import (
    handle_process_uploaded_rag_document,
)


@https_fn.on_call()
def process_document_with_ai(req: https_fn.CallableRequest):
    return handle_process_document_with_ai(req)


@https_fn.on_call()
def process_uploaded_rag_document(req: https_fn.CallableRequest):
    return handle_process_uploaded_rag_document(req)
