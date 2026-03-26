/**
 * Module: asset
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Asset domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// --- Core entity types -------------------------------------------------------

export type { File, FileStatus } from "../domain/entities/File";
export type { FileVersion, FileVersionStatus } from "../domain/entities/FileVersion";

// --- WikiBeta library entity types (transitional — owned by asset domain) ----

export type {
  WikiBetaLibrary,
  WikiBetaLibraryField,
  WikiBetaLibraryFieldType,
  WikiBetaLibraryRow,
  WikiBetaLibraryStatus,
  AddWikiBetaLibraryFieldInput,
  CreateWikiBetaLibraryInput,
  CreateWikiBetaLibraryRowInput,
} from "../domain/entities/wiki-beta-library.types";

// --- WikiBeta library use-cases (transitional) --------------------------------

import { InMemoryWikiBetaLibraryRepository } from "../infrastructure/repositories/in-memory-wiki-beta-library.repository";
import {
  addWikiBetaLibraryField as _addWikiBetaLibraryField,
  createWikiBetaLibrary as _createWikiBetaLibrary,
  createWikiBetaLibraryRow as _createWikiBetaLibraryRow,
  getWikiBetaLibrarySnapshot as _getWikiBetaLibrarySnapshot,
  listWikiBetaLibraries as _listWikiBetaLibraries,
} from "../application/use-cases/wiki-beta-libraries.use-case";
import type {
  AddWikiBetaLibraryFieldInput,
  CreateWikiBetaLibraryInput,
  CreateWikiBetaLibraryRowInput,
  WikiBetaLibrary,
  WikiBetaLibraryField,
  WikiBetaLibraryRow,
} from "../domain/entities/wiki-beta-library.types";
import type { WikiBetaLibrarySnapshot } from "../application/use-cases/wiki-beta-libraries.use-case";

export type { WikiBetaLibrarySnapshot };

const _defaultLibraryRepository = new InMemoryWikiBetaLibraryRepository();

export function addWikiBetaLibraryField(input: AddWikiBetaLibraryFieldInput): Promise<WikiBetaLibraryField> {
  return _addWikiBetaLibraryField(input, _defaultLibraryRepository);
}

export function createWikiBetaLibrary(input: CreateWikiBetaLibraryInput): Promise<WikiBetaLibrary> {
  return _createWikiBetaLibrary(input, _defaultLibraryRepository);
}

export function createWikiBetaLibraryRow(input: CreateWikiBetaLibraryRowInput): Promise<WikiBetaLibraryRow> {
  return _createWikiBetaLibraryRow(input, _defaultLibraryRepository);
}

export function getWikiBetaLibrarySnapshot(accountId: string, libraryId: string): Promise<WikiBetaLibrarySnapshot> {
  return _getWikiBetaLibrarySnapshot(accountId, libraryId, _defaultLibraryRepository);
}

export function listWikiBetaLibraries(accountId: string, workspaceId?: string): Promise<WikiBetaLibrary[]> {
  return _listWikiBetaLibraries(accountId, workspaceId, _defaultLibraryRepository);
}

// --- Document snapshot types (owned by asset) --------------------------------

export type { AssetDocument, AssetLiveDocument } from "../interfaces/hooks/useDocumentsSnapshot";
export { useDocumentsSnapshot, mapToAssetLiveDocument } from "../interfaces/hooks/useDocumentsSnapshot";

// --- Query functions ---------------------------------------------------------

export { getWorkspaceFiles } from "../interfaces/queries/file.queries";

// --- UI components (cross-module public) -------------------------------------

export { WorkspaceFilesTab } from "../interfaces/components/WorkspaceFilesTab";
export { AssetDocumentsView } from "../interfaces/components/AssetDocumentsView";
export { LibrariesView } from "../interfaces/components/LibrariesView";
export { LibraryTableView } from "../interfaces/components/LibraryTableView";
