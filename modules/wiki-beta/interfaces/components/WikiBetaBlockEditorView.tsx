"use client";

import { useCallback, useEffect, useRef } from "react";
import { GripVertical } from "lucide-react";

import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@lib-dragdrop";

import { useBlockEditorStore } from "../store/block-editor.store";

/**
 * WikiBetaBlockEditorView
 *
 * Minimal block-based text editor using a Zustand store.
 * Each block is a simple textarea-like div (contentEditable).
 * - Enter: split / add new block after current
 * - Backspace (empty block): merge with previous / delete current
 * - Drag handle: reorder blocks via pragmatic-drag-and-drop
 */
export function WikiBetaBlockEditorView() {
  const { blocks, addBlock, updateBlock, deleteBlock, moveBlock } = useBlockEditorStore();
  const focusNextRef = useRef<string | null>(null);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setBlockRef = useCallback((id: string, el: HTMLDivElement | null) => {
    blockRefs.current[id] = el;
  }, []);

  // Focus management
  useEffect(() => {
    if (focusNextRef.current) {
      const el = blockRefs.current[focusNextRef.current];
      if (el) {
        el.focus();
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      focusNextRef.current = null;
    }
  });

  // Set up DnD monitor once
  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) return;
        const fromId = source.data["blockId"] as string | undefined;
        const toId = target.data["blockId"] as string | undefined;
        if (!fromId || !toId || fromId === toId) return;
        const fromIdx = blocks.findIndex((b) => b.id === fromId);
        const toIdx = blocks.findIndex((b) => b.id === toId);
        if (fromIdx !== -1 && toIdx !== -1) {
          moveBlock(fromIdx, toIdx);
        }
      },
    });
  }, [blocks, moveBlock]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>, blockId: string) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        addBlock(blockId);
        const currentIdx = blocks.findIndex((b) => b.id === blockId);
        if (currentIdx !== -1 && currentIdx + 1 < blocks.length) {
          focusNextRef.current = blocks[currentIdx + 1].id;
        } else {
          focusNextRef.current = "__last__";
        }
      } else if (event.key === "Backspace") {
        const el = blockRefs.current[blockId];
        const isEmpty = !el?.textContent;
        if (isEmpty) {
          event.preventDefault();
          const idx = blocks.findIndex((b) => b.id === blockId);
          if (idx > 0) {
            const prevId = blocks[idx - 1].id;
            deleteBlock(blockId);
            focusNextRef.current = prevId;
          }
        }
      }
    },
    [addBlock, blocks, deleteBlock],
  );

  // Resolve __last__ after render
  useEffect(() => {
    if (focusNextRef.current === "__last__" && blocks.length > 0) {
      focusNextRef.current = blocks[blocks.length - 1].id;
    }
  });

  return (
    <section className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Block Editor</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">區塊編輯器</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          極簡 Zustand 狀態管理，支援 Enter 換行、Backspace 刪除合併，以及拖曳重排。
        </p>
      </div>

      <div className="space-y-0.5">
        {blocks.map((block, idx) => (
          <BlockRow
            key={block.id}
            block={block}
            index={idx}
            setBlockRef={setBlockRef}
            onKeyDown={handleKeyDown}
            onChange={(content) => updateBlock(block.id, content)}
          />
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground/60">
        {blocks.length} 個區塊 · Enter 新增 · Backspace 刪除空白區塊 · 拖曳重排
      </p>
    </section>
  );
}

interface BlockRowProps {
  readonly block: { id: string; content: string };
  readonly index: number;
  readonly setBlockRef: (id: string, el: HTMLDivElement | null) => void;
  readonly onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>, blockId: string) => void;
  readonly onChange: (content: string) => void;
}

function BlockRow({ block, setBlockRef, onKeyDown, onChange }: BlockRowProps) {
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEl = dragHandleRef.current;
    const dropEl = dropRef.current;
    if (!handleEl || !dropEl) return;

    const cleanupDraggable = draggable({
      element: handleEl,
      getInitialData: () => ({ blockId: block.id }),
    });
    const cleanupDrop = dropTargetForElements({
      element: dropEl,
      getData: () => ({ blockId: block.id }),
    });
    return () => {
      cleanupDraggable();
      cleanupDrop();
    };
  }, [block.id]);

  return (
    <div ref={dropRef} className="group flex items-start gap-1">
      <button
        ref={dragHandleRef}
        type="button"
        aria-label="拖曳重排"
        className="mt-1 cursor-grab touch-none opacity-0 transition group-hover:opacity-40 hover:!opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="size-4 text-muted-foreground" />
      </button>

      <div
        ref={(el) => setBlockRef(block.id, el)}
        contentEditable
        suppressContentEditableWarning
        onKeyDown={(e) => onKeyDown(e, block.id)}
        onInput={(e) => onChange(e.currentTarget.textContent ?? "")}
        data-placeholder="輸入文字…"
        className="min-h-[1.75rem] flex-1 rounded px-2 py-1 text-sm text-foreground outline-none focus:bg-muted/30 empty:before:text-muted-foreground/40 empty:before:content-[attr(data-placeholder)]"
      >
        {block.content}
      </div>
    </div>
  );
}
