/**
 * firebase-composition — notebooklm module outbound composition root.
 *
 * Single entry point for all Firebase operations owned by the notebooklm module.
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notebooklm/adapters/outbound/ which matches the permitted glob.
 */

import { getFirebaseFirestore, firestoreApi, getFirebaseStorage, ref, uploadBytes, getDownloadURL } from "@packages";
import { FirestoreIngestionSourceRepository } from "../../subdomains/source/adapters/outbound/firestore/FirestoreIngestionSourceRepository";
import { InMemoryNotebookRepository } from "../../subdomains/notebook/adapters/outbound/memory/InMemoryNotebookRepository";
import {
  RegisterIngestionSourceUseCase,
  ArchiveIngestionSourceUseCase,
  QueryIngestionSourcesUseCase,
} from "../../subdomains/source/application/use-cases/IngestionSourceUseCases";
import {
  CreateNotebookUseCase,
  AddDocumentToNotebookUseCase,
  GenerateNotebookResponseUseCase,
} from "../../subdomains/notebook/application/use-cases/NotebookUseCases";
import type { NotebookGenerationPort } from "../../subdomains/notebook/domain/ports/NotebookGenerationPort";
import { callRagQuery, callParseDocument, callReindexDocument, type RagQueryInput, type RagQueryOutput, type ParseDocumentInput, type ParseDocumentOutput, type ReindexDocumentInput } from "./callable/FirebaseCallableAdapter";
import { buildSourceUploadPath } from "./source-storage-path";

// ── Singleton repositories ────────────────────────────────────────────────────

let _sourceRepo: FirestoreIngestionSourceRepository | undefined;
let _notebookRepo: InMemoryNotebookRepository | undefined;

function getSourceRepo(): FirestoreIngestionSourceRepository {
  if (!_sourceRepo) _sourceRepo = new FirestoreIngestionSourceRepository();
  return _sourceRepo;
}

function getNotebookRepo(): InMemoryNotebookRepository {
  if (!_notebookRepo) _notebookRepo = new InMemoryNotebookRepository();
  return _notebookRepo;
}

// ── RagQuery generation port bridge ──────────────────────────────────────────

class RagQueryGenerationPort implements NotebookGenerationPort {
  constructor(
    private readonly accountId: string,
    private readonly workspaceId: string,
  ) {}

  async generateResponse(input: {
    prompt: string;
    notebookId: string;
    model?: string;
  }): Promise<{ text: string; model: string }> {
    const result: RagQueryOutput = await callRagQuery({
      account_id: this.accountId,
      workspace_id: this.workspaceId,
      query: input.prompt,
    });
    return { text: result.answer, model: input.model ?? "rag" };
  }
}

// ── Factory functions ─────────────────────────────────────────────────────────

export function createClientNotebooklmSourceUseCases() {
  const repo = getSourceRepo();
  return {
    registerSource: new RegisterIngestionSourceUseCase(repo),
    archiveSource: new ArchiveIngestionSourceUseCase(repo),
    querySources: new QueryIngestionSourcesUseCase(repo),
  };
}

export function createClientNotebooklmNotebookUseCases(accountId: string, workspaceId: string) {
  const repo = getNotebookRepo();
  const generationPort = new RagQueryGenerationPort(accountId, workspaceId);
  return {
    createNotebook: new CreateNotebookUseCase(repo),
    addDocumentToNotebook: new AddDocumentToNotebookUseCase(repo),
    generateResponse: new GenerateNotebookResponseUseCase(repo, generationPort),
  };
}

export { callRagQuery, callParseDocument, callReindexDocument };
export type { RagQueryInput, RagQueryOutput, ParseDocumentInput, ParseDocumentOutput, ReindexDocumentInput };

// ── Storage upload helper ─────────────────────────────────────────────────────

/**
 * Upload a document to the user-managed source prefix.
 * Path: workspaces/{workspaceId}/sources/{accountId}/{uuid}-{filename}
 * Manual parse / index actions decide when downstream processing runs.
 */
export async function uploadDocumentToStorage(
  file: File,
  accountId: string,
  workspaceId: string,
): Promise<string> {
  const storage = getFirebaseStorage();
  const uuid = crypto.randomUUID();
  const path = buildSourceUploadPath({
    accountId,
    workspaceId,
    filename: file.name,
    uuid,
  });
  const storageRef = ref(storage, path);
  const metadata = {
    customMetadata: {
      account_id: accountId,
      workspace_id: workspaceId,
      filename: file.name,
    },
  };
  await uploadBytes(storageRef, file, metadata);
  return path;
}

export async function registerUploadedDocument(params: {
  accountId: string;
  workspaceId: string;
  gcsPath: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}) {
  const { registerSource } = createClientNotebooklmSourceUseCases();
  return registerSource.execute({
    accountId: params.accountId,
    workspaceId: params.workspaceId,
    organizationId: "",
    name: params.filename,
    mimeType: params.mimeType,
    sizeBytes: params.sizeBytes,
    storageUrl: params.gcsPath,
    originUri: params.gcsPath,
  });
}

/**
 * getDocumentDownloadUrl — resolve a Firebase Storage gs:// URI or storage path
 * to an HTTPS download URL suitable for embedding in Google Doc Viewer.
 *
 * Accepts both gs://bucket/path and relative paths like workspaces/... / sources/... / uploads/...
 */
export async function getDocumentDownloadUrl(storageUrl: string): Promise<string> {
  const storage = getFirebaseStorage();
  const storageRef = ref(storage, storageUrl);
  return getDownloadURL(storageRef);
}

// keep firestore & firestoreApi accessible within this composition module
export { getFirebaseFirestore, firestoreApi };

// ── Client-side Firestore query helper ───────────────────────────────────────

/**
 * queryDocuments — query ingestion sources directly from the browser.
 *
 * MUST be called from a client component, NOT from a Server Action.
 * The Firebase Web Client SDK requires a signed-in user in the browser context
 * so that Firestore Security Rules can evaluate request.auth.  A Server Action
 * has no active Firebase user session, which causes "Missing or insufficient
 * permissions" even when rules only require `isSignedIn()`.
 */
export async function queryDocuments(params: {
  accountId: string;
  workspaceId?: string;
}) {
  const repo = getSourceRepo();
  return repo.query(params);
}
