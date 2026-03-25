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

export { BlockEditorView } from "../interfaces/components/BlockEditorView";
export { useBlockEditorStore } from "../interfaces/store/block-editor.store";
export type { Block } from "../interfaces/store/block-editor.store";
