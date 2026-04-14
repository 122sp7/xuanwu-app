/**
 * notebooklm/source UI surface.
 * UI consumers should import from this file instead of the semantic api barrel.
 */

export type {
  UseSourceDocumentsSnapshotResult,
} from "../../../interfaces/source/hooks/useSourceDocumentsSnapshot";
export {
  useSourceDocumentsSnapshot,
} from "../../../interfaces/source/hooks/useSourceDocumentsSnapshot";

export { SourceDocumentsPanel } from "../../../interfaces/source/components/SourceDocumentsPanel";
export { WorkspaceFilesTab } from "../../../interfaces/source/components/WorkspaceFilesTab";
export { LibrariesPanel } from "../../../interfaces/source/components/LibrariesPanel";
export { LibraryTablePanel } from "../../../interfaces/source/components/LibraryTablePanel";
export { FileProcessingDialog } from "../../../interfaces/source/components/FileProcessingDialog";
