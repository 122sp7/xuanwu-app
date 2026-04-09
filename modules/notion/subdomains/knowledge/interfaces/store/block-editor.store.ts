/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/store
 * Purpose: Zustand store for the block editor UI state.
 *          Manages optimistic block operations before persistence.
 */
"use client";

import { create } from "zustand";
import type { BlockContent } from "../../../../core/domain/value-objects/BlockContent";

export interface EditorBlock {
  id: string;
  content: BlockContent;
  order: number;
  parentBlockId: string | null;
  isFocused: boolean;
}

interface BlockEditorState {
  pageId: string | null;
  accountId: string | null;
  blocks: EditorBlock[];
  isDirty: boolean;

  setPage: (accountId: string, pageId: string) => void;
  setBlocks: (blocks: EditorBlock[]) => void;
  addBlock: (after: string | null, content?: BlockContent) => EditorBlock;
  updateBlock: (id: string, content: BlockContent) => void;
  deleteBlock: (id: string) => void;
  reorder: (ids: string[]) => void;
  clearDirty: () => void;
}

function makeId() {
  return crypto.randomUUID();
}

export const useBlockEditorStore = create<BlockEditorState>((set, get) => ({
  pageId: null,
  accountId: null,
  blocks: [],
  isDirty: false,

  setPage(accountId, pageId) {
    set({ accountId, pageId, blocks: [], isDirty: false });
  },

  setBlocks(blocks) {
    set({ blocks, isDirty: false });
  },

  addBlock(afterId, content = { type: "text", richText: [] }) {
    const blocks = [...get().blocks];
    const idx = afterId ? blocks.findIndex((b) => b.id === afterId) : blocks.length - 1;
    const newBlock: EditorBlock = {
      id: makeId(),
      content,
      order: idx + 1,
      parentBlockId: null,
      isFocused: true,
    };
    const updated = [
      ...blocks.slice(0, idx + 1),
      newBlock,
      ...blocks.slice(idx + 1).map((b) => ({ ...b, order: b.order + 1 })),
    ];
    set({ blocks: updated, isDirty: true });
    return newBlock;
  },

  updateBlock(id, content) {
    set({
      blocks: get().blocks.map((b) => (b.id === id ? { ...b, content } : b)),
      isDirty: true,
    });
  },

  deleteBlock(id) {
    set({
      blocks: get().blocks.filter((b) => b.id !== id),
      isDirty: true,
    });
  },

  reorder(ids) {
    const map = new Map(get().blocks.map((b) => [b.id, b]));
    const reordered = ids
      .map((id, i) => {
        const b = map.get(id);
        return b ? { ...b, order: i } : null;
      })
      .filter((b): b is EditorBlock => b !== null);
    set({ blocks: reordered, isDirty: true });
  },

  clearDirty() {
    set({ isDirty: false });
  },
}));
