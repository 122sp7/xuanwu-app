/**
 * block-editor.store.ts
 * Purpose: Zustand store for block-based editor state management.
 * Responsibilities: block CRUD, selection, cursor tracking, and reordering.
 * Constraints: client-only; no server-side imports.
 */

import { create } from "zustand";

// ── Block type definitions ─────────────────────────────────────────────────

export type BlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bulletList"
  | "numberedList"
  | "quote"
  | "code"
  | "divider"
  | "image";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  /** Optional language for code blocks. */
  language?: string;
  /** Sort order within the page; lower values render first. */
  sortOrder: number;
}

// ── Store state & actions ──────────────────────────────────────────────────

export interface BlockEditorState {
  /** The page ID this editor instance belongs to. */
  pageId: string | null;
  blocks: Block[];
  /** The block ID that currently has focus (cursor). */
  focusedBlockId: string | null;
  /** Whether the slash-command menu is open. */
  slashMenuOpen: boolean;
  /** The block ID that triggered the slash menu. */
  slashMenuBlockId: string | null;

  // ── Actions ──────────────────────────────────────────────────────────────

  /** Load blocks for a page, replacing any existing state. */
  initPage: (pageId: string, blocks: Block[]) => void;

  /** Add a new block after the given block ID (or at end if null). */
  addBlock: (afterBlockId: string | null, type: BlockType) => string;

  /** Update a block's content. */
  updateBlockContent: (blockId: string, content: string) => void;

  /** Change a block's type. */
  changeBlockType: (blockId: string, type: BlockType) => void;

  /** Delete a block by ID. */
  deleteBlock: (blockId: string) => void;

  /** Move a block from one position to another (by index). */
  moveBlock: (fromIndex: number, toIndex: number) => void;

  /** Set the focused block. */
  setFocusedBlock: (blockId: string | null) => void;

  /** Toggle the slash command menu. */
  openSlashMenu: (blockId: string) => void;
  closeSlashMenu: () => void;

  /** Reset the entire editor state. */
  reset: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function generateId(): string {
  return `blk_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

const INITIAL_STATE = {
  pageId: null,
  blocks: [] as Block[],
  focusedBlockId: null,
  slashMenuOpen: false,
  slashMenuBlockId: null,
} as const;

// ── Store ─────────────────────────────────────────────────────────────────

export const useBlockEditorStore = create<BlockEditorState>((set) => ({
  ...INITIAL_STATE,

  initPage(pageId, blocks) {
    const sorted = [...blocks].sort((a, b) => a.sortOrder - b.sortOrder);
    set({ pageId, blocks: sorted, focusedBlockId: null });
  },

  addBlock(afterBlockId, type) {
    const newId = generateId();
    set((state) => {
      const insertAfterIndex =
        afterBlockId == null
          ? state.blocks.length - 1
          : state.blocks.findIndex((b) => b.id === afterBlockId);

      const insertAt = insertAfterIndex === -1 ? state.blocks.length : insertAfterIndex + 1;

      const newBlock: Block = {
        id: newId,
        type,
        content: "",
        sortOrder: insertAt,
      };

      const updated = [
        ...state.blocks.slice(0, insertAt),
        newBlock,
        ...state.blocks.slice(insertAt),
      ].map((b, i) => ({ ...b, sortOrder: i }));

      return { blocks: updated, focusedBlockId: newId };
    });
    return newId;
  },

  updateBlockContent(blockId, content) {
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === blockId ? { ...b, content } : b,
      ),
    }));
  },

  changeBlockType(blockId, type) {
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === blockId ? { ...b, type } : b,
      ),
    }));
  },

  deleteBlock(blockId) {
    set((state) => {
      const index = state.blocks.findIndex((b) => b.id === blockId);
      const filtered = state.blocks
        .filter((b) => b.id !== blockId)
        .map((b, i) => ({ ...b, sortOrder: i }));

      const nextFocusId =
        filtered[Math.max(0, index - 1)]?.id ?? filtered[0]?.id ?? null;

      return { blocks: filtered, focusedBlockId: nextFocusId };
    });
  },

  moveBlock(fromIndex, toIndex) {
    set((state) => {
      if (
        fromIndex < 0 ||
        fromIndex >= state.blocks.length ||
        toIndex < 0 ||
        toIndex >= state.blocks.length ||
        fromIndex === toIndex
      ) {
        return {};
      }

      const updated = [...state.blocks];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return {
        blocks: updated.map((b, i) => ({ ...b, sortOrder: i })),
      };
    });
  },

  setFocusedBlock(blockId) {
    set({ focusedBlockId: blockId });
  },

  openSlashMenu(blockId) {
    set({ slashMenuOpen: true, slashMenuBlockId: blockId });
  },

  closeSlashMenu() {
    set({ slashMenuOpen: false, slashMenuBlockId: null });
  },

  reset() {
    set({ ...INITIAL_STATE });
  },
}));
