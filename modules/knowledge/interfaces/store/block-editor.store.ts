"use client";

import { create } from "@lib-zustand";
import { v7 as uuid } from "@lib-uuid";

export interface Block {
  readonly id: string;
  readonly content: string;
}

interface BlockEditorState {
  readonly blocks: Block[];
  readonly addBlock: (afterId?: string) => void;
  readonly updateBlock: (id: string, content: string) => void;
  readonly deleteBlock: (id: string) => void;
  readonly moveBlock: (fromIdx: number, toIdx: number) => void;
  readonly init: () => void;
}

export const useBlockEditorStore = create<BlockEditorState>((set) => ({
  // Start empty — component calls init() on mount to avoid SSR UUID mismatch.
  blocks: [],

  init() {
    set((state) => {
      if (state.blocks.length > 0) return state;
      return { blocks: [{ id: uuid(), content: "" }] };
    });
  },

  addBlock(afterId) {
    set((state) => {
      const newBlock: Block = { id: uuid(), content: "" };
      if (!afterId) {
        return { blocks: [...state.blocks, newBlock] };
      }
      const idx = state.blocks.findIndex((b) => b.id === afterId);
      const next = [...state.blocks];
      next.splice(idx + 1, 0, newBlock);
      return { blocks: next };
    });
  },

  updateBlock(id, content) {
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, content } : b)),
    }));
  },

  deleteBlock(id) {
    set((state) => {
      if (state.blocks.length <= 1) {
        return { blocks: [{ id: state.blocks[0]?.id ?? uuid(), content: "" }] };
      }
      return { blocks: state.blocks.filter((b) => b.id !== id) };
    });
  },

  moveBlock(fromIdx, toIdx) {
    set((state) => {
      const next = [...state.blocks];
      const [moved] = next.splice(fromIdx, 1);
      if (!moved) return state;
      next.splice(toIdx, 0, moved);
      return { blocks: next };
    });
  },
}));
