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

export type { WikiBetaLibrarySnapshot } from "../application/use-cases/wiki-beta-libraries.use-case";
export {
  addWikiBetaLibraryField,
  createWikiBetaLibrary,
  createWikiBetaLibraryRow,
  getWikiBetaLibrarySnapshot,
  listWikiBetaLibraries,
} from "../application/use-cases/wiki-beta-libraries.use-case";

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
