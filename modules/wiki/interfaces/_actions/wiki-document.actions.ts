"use server"

/**
 * Module: wiki
 * Layer: interfaces/actions
 * Purpose: Server Actions for wiki document write operations — upload, delete (archive),
 *          embedding, and Document-AI integration.
 *
 *          Upload flow:
 *            1. Client calls `uploadWikiDocument` with file metadata.
 *            2. Action delegates to modules/file for Storage upload + Firestore registration.
 *            3. Firestore `documents.status=uploaded` triggers functions-python ingestion worker.
 *
 *          Delete flow:
 *            1. Client calls `deleteWikiDocument` with documentId.
 *            2. Action archives the document (status → ARCHIVED) in the local store.
 *
 *          Document-AI flow (via functions-python):
 *            1. Client calls `callDocumentAi` with documentId + base64 content.
 *            2. Action invokes the `process_document_with_ai` Cloud Function callable.
 *
 *          Embedding flow (Next.js-side, for lightweight ad-hoc embedding):
 *            1. Client calls `embedWikiDocument` with documentId.
 *            2. Action embeds content via OpenAI and saves the result.
 *
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { commandFailureFrom, commandSuccess, type CommandResult } from '@shared-types'

import { CreateWikiDocumentUseCase } from '../../application/use-cases/create-wiki-document'
import type { CreateWikiDocumentDTO } from '../../application/use-cases/create-wiki-document'
import { wikiDocumentRepository } from '../../infrastructure/repositories/registry'
import { OpenAIEmbeddingRepository } from '../../infrastructure/repositories/openai-embedding.repository'

// ── Upload Wiki Document ────────────────────────────────────────────────────

export interface UploadWikiDocumentDTO extends CreateWikiDocumentDTO {
  /** Optional: actor who uploaded the document. */
  uploaderId?: string
}

/**
 * Creates a new wiki document record.
 *
 * For binary file uploads the client should:
 *   1. Call `uploadInitFile` + `uploadCompleteFile` from modules/file to upload the binary.
 *   2. Call `registerUploadedRagDocument` from modules/file to register in Firestore.
 *   3. The Firestore `documents.status=uploaded` trigger starts the functions-python worker.
 *
 * This action creates the wiki-side document entity that tracks the knowledge
 * document within the wiki module's domain model.
 */
export async function uploadWikiDocument(dto: UploadWikiDocumentDTO): Promise<CommandResult> {
  try {
    if (!dto.title.trim()) {
      return commandFailureFrom('WIKI_DOCUMENT_UPLOAD_FAILED', 'title is required')
    }
    if (!dto.organizationId.trim()) {
      return commandFailureFrom('WIKI_DOCUMENT_UPLOAD_FAILED', 'organizationId is required')
    }

    const useCase = new CreateWikiDocumentUseCase(wikiDocumentRepository)
    const doc = await useCase.execute(dto)
    return commandSuccess(doc.id, 1)
  } catch (error) {
    return commandFailureFrom(
      'WIKI_DOCUMENT_UPLOAD_FAILED',
      error instanceof Error ? error.message : 'Unexpected wiki document upload error',
    )
  }
}

// ── Delete (Archive) Wiki Document ──────────────────────────────────────────

/**
 * Archives a wiki document by setting its status to ARCHIVED.
 * Archived documents are excluded from RAG retrieval queries.
 */
export async function deleteWikiDocument(documentId: string): Promise<CommandResult> {
  if (!documentId.trim()) {
    return commandFailureFrom('WIKI_DOCUMENT_DELETE_FAILED', 'documentId is required')
  }
  try {
    const entity = await wikiDocumentRepository.findById(documentId)
    if (!entity) {
      return commandFailureFrom('WIKI_DOCUMENT_DELETE_FAILED', `Document not found: ${documentId}`)
    }
    entity.archive()
    await wikiDocumentRepository.save(entity)
    return commandSuccess(documentId, 1)
  } catch (error) {
    return commandFailureFrom(
      'WIKI_DOCUMENT_DELETE_FAILED',
      error instanceof Error ? error.message : 'Unexpected wiki document delete error',
    )
  }
}

// ── Document-AI (via functions-python) ──────────────────────────────────────

export interface CallDocumentAiDTO {
  /** Base64-encoded file content. */
  contentBase64: string
  /** Original file name for parser selection. */
  fileName: string
  /** MIME type of the file (e.g. application/pdf). */
  mimeType: string
}

export interface DocumentAiResult {
  ok: boolean
  text?: string
  documentType?: string
  confidence?: number
  error?: string
}

/**
 * Invokes the `process_document_with_ai` Cloud Function callable.
 *
 * This function runs in functions-python and uses Google Cloud Document AI
 * for OCR extraction and classification. The callable is defined in
 * `functions-python/main.py` as `process_document_with_ai`.
 *
 * Usage from client:
 *   import { functionsApi, getFirebaseFunctions } from '@integration-firebase/functions'
 *   const fn = functionsApi.httpsCallable(getFirebaseFunctions(), 'process_document_with_ai')
 *   const result = await fn({ contentBase64, fileName, mimeType })
 *
 * Note: `httpsCallable` uses the Firebase client SDK which requires initialisation of
 * the client app. In a Server Action context this works when the Firebase client app
 * is initialised server-side (as configured in `@integration-firebase/client`).
 * For environments where only Admin SDK is available, replace the call below with
 * an Admin SDK HTTP request to the Cloud Function endpoint.
 */
export async function callDocumentAi(dto: CallDocumentAiDTO): Promise<DocumentAiResult> {
  try {
    if (!dto.contentBase64.trim()) {
      return { ok: false, error: 'contentBase64 is required' }
    }
    if (!dto.fileName.trim()) {
      return { ok: false, error: 'fileName is required' }
    }

    // Dynamic import to avoid eagerly pulling Firebase client SDK into the server bundle.
    // The Firebase client app is initialised server-side in `@integration-firebase/client`,
    // so `httpsCallable` works in this Server Action context. If you need a pure Admin-SDK
    // path (e.g. from a standalone script), replace this with an Admin SDK HTTP call.
    const { getFirebaseFunctions, functionsApi } = await import(
      '@integration-firebase/functions'
    )

    const functions = getFirebaseFunctions()
    const callable = functionsApi.httpsCallable(functions, 'process_document_with_ai')
    const response = await callable({
      content_base64: dto.contentBase64,
      file_name: dto.fileName,
      mime_type: dto.mimeType,
    })

    const data = response.data as Record<string, unknown>
    return {
      ok: true,
      text: data.text as string | undefined,
      documentType: data.document_type as string | undefined,
      confidence: data.confidence as number | undefined,
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Document AI call failed',
    }
  }
}

// ── Embed Wiki Document (Next.js-side, lightweight) ─────────────────────────

/**
 * Embeds a single wiki document's content using OpenAI Embeddings API.
 *
 * This is for ad-hoc / lightweight embedding from the Next.js runtime.
 * Bulk ingestion embedding runs in functions-python (see `process_uploaded_rag_document`).
 *
 * Requires OPENAI_API_KEY environment variable.
 */
export async function embedWikiDocument(documentId: string): Promise<CommandResult> {
  if (!documentId.trim()) {
    return commandFailureFrom('WIKI_DOCUMENT_EMBED_FAILED', 'documentId is required')
  }
  try {
    const entity = await wikiDocumentRepository.findById(documentId)
    if (!entity) {
      return commandFailureFrom('WIKI_DOCUMENT_EMBED_FAILED', `Document not found: ${documentId}`)
    }
    if (!entity.content.trim()) {
      return commandFailureFrom('WIKI_DOCUMENT_EMBED_FAILED', 'Document has no content to embed')
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return commandFailureFrom(
        'WIKI_DOCUMENT_EMBED_FAILED',
        'OPENAI_API_KEY environment variable is not set',
      )
    }

    const embedder = new OpenAIEmbeddingRepository(apiKey)
    await embedder.embed({ text: entity.content, documentId })
    return commandSuccess(documentId, 1)
  } catch (error) {
    return commandFailureFrom(
      'WIKI_DOCUMENT_EMBED_FAILED',
      error instanceof Error ? error.message : 'Unexpected embedding error',
    )
  }
}
