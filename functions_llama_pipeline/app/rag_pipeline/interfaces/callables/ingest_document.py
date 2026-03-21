"""Firebase callable handler: ingest a document via the LlamaIndex pipeline.

Expects the same payload shape as functions-python's process_uploaded_rag_document
so the Next.js front-end can target either codebase without payload changes.
"""

from __future__ import annotations

import logging

from app.bootstrap.firebase import ensure_firebase_app
from app.rag_pipeline.application.use_cases.ingest_document import IngestDocumentUseCase
from app.rag_pipeline.domain.entities import IngestDocumentCommand
from app.rag_pipeline.infrastructure.firebase.indexer import FirestoreIndexer
from app.rag_pipeline.infrastructure.llamaindex.chunker import LlamaIndexChunker
from app.rag_pipeline.infrastructure.llamaindex.embedder import LlamaIndexEmbedder
from app.rag_pipeline.infrastructure.llamaindex.parser import LlamaParseDocumentParser
from app.rag_pipeline.infrastructure.llamaindex.preprocessor import LlamaTextPreprocessor
from app.rag_pipeline.infrastructure.llamaindex.taxonomy import SimpleTaxonomyClassifier

logger = logging.getLogger(__name__)


def handle_ingest_document(data: dict) -> dict:
    """Handle the callable request to ingest a document."""
    ensure_firebase_app()

    command = IngestDocumentCommand(
        document_id=data["documentId"],
        organization_id=data["organizationId"],
        workspace_id=data["workspaceId"],
        title=data.get("title", ""),
        source_file_name=data.get("sourceFileName", ""),
        mime_type=data.get("mimeType", "application/pdf"),
        storage_path=data.get("storagePath", ""),
        raw_text=data.get("rawText", ""),
        taxonomy_hint=data.get("taxonomyHint"),
        checksum=data.get("checksum"),
    )

    use_case = IngestDocumentUseCase(
        parser=LlamaParseDocumentParser(),
        taxonomy_classifier=SimpleTaxonomyClassifier(),
        preprocessor=LlamaTextPreprocessor(),
        chunker=LlamaIndexChunker(),
        embedder=LlamaIndexEmbedder(),
        indexer=FirestoreIndexer(),
    )

    result = use_case.execute(command)

    return {
        "documentId": result.document_id,
        "status": result.status,
        "taxonomy": result.taxonomy,
        "chunkCount": result.chunk_count,
        "nodeCount": result.node_count,
    }
