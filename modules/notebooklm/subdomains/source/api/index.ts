/**
 * Public API boundary for the source subdomain.
 *
 * Cross-module consumers MUST import through this entry point.
 * Internal consumers within the subdomain import from their own layer.
 */

// ---------------------------------------------------------------------------
// Domain entity types
// ---------------------------------------------------------------------------

export type {
  SourceFile,
  SourceFileStatus,
  SourceFileClassification,
} from "../domain/entities/SourceFile";

export type {
  SourceFileVersion,
  SourceFileVersionStatus,
} from "../domain/entities/SourceFileVersion";

export type {
  RagDocumentRecord,
  RagDocumentStatus,
} from "../domain/entities/RagDocument";

export type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryFieldType,
  WikiLibraryRow,
  WikiLibraryStatus,
  CreateWikiLibraryInput,
  AddWikiLibraryFieldInput,
  CreateWikiLibraryRowInput,
} from "../domain/entities/WikiLibrary";

// ---------------------------------------------------------------------------
// Wiki library use cases (lazy singleton — no module-scope side effects)
// ---------------------------------------------------------------------------

import type { IWikiLibraryRepository } from "../domain/repositories/IWikiLibraryRepository";
import { FirebaseWikiLibraryAdapter } from "../infrastructure/firebase/FirebaseWikiLibraryAdapter";
import {
  listWikiLibraries as _listWikiLibraries,
  createWikiLibrary as _createWikiLibrary,
  addWikiLibraryField as _addWikiLibraryField,
  createWikiLibraryRow as _createWikiLibraryRow,
  getWikiLibrarySnapshot as _getWikiLibrarySnapshot,
} from "../application/use-cases/wiki-library.use-cases";

import type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
  CreateWikiLibraryInput,
  AddWikiLibraryFieldInput,
  CreateWikiLibraryRowInput,
} from "../domain/entities/WikiLibrary";

export type { WikiLibrarySnapshot } from "../application/use-cases/wiki-library.use-cases";

let _libraryRepo: IWikiLibraryRepository | null = null;

function getLibraryRepo(): IWikiLibraryRepository {
  if (!_libraryRepo) _libraryRepo = new FirebaseWikiLibraryAdapter();
  return _libraryRepo;
}

export function listWikiLibraries(accountId: string, workspaceId?: string): Promise<WikiLibrary[]> {
  return _listWikiLibraries(accountId, workspaceId, getLibraryRepo());
}

export function createWikiLibrary(input: CreateWikiLibraryInput): Promise<WikiLibrary> {
  return _createWikiLibrary(input, getLibraryRepo());
}

export function addWikiLibraryField(input: AddWikiLibraryFieldInput): Promise<WikiLibraryField> {
  return _addWikiLibraryField(input, getLibraryRepo());
}

export function createWikiLibraryRow(input: CreateWikiLibraryRowInput): Promise<WikiLibraryRow> {
  return _createWikiLibraryRow(input, getLibraryRepo());
}

export function getWikiLibrarySnapshot(accountId: string, libraryId: string): ReturnType<typeof _getWikiLibrarySnapshot> {
  return _getWikiLibrarySnapshot(accountId, libraryId, getLibraryRepo());
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export type {
  SourceDocument,
  SourceLiveDocument,
  AssetDocument,
  AssetLiveDocument,
  UseSourceDocumentsSnapshotResult,
} from "../interfaces/hooks/useSourceDocumentsSnapshot";
export {
  useSourceDocumentsSnapshot,
  mapToSourceLiveDocument,
  mapToAssetLiveDocument,
} from "../interfaces/hooks/useSourceDocumentsSnapshot";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export { getWorkspaceFiles, getWorkspaceRagDocuments } from "../interfaces/queries/source-file.queries";

// ---------------------------------------------------------------------------
// Server actions
// ---------------------------------------------------------------------------

export {
  uploadInitFile,
  uploadCompleteFile,
  registerUploadedRagDocument,
  deleteSourceDocument,
  renameSourceDocument,
} from "../interfaces/_actions/source-file.actions";

export { createKnowledgeDraftFromSourceDocument } from "../interfaces/_actions/source-processing.actions";

// ---------------------------------------------------------------------------
// UI components
// ---------------------------------------------------------------------------

export { SourceDocumentsView } from "../interfaces/components/SourceDocumentsView";
export { WorkspaceFilesTab } from "../interfaces/components/WorkspaceFilesTab";
export { LibrariesView } from "../interfaces/components/LibrariesView";
export { LibraryTableView } from "../interfaces/components/LibraryTableView";
export { FileProcessingDialog } from "../interfaces/components/FileProcessingDialog";

// ---------------------------------------------------------------------------
// Infrastructure (for direct injection in server-side wiring)
// ---------------------------------------------------------------------------

export { FirebaseSourceFileAdapter } from "../infrastructure/firebase/FirebaseSourceFileAdapter";
export { FirebaseRagDocumentAdapter } from "../infrastructure/firebase/FirebaseRagDocumentAdapter";
export { FirebaseWikiLibraryAdapter } from "../infrastructure/firebase/FirebaseWikiLibraryAdapter";
export { InMemoryWikiLibraryAdapter } from "../infrastructure/memory/InMemoryWikiLibraryAdapter";
