/**
 * Module: source
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the source domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// --- Core entity types -------------------------------------------------------

export type { File, FileStatus } from "../domain/entities/File";
export type { FileVersion, FileVersionStatus } from "../domain/entities/FileVersion";

// --- Wiki library entity types (transitional — owned by source domain) ---

export type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryFieldType,
  WikiLibraryRow,
  WikiLibraryStatus,
  AddWikiLibraryFieldInput,
  CreateWikiLibraryInput,
  CreateWikiLibraryRowInput,
} from "../domain/entities/wiki-library.types";

// --- Wiki library use-cases (transitional) --------------------------------

import { InMemoryWikiLibraryRepository } from "../infrastructure/repositories/in-memory-wiki-library.repository";
import {
  addWikiLibraryField as _addWikiLibraryField,
  createWikiLibrary as _createWikiLibrary,
  createWikiLibraryRow as _createWikiLibraryRow,
  getWikiLibrarySnapshot as _getWikiLibrarySnapshot,
  listWikiLibraries as _listWikiLibraries,
} from "../application/use-cases/wiki-libraries.use-case";
import type {
  AddWikiLibraryFieldInput,
  CreateWikiLibraryInput,
  CreateWikiLibraryRowInput,
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
} from "../domain/entities/wiki-library.types";
import type { WikiLibrarySnapshot } from "../application/use-cases/wiki-libraries.use-case";

export type { WikiLibrarySnapshot };

const _defaultLibraryRepository = new InMemoryWikiLibraryRepository();

export function addWikiLibraryField(input: AddWikiLibraryFieldInput): Promise<WikiLibraryField> {
  return _addWikiLibraryField(input, _defaultLibraryRepository);
}

export function createWikiLibrary(input: CreateWikiLibraryInput): Promise<WikiLibrary> {
  return _createWikiLibrary(input, _defaultLibraryRepository);
}

export function createWikiLibraryRow(input: CreateWikiLibraryRowInput): Promise<WikiLibraryRow> {
  return _createWikiLibraryRow(input, _defaultLibraryRepository);
}

export function getWikiLibrarySnapshot(accountId: string, libraryId: string): Promise<WikiLibrarySnapshot> {
  return _getWikiLibrarySnapshot(accountId, libraryId, _defaultLibraryRepository);
}

export function listWikiLibraries(accountId: string, workspaceId?: string): Promise<WikiLibrary[]> {
  return _listWikiLibraries(accountId, workspaceId, _defaultLibraryRepository);
}

// --- Document snapshot types --------------------------------------------------

export type {
  SourceDocument,
  SourceLiveDocument,
  AssetDocument,
  AssetLiveDocument,
} from "../interfaces/hooks/useDocumentsSnapshot";
export {
  useDocumentsSnapshot,
  mapToSourceLiveDocument,
  mapToAssetLiveDocument,
} from "../interfaces/hooks/useDocumentsSnapshot";

// --- Query functions ---------------------------------------------------------

export { getWorkspaceFiles } from "../interfaces/queries/file.queries";

// --- UI components (cross-module public) -------------------------------------

export { WorkspaceFilesTab } from "../interfaces/components/WorkspaceFilesTab";
export { SourceDocumentsView } from "../interfaces/components/AssetDocumentsView";
export { LibrariesView } from "../interfaces/components/LibrariesView";
export { LibraryTableView } from "../interfaces/components/LibraryTableView";
