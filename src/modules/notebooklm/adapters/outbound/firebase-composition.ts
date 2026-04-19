/**
 * firebase-composition — notebooklm module outbound composition root.
 *
 * Single entry point for all Firebase operations owned by the notebooklm module.
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notebooklm/adapters/outbound/ which matches the permitted glob.
 */

import { getFirebaseFirestore, firestoreApi, getFirebaseStorage, ref, uploadBytes, getDownloadURL } from "@packages";
import { FirestoreDocumentRepository } from "../../subdomains/document/adapters/outbound/firestore/FirestoreDocumentRepository";
import { InMemoryNotebookRepository } from "../../subdomains/notebook/adapters/outbound/memory/InMemoryNotebookRepository";
import {
  AddDocumentUseCase,
  ArchiveDocumentUseCase,
  QueryDocumentsUseCase,
} from "../../subdomains/document/application/use-cases/DocumentUseCases";
import {
  CreateNotebookUseCase,
  AddDocumentToNotebookUseCase,
  GenerateNotebookResponseUseCase,
} from "../../subdomains/notebook/application/use-cases/NotebookUseCases";
import type { NotebookGenerationPort } from "../../subdomains/notebook/domain/ports/NotebookGenerationPort";
import { callRagQuery, callParseDocument, callReindexDocument, type RagQueryInput, type RagQueryOutput, type ParseDocumentInput, type ParseDocumentOutput, type ReindexDocumentInput } from "./callable/FirebaseCallableAdapter";

// ── Singleton repositories ────────────────────────────────────────────────────

let _docRepo: FirestoreDocumentRepository | undefined;
let _notebookRepo: InMemoryNotebookRepository | undefined;

function getDocumentRepo(): FirestoreDocumentRepository {
  if (!_docRepo) _docRepo = new FirestoreDocumentRepository();
  return _docRepo;
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

export function createClientNotebooklmDocumentUseCases() {
  const repo = getDocumentRepo();
  return {
    addDocument: new AddDocumentUseCase(repo),
    archiveDocument: new ArchiveDocumentUseCase(repo),
    queryDocuments: new QueryDocumentsUseCase(repo),
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
 * Upload a document to the GCS path expected by the fn Storage Trigger.
 * Path: uploads/{accountId}/{workspaceId}/{uuid}-{filename}
 * The Storage Trigger automatically runs parse + RAG on this prefix.
 */
export async function uploadDocumentToStorage(
  file: File,
  accountId: string,
  workspaceId: string,
): Promise<string> {
  const storage = getFirebaseStorage();
  const uuid = crypto.randomUUID();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `uploads/${accountId}/${workspaceId}/${uuid}-${safeName}`;
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

/**
 * getDocumentDownloadUrl — resolve a Firebase Storage gs:// URI or storage path
 * to an HTTPS download URL suitable for embedding in Google Doc Viewer.
 *
 * Accepts both gs://bucket/path and relative paths like uploads/...
 */
export async function getDocumentDownloadUrl(storageUrl: string): Promise<string> {
  const storage = getFirebaseStorage();
  const storageRef = ref(storage, storageUrl);
  return getDownloadURL(storageRef);
}

// keep firestore & firestoreApi accessible within this composition module
export { getFirebaseFirestore, firestoreApi };
