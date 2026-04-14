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
export {
  uploadWorkspaceSourceFile,
} from "../../../interfaces/source/composition/workspace-files.facade";
export type {
  UploadWorkspaceSourceFileInput,
  UploadWorkspaceSourceFileResult,
} from "../../../interfaces/source/composition/workspace-files.facade";

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

// Hooks and UI components are exported from ./ui to keep this barrel semantic-only.


// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export { getWorkspaceFiles, getWorkspaceRagDocuments, getSourceFileVersions } from "../../../interfaces/source/queries/source-file.queries";

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



