/**
 * Module: wiki-beta
 * Layer: api/barrel
 * Purpose: Transitional cross-module facade — all domain logic has been moved
 *          to canonical bounded-context modules. This barrel re-exports from
 *          those modules so existing consumers continue to compile unchanged.
 *
 * Ownership map:
 *   pages / page types       → modules/content
 *   libraries / library types → modules/asset
 *   RAG / citation types      → modules/retrieval
 *   content-tree types        → modules/workspace
 *   WikiBetaOverviewView      → wiki-beta (consumes workspace API)
 *   WikiBetaWorkspaceView     → wiki-beta (consumes retrieval API)
 */

// ─── Page types + use-cases (now owned by modules/content) ───────────────────

export type {
  WikiBetaPage,
  WikiBetaPageStatus,
  WikiBetaPageTreeNode,
  CreateWikiBetaPageInput,
  MoveWikiBetaPageInput,
  RenameWikiBetaPageInput,
} from "@/modules/content/api";

export {
  createWikiBetaPage,
  listWikiBetaPagesTree,
  moveWikiBetaPage,
  renameWikiBetaPage,
} from "@/modules/content/api";

// ─── Library types + use-cases (now owned by modules/asset) ──────────────────

export type {
  WikiBetaLibrary,
  WikiBetaLibraryField,
  WikiBetaLibraryFieldType,
  WikiBetaLibraryRow,
  WikiBetaLibraryStatus,
  AddWikiBetaLibraryFieldInput,
  CreateWikiBetaLibraryInput,
  CreateWikiBetaLibraryRowInput,
  WikiBetaLibrarySnapshot,
} from "@/modules/asset/api";

export {
  addWikiBetaLibraryField,
  createWikiBetaLibrary,
  createWikiBetaLibraryRow,
  getWikiBetaLibrarySnapshot,
  listWikiBetaLibraries,
} from "@/modules/asset/api";

// ─── RAG types + use-cases (now owned by modules/retrieval) ──────────────────

export type {
  WikiBetaCitation,
  WikiBetaParsedDocument,
  WikiBetaRagQueryResult,
  WikiBetaReindexInput,
} from "@/modules/retrieval/api";

export {
  runWikiBetaRagQuery,
  reindexWikiBetaDocument,
  listWikiBetaParsedDocuments,
} from "@/modules/retrieval/api";

// ─── Content-tree types + use-case (now owned by modules/workspace) ───────────

export type {
  WikiBetaAccountContentNode,
  WikiBetaAccountSeed,
  WikiBetaAccountType,
  WikiBetaContentItemNode,
  WikiBetaWorkspaceContentNode,
  WikiBetaWorkspaceRef,
} from "@/modules/workspace/api";

export { buildWikiBetaContentTree } from "@/modules/workspace/api";

// ─── UI components ────────────────────────────────────────────────────────────

// wiki-beta-native components (still live in this module)
export { WikiBetaWorkspaceView } from "../interfaces/components/WikiBetaWorkspaceView";
export { WikiBetaOverviewView } from "../interfaces/components/WikiBetaOverviewView";

// Transitional re-exports — delegate to canonical bounded-context modules
export { WikiBetaBlockEditorView } from "../interfaces/components/WikiBetaBlockEditorView";
export { WikiBetaDocumentsView } from "../interfaces/components/WikiBetaDocumentsView";
export { WikiBetaLibrariesView } from "../interfaces/components/WikiBetaLibrariesView";
export { WikiBetaLibraryTableView } from "../interfaces/components/WikiBetaLibraryTableView";
export { WikiBetaPagesDnDView } from "../interfaces/components/WikiBetaPagesDnDView";
export { WikiBetaPagesView } from "../interfaces/components/WikiBetaPagesView";
export { WikiBetaRagQueryView } from "../interfaces/components/WikiBetaRagQueryView";
export { WikiBetaRagView } from "../interfaces/components/WikiBetaRagView";
