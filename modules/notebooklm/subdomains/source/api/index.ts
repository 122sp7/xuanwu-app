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
// Wiki library use cases (pre-wired facade from composition layer)
// ---------------------------------------------------------------------------

export type { WikiLibrarySnapshot } from "../application/use-cases/wiki-library.use-cases";

export {
  listWikiLibraries,
  createWikiLibrary,
  addWikiLibraryField,
  createWikiLibraryRow,
  getWikiLibrarySnapshot,
} from "../../../interfaces/source/composition/wiki-library-facade";

// ---------------------------------------------------------------------------
// Live document DTOs
// ---------------------------------------------------------------------------

export type {
  SourceDocument,
  SourceLiveDocument,
  AssetDocument,
  AssetLiveDocument,
} from "../application/dto/source-live-document.dto";
export {
  mapToSourceLiveDocument,
  mapToAssetLiveDocument,
} from "../application/dto/source-live-document.dto";

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export type {
  UseSourceDocumentsSnapshotResult,
} from "../../../interfaces/source/hooks/useSourceDocumentsSnapshot";
export {
  useSourceDocumentsSnapshot,
} from "../../../interfaces/source/hooks/useSourceDocumentsSnapshot";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export { getWorkspaceFiles, getWorkspaceRagDocuments } from "../../../interfaces/source/queries/source-file.queries";

// ---------------------------------------------------------------------------
// Server actions
// ---------------------------------------------------------------------------

export {
  uploadInitFile,
  uploadCompleteFile,
  registerUploadedRagDocument,
  deleteSourceDocument,
  renameSourceDocument,
} from "../../../interfaces/source/_actions/source-file.actions";

export {
  createKnowledgeDraftFromSourceDocument,
  processSourceDocumentWorkflow,
} from "../../../interfaces/source/_actions/source-processing.actions";
export type {
  SourceProcessingExecutionSummary,
  SourceProcessingTaskResult,
  SourceProcessingTaskStatus,
} from "../application/dto/source-processing.dto";

// ---------------------------------------------------------------------------
// UI components
// ---------------------------------------------------------------------------

export { SourceDocumentsPanel } from "../../../interfaces/source/components/SourceDocumentsPanel";
export { WorkspaceFilesTab } from "../../../interfaces/source/components/WorkspaceFilesTab";
export { LibrariesPanel } from "../../../interfaces/source/components/LibrariesPanel";
export { LibraryTablePanel } from "../../../interfaces/source/components/LibraryTablePanel";
export { FileProcessingDialog } from "../../../interfaces/source/components/FileProcessingDialog";

