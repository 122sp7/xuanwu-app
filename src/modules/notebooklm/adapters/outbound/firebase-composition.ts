/**
 * firebase-composition — notebooklm module outbound composition root.
 *
 * Single entry point for all Firebase operations owned by the notebooklm module.
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notebooklm/adapters/outbound/ which matches the permitted glob.
 */

import { getFirebaseFirestore, firestoreApi, getFirebaseStorage, ref, getDownloadURL } from "@packages";
import { uploadWorkspaceFile } from "@/src/modules/platform/adapters/outbound/firebase-composition";
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
 * Upload a document to a workspace-scoped source path.
 * Path: workspaces/{workspaceId}/sources/{accountId}/{uuid}-{filename}
 * Parsing / indexing are triggered manually from the Sources UI.
 * Delegates to platform's uploadWorkspaceFile so upload logic stays in one place.
 */
export async function uploadDocumentToStorage(
  file: File,
  accountId: string,
  workspaceId: string,
): Promise<string> {
  return uploadWorkspaceFile(file, accountId, workspaceId, {
    prefix: `workspaces/${workspaceId}/sources/${accountId}`,
  });
}

/**
 * getDocumentDownloadUrl — resolve a Firebase Storage gs:// URI or storage path
 * to an HTTPS download URL suitable for embedding in Google Doc Viewer.
 *
 * Accepts both gs://bucket/path and relative paths like workspaces/...
 */
export async function getDocumentDownloadUrl(storageUrl: string): Promise<string> {
  const storage = getFirebaseStorage();
  const storageRef = ref(storage, storageUrl);
  return getDownloadURL(storageRef);
}

// keep firestore & firestoreApi accessible within this composition module
export { getFirebaseFirestore, firestoreApi };

// ── Storage bucket / GCS URI helpers ─────────────────────────────────────────

const _STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
  `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "xuanwu-i-00708880-4e2d8"}.firebasestorage.app`;

/**
 * Convert a relative Storage path to a gs:// URI.
 * Already-absolute gs:// URIs are returned unchanged.
 */
export function toGcsUri(pathOrUri: string): string {
  if (pathOrUri.startsWith("gs://")) return pathOrUri;
  return `gs://${_STORAGE_BUCKET}/${pathOrUri.replace(/^\/+/, "")}`;
}

// ── Client-side Firestore source initialisation ───────────────────────────────

/**
 * Write an initial source-document record to Firestore so the document appears
 * in the Sources list immediately after upload — even before fn parses it.
 *
 * The schema mirrors fn's `init_document()` so `FirestoreIngestionSourceRepository`
 * maps it correctly.  fn's parse_document callable uses merge=True when it writes,
 * so calling parse later will add parsed.* fields without overwriting these.
 */
export async function initSourceDocumentInFirestore(params: {
  docId: string;
  gcsUri: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
  accountId: string;
  workspaceId: string;
}): Promise<void> {
  const db = getFirebaseFirestore();
  const { doc, setDoc, serverTimestamp } = firestoreApi;
  const ref = doc(db, "accounts", params.accountId, "documents", params.docId);
  await setDoc(
    ref,
    {
      id: params.docId,
      title: params.filename,
      // "active" = upload done, ready to parse.
      // fn's parse_document callable will overwrite with "processing" when it starts,
      // then "completed" when done.
      status: "active",
      account_id: params.accountId,
      spaceId: params.workspaceId,
      source: {
        gcs_uri: params.gcsUri,
        filename: params.filename,
        display_name: params.filename,
        original_filename: params.filename,
        size_bytes: params.sizeBytes,
        uploaded_at: serverTimestamp(),
        mime_type: params.mimeType,
      },
      metadata: {
        filename: params.filename,
        display_name: params.filename,
        space_id: params.workspaceId,
      },
    },
    { merge: true },
  );
}

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
