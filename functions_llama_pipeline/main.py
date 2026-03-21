"""Firebase Functions entrypoint for the LlamaIndex RAG pipeline.

This is the **beta** LlamaIndex pipeline codebase — separate from
``functions-python`` and deployed as its own Firebase Functions codebase
(``functions-llama-pipeline`` in ``firebase.json``).

It registers:
  1. ``llama_ingest_document``  — callable to ingest a document (Layers 1–9)
  2. ``llama_rag_query``        — callable to run a RAG query  (Layers 10–13)
  3. ``llama_ingest_on_create`` — Firestore trigger for auto-ingestion
"""

import logging

from firebase_functions import firestore_fn, https_fn, options

from app.rag_pipeline.interfaces.callables.ingest_document import (
    handle_ingest_document,
)
from app.rag_pipeline.interfaces.callables.rag_query import handle_rag_query

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pipeline identifier used to route documents to this codebase.
# Only documents with pipeline=PIPELINE_NAME in Firestore are processed here.
PIPELINE_NAME = "llama"


# ── Callable: Ingest Document (Layers 1–9) ──────────────────────────────────

@https_fn.on_call(
    memory=options.MemoryOption.GB_1,
    timeout_sec=540,
)
def llama_ingest_document(req: https_fn.CallableRequest):
    """Ingest a document through the LlamaIndex pipeline (manual/retry trigger)."""
    logger.info("llama_ingest_document called for: %s", req.data.get("documentId", "?"))
    return handle_ingest_document(req.data)


# ── Callable: RAG Query (Layers 10–13) ──────────────────────────────────────

@https_fn.on_call(
    memory=options.MemoryOption.GB_1,
    timeout_sec=120,
)
def llama_rag_query(req: https_fn.CallableRequest):
    """Run a RAG query through the LlamaIndex pipeline."""
    logger.info("llama_rag_query called")
    return handle_rag_query(req.data)


# ── Firestore Trigger: Auto-ingest on document creation (Layers 1–9) ────────

@firestore_fn.on_document_created(
    document="knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}",
    memory=options.MemoryOption.GB_1,
    timeout_sec=540,
)
def llama_ingest_on_create(
    event: firestore_fn.Event[firestore_fn.DocumentSnapshot],
):
    """Auto-ingest when a new document is created in the knowledge_base collection.

    Only triggers for documents with pipeline="llama" to avoid conflicting with
    the functions-python pipeline which handles documents without the pipeline field.
    """
    snapshot = event.data
    if not snapshot:
        return

    data = snapshot.to_dict() or {}

    # Only process documents explicitly tagged for the llama pipeline.
    if data.get("pipeline") != PIPELINE_NAME:
        logger.info(
            "Skipping document %s — not tagged for llama pipeline",
            event.params.get("documentId", "?"),
        )
        return

    if data.get("status") != "uploaded":
        logger.info(
            "Skipping document %s — status is %s (not uploaded)",
            event.params.get("documentId", "?"),
            data.get("status"),
        )
        return

    logger.info(
        "Auto-ingesting document %s via llama pipeline",
        event.params.get("documentId", "?"),
    )

    handle_ingest_document(
        {
            "documentId": event.params["documentId"],
            "organizationId": event.params["organizationId"],
            "workspaceId": event.params["workspaceId"],
            "title": data.get("title", ""),
            "sourceFileName": data.get("sourceFileName", ""),
            "mimeType": data.get("mimeType", "application/pdf"),
            "storagePath": data.get("storagePath", ""),
            "rawText": data.get("rawText", ""),
            "taxonomyHint": data.get("taxonomy"),
            "checksum": data.get("checksum"),
        }
    )
