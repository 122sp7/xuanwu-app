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
import { FirebaseWikiBetaPageRepository } from "../infrastructure/repositories/firebase-wiki-beta-page.repository";
import {
  createWikiBetaPage as _createWikiBetaPage,
  listWikiBetaPagesTree as _listWikiBetaPagesTree,
  moveWikiBetaPage as _moveWikiBetaPage,
  renameWikiBetaPage as _renameWikiBetaPage,
} from "../application/use-cases/wiki-beta-pages.use-case";
import type {
  CreateWikiBetaPageInput,
  MoveWikiBetaPageInput,
  RenameWikiBetaPageInput,
  WikiBetaPage,
  WikiBetaPageTreeNode,
} from "../domain/entities/wiki-beta-page.types";

const _defaultPageRepository = new FirebaseWikiBetaPageRepository();

export function createWikiBetaPage(input: CreateWikiBetaPageInput): Promise<WikiBetaPage> {
  return _createWikiBetaPage(input, _defaultPageRepository);
}

export function listWikiBetaPagesTree(accountId: string, workspaceId?: string): Promise<WikiBetaPageTreeNode[]> {
  return _listWikiBetaPagesTree(accountId, workspaceId, _defaultPageRepository);
}

export function moveWikiBetaPage(input: MoveWikiBetaPageInput): Promise<WikiBetaPage> {
  return _moveWikiBetaPage(input, _defaultPageRepository);
}

export function renameWikiBetaPage(input: RenameWikiBetaPageInput): Promise<WikiBetaPage> {
  return _renameWikiBetaPage(input, _defaultPageRepository);
}

export { BlockEditorView } from "../interfaces/components/BlockEditorView";
export { useBlockEditorStore } from "../interfaces/store/block-editor.store";
export type { Block } from "../interfaces/store/block-editor.store";
export { PagesView } from "../interfaces/components/PagesView";
export { PagesDnDView } from "../interfaces/components/PagesDnDView";

// ── Server Actions (write-side) ───────────────────────────────────────────────

export {
  createContentPage,
  renameContentPage,
  moveContentPage,
  archiveContentPage,
  reorderContentPageBlocks,
  addContentBlock,
  updateContentBlock,
  deleteContentBlock,
  publishContentVersion,
  approveContentPage,
} from "../interfaces/_actions/content.actions";

export type { ApproveContentPageDto } from "../application/dto/content.dto";

// ── Public event contracts ────────────────────────────────────────────────────

export {
  CONTENT_EVENT_TYPES,
} from "./events";

export type {
  ContentPageApprovedEvent,
  ContentDomainEvent,
  ExtractedTask,
  ExtractedInvoice,
  ContentEventType,
} from "./events";
