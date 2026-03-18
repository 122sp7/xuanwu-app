from firebase_functions import https_fn

from app.document_ai.interfaces.callables.process_document_with_ai import (
    handle_process_document_with_ai,
)


@https_fn.on_call()
def process_document_with_ai(req: https_fn.CallableRequest):
    return handle_process_document_with_ai(req)
