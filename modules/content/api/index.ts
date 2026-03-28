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

// ── Wiki page types (transitional — owned by content domain) ──────────────
export type {
  WikiPage,
  WikiPageStatus,
  WikiPageTreeNode,
  CreateWikiPageInput,
  RenameWikiPageInput,
  MoveWikiPageInput,
} from "../domain/entities/wiki-page.types";

// ── Wiki page use-cases (transitional) ────────────────────────────────────
import { FirebaseWikiPageRepository } from "../infrastructure/repositories/firebase-wiki-page.repository";
import {
  createWikiPage as _createWikiPage,
  listWikiPagesTree as _listWikiPagesTree,
  moveWikiPage as _moveWikiPage,
  renameWikiPage as _renameWikiPage,
} from "../application/use-cases/wiki-pages.use-case";
import type {
  CreateWikiPageInput,
  MoveWikiPageInput,
  RenameWikiPageInput,
  WikiPage,
  WikiPageTreeNode,
} from "../domain/entities/wiki-page.types";

const _defaultPageRepository = new FirebaseWikiPageRepository();

export function createWikiPage(input: CreateWikiPageInput): Promise<WikiPage> {
  return _createWikiPage(input, _defaultPageRepository);
}

export function listWikiPagesTree(accountId: string, workspaceId?: string): Promise<WikiPageTreeNode[]> {
  return _listWikiPagesTree(accountId, workspaceId, _defaultPageRepository);
}

export function moveWikiPage(input: MoveWikiPageInput): Promise<WikiPage> {
  return _moveWikiPage(input, _defaultPageRepository);
}

export function renameWikiPage(input: RenameWikiPageInput): Promise<WikiPage> {
  return _renameWikiPage(input, _defaultPageRepository);
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
