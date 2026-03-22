import logging
import os
import traceback

from firebase_functions import firestore_fn, https_fn

from app.document_ai.interfaces.callables.process_document_with_ai import (
    handle_process_document_with_ai,
)
from app.rag_ingestion.interfaces.callables.process_uploaded_rag_document import (
    handle_process_uploaded_rag_document,
    process_uploaded_rag_document_data,
)

logger = logging.getLogger(__name__)


@https_fn.on_call(region="asia-east1")
def process_document_with_ai(req: https_fn.CallableRequest):
    return handle_process_document_with_ai(req)


@https_fn.on_call(region="asia-east1")
def process_uploaded_rag_document(req: https_fn.CallableRequest):
    return handle_process_uploaded_rag_document(req)


@https_fn.on_call(region="asia-east1")
def check_rag_pipeline_config(req: https_fn.CallableRequest):
    """Diagnostic endpoint — reports RAG pipeline configuration state.

    Call this function to verify which environment variables are set and whether
    Document AI / OpenAI adapters will be active at runtime.  No secrets are
    returned — only presence flags and non-sensitive identifiers.
    """
    from app.bootstrap.firebase import ensure_firebase_app

    ensure_firebase_app()

    doc_ai_project_id = os.getenv("DOCUMENTAI_PROJECT_ID") or "65970295651"
    doc_ai_location = os.getenv("DOCUMENTAI_LOCATION") or "asia-southeast1"
    extractor_id = os.getenv("DOCUMENTAI_OCR_EXTRACTOR_PROCESSOR_ID") or "1516a32299c1709e"
    classifier_id = os.getenv("DOCUMENTAI_OCR_CLASSIFIER_PROCESSOR_ID") or "17f1013111dec644"
    splitter_id = os.getenv("DOCUMENTAI_OCR_SPLITTER_PROCESSOR_ID") or "ba69ac6cf5650371"
    openai_key = os.getenv("OPENAI_API_KEY", "")
    storage_bucket = (
        os.getenv("FIREBASE_STORAGE_BUCKET")
        or os.getenv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET")
        or os.getenv("GCLOUD_STORAGE_BUCKET")
        or ""
    )
    gcp_project = os.getenv("GOOGLE_CLOUD_PROJECT", os.getenv("GCLOUD_PROJECT", ""))

    doc_ai_enabled = True  # Always enabled — hardcoded defaults
    env_override = bool(os.getenv("DOCUMENTAI_PROJECT_ID"))
    openai_enabled = bool(openai_key)
    ocr_extractor_resource = (
        f"projects/{doc_ai_project_id}/locations/{doc_ai_location}/processors/{extractor_id}"
    )

    config = {
        "documentAiEnabled": doc_ai_enabled,
        "documentAiProjectId": doc_ai_project_id,
        "documentAiProjectIdSource": "env" if env_override else "hardcoded",
        "documentAiLocation": doc_ai_location,
        "ocrExtractorProcessorId": extractor_id,
        "ocrExtractorResource": ocr_extractor_resource,
        "ocrClassifierProcessorId": classifier_id,
        "ocrSplitterProcessorId": splitter_id,
        "classifierEnabled": False,
        "splitterEnabled": False,
        "mode": "OCR-only (hardcoded defaults)",
        "openAiEnabled": openai_enabled,
        "openAiKeySet": bool(openai_key),
        "storageBucket": storage_bucket or "(NOT SET)",
        "gcpProject": gcp_project or "(NOT SET)",
        "parserMode": "DocumentAiRagParser (OCR-only — hardcoded)",
        "embedderMode": "OpenAiEmbedder" if openai_enabled else "DeterministicRagEmbedder (scaffold)",
    }

    logger.info("check_rag_pipeline_config: %s", config)
    return config


@firestore_fn.on_document_created(
    document="knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}",
    region="asia-east1",
)
def process_uploaded_rag_document_on_create(event: firestore_fn.Event[firestore_fn.DocumentSnapshot]):
    snapshot = event.data
    if snapshot is None:
        logger.info("process_uploaded_rag_document_on_create skipped: missing snapshot")
        return None

    data = snapshot.to_dict() or {}
    doc_id = event.params.get("documentId", "?")
    org_id = event.params.get("organizationId", "?")
    ws_id = event.params.get("workspaceId", "?")

    logger.info(
        "process_uploaded_rag_document_on_create TRIGGERED: documentId=%s orgId=%s wsId=%s status=%r "
        "DOCUMENTAI_PROJECT_ID=%s dataKeys=%s",
        doc_id,
        org_id,
        ws_id,
        data.get("status"),
        os.getenv("DOCUMENTAI_PROJECT_ID") or "65970295651 (hardcoded)",
        sorted(data.keys()),
    )

    if data.get("status") != "uploaded":
        logger.info(
            "process_uploaded_rag_document_on_create skipped: status=%r documentId=%s",
            data.get("status"),
            doc_id,
        )
        return None

    try:
        result = process_uploaded_rag_document_data(
            {
                **data,
                "documentId": doc_id,
                "organizationId": org_id,
                "workspaceId": ws_id,
            }
        )
        logger.info(
            "process_uploaded_rag_document_on_create SUCCESS: documentId=%s status=%s taxonomy=%s chunks=%s",
            result.get("documentId"),
            result.get("status"),
            result.get("taxonomy"),
            result.get("chunkCount"),
        )
        return result
    except Exception as error:
        logger.error(
            "process_uploaded_rag_document_on_create FAILED: documentId=%s error=%s\n%s",
            doc_id,
            error,
            traceback.format_exc(),
        )
        raise
