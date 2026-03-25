/**
 * Module: content
 * Layer: api/barrel
 * Purpose: Public anti-corruption layer — the sole cross-domain entry point
 * for the Content domain.
 */

export { ContentFacade, contentFacade } from "./content-facade";
export type {
  ContentCreatePageParams,
  ContentRenamePageParams,
  ContentMovePageParams,
  ContentAddBlockParams,
  ContentUpdateBlockParams,
} from "./content-facade";

export { ContentApi } from "./content-api";

// ── WikiBeta page types (transitional — owned by content domain) ──────────────
export type {
  WikiBetaPage,
  WikiBetaPageStatus,
  WikiBetaPageTreeNode,
  CreateWikiBetaPageInput,
  RenameWikiBetaPageInput,
  MoveWikiBetaPageInput,
} from "../domain/entities/wiki-beta-page.types";

// ── WikiBeta page use-cases (transitional) ────────────────────────────────────
export {
  createWikiBetaPage,
  listWikiBetaPagesTree,
  moveWikiBetaPage,
  renameWikiBetaPage,
} from "../application/use-cases/wiki-beta-pages.use-case";

export { BlockEditorView } from "../interfaces/components/BlockEditorView";
export { useBlockEditorStore } from "../interfaces/store/block-editor.store";
export type { Block } from "../interfaces/store/block-editor.store";
export { PagesView } from "../interfaces/components/PagesView";
export { PagesDnDView } from "../interfaces/components/PagesDnDView";
