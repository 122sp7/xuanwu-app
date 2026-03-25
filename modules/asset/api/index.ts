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
