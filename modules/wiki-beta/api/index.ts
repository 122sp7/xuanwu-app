/**
 * Module: wiki-beta
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the WikiBeta domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// ─── Core entity types ────────────────────────────────────────────────────────

export type {
  WikiBetaPage,
  WikiBetaPageStatus,
  WikiBetaPageTreeNode,
} from "../domain/entities/wiki-beta-page.types";

export type {
  WikiBetaLibrary,
  WikiBetaLibraryField,
  WikiBetaLibraryFieldType,
  WikiBetaLibraryRow,
  WikiBetaLibraryStatus,
} from "../domain/entities/wiki-beta-library.types";

export type {
  WikiBetaWorkspaceRef,
  WikiBetaWorkspaceContentNode,
  WikiBetaContentItemNode,
  // Document / RAG types — re-exported for use by asset and retrieval modules
  WikiBetaParsedDocument,
  WikiBetaReindexInput,
  WikiBetaCitation,
  WikiBetaRagQueryResult,
} from "../domain/entities/wiki-beta.types";

// ─── Application functions — exposed for cross-module orchestration ───────────

export {
  runWikiBetaRagQuery,
  reindexWikiBetaDocument,
  listWikiBetaParsedDocuments,
} from "../application/use-cases/wiki-beta-rag.use-case";

export {
  createWikiBetaPage,
  listWikiBetaPagesTree,
  moveWikiBetaPage,
  renameWikiBetaPage,
} from "../application/use-cases/wiki-beta-pages.use-case";

export {
  addWikiBetaLibraryField,
  createWikiBetaLibrary,
  createWikiBetaLibraryRow,
  getWikiBetaLibrarySnapshot,
  listWikiBetaLibraries,
} from "../application/use-cases/wiki-beta-libraries.use-case";

export { buildWikiBetaContentTree } from "../application/use-cases/wiki-beta-content-tree.use-case";

// ─── Additional types for page/library inputs ─────────────────────────────────

export type {
  CreateWikiBetaPageInput,
  MoveWikiBetaPageInput,
  RenameWikiBetaPageInput,
} from "../domain/entities/wiki-beta-page.types";

export type {
  AddWikiBetaLibraryFieldInput,
  CreateWikiBetaLibraryInput,
  CreateWikiBetaLibraryRowInput,
} from "../domain/entities/wiki-beta-library.types";

export type {
  WikiBetaAccountContentNode,
  WikiBetaAccountSeed,
} from "../domain/entities/wiki-beta.types";

// ─── UI components ────────────────────────────────────────────────────────────

export { WikiBetaWorkspaceView } from "../interfaces/components/WikiBetaWorkspaceView";
