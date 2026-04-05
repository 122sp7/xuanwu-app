"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GripVertical, ChevronDown } from "lucide-react";

import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@lib-dragdrop";

import { useBlockEditorStore } from "../store/block-editor.store";
import type { BlockType } from "../../domain/value-objects/block-content";
import { BLOCK_TYPES } from "../../domain/value-objects/block-content";

/**
 * BlockEditorView
 *
 * Block-based editor with typed content (BlockContent value object).
 * Supports: text, heading-1/2/3, quote, divider, code, bullet-list, numbered-list.
 *
 * - Enter: add new block after current and focus it
 * - Backspace (empty block): delete current and focus previous
 * - Type selector: dropdown button left of drag handle
 * - Drag handle: reorder blocks via pragmatic-drag-and-drop
 */

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  "text": "T",
  "heading-1": "H1",
  "heading-2": "H2",
  "heading-3": "H3",
  "image": "🖼",
  "code": "<>",
  "bullet-list": "•",
  "numbered-list": "1.",
  "divider": "—",
  "quote": "❝",
};

const BLOCK_TYPE_NAMES: Record<BlockType, string> = {
  "text": "文字",
  "heading-1": "標題 1",
  "heading-2": "標題 2",
  "heading-3": "標題 3",
  "image": "圖片",
  "code": "程式碼",
  "bullet-list": "項目清單",
  "numbered-list": "編號清單",
  "divider": "分隔線",
  "quote": "引言",
};

export function BlockEditorView() {
  const { blocks, addBlock, updateBlock, changeBlockType, deleteBlock, moveBlock, init } =
    useBlockEditorStore();
  // focusNextRef encodes the intent:
  //   "__after:{id}" → focus the block immediately after the one with the given id
  //   "<id>"         → focus the block with the given id directly
  const focusNextRef = useRef<string | null>(null);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setBlockRef = useCallback((id: string, el: HTMLDivElement | null) => {
    blockRefs.current[id] = el;
  }, []);

  // Seed first block on mount (avoids SSR UUID mismatch)
  useEffect(() => {
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus resolution after every render
  useEffect(() => {
    const intent = focusNextRef.current;
    if (!intent) return;

    let targetId: string | undefined;
    if (intent.startsWith("__after:")) {
      const afterId = intent.slice("__after:".length);
      const idx = blocks.findIndex((b) => b.id === afterId);
      targetId = blocks[idx + 1]?.id;
    } else {
      targetId = intent;
    }

    if (targetId) {
      const el = blockRefs.current[targetId];
      if (el) {
        el.focus();
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
        focusNextRef.current = null;
      }
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
        focusNextRef.current = `__after:${blockId}`;
      } else if (event.key === "Backspace") {
        const el = blockRefs.current[blockId];
        if (!el?.textContent) {
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

  return (
    <section className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Block Editor</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">區塊編輯器</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          支援 10 種區塊類型 · Enter 換行 · Backspace 刪除空白區塊 · 拖曳重排
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
            onTextChange={(text) => updateBlock(block.id, text)}
            onTypeChange={(type) => changeBlockType(block.id, type)}
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
  readonly block: { id: string; content: { type: BlockType; text: string } };
  readonly index: number;
  readonly setBlockRef: (id: string, el: HTMLDivElement | null) => void;
  readonly onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>, blockId: string) => void;
  readonly onTextChange: (text: string) => void;
  readonly onTypeChange: (type: BlockType) => void;
}

function BlockRow({ block, setBlockRef, onKeyDown, onTextChange, onTypeChange }: BlockRowProps) {
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);

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

  const { type, text } = block.content;

  if (type === "divider") {
    return (
      <div ref={dropRef} className="group flex items-center gap-1 py-1">
        <TypeSelectorButton
          currentType={type}
          open={typeMenuOpen}
          onOpenChange={setTypeMenuOpen}
          onSelect={onTypeChange}
        />
        <button
          ref={dragHandleRef}
          type="button"
          aria-label="拖曳重排"
          className="cursor-grab touch-none opacity-0 transition group-hover:opacity-40 hover:!opacity-100 active:cursor-grabbing"
        >
          <GripVertical className="size-4 text-muted-foreground" />
        </button>
        <hr className="flex-1 border-t border-border/60" />
      </div>
    );
  }

  const editableClassName = blockEditableClass(type);

  return (
    <div ref={dropRef} className="group flex items-start gap-1">
      <TypeSelectorButton
        currentType={type}
        open={typeMenuOpen}
        onOpenChange={setTypeMenuOpen}
        onSelect={onTypeChange}
      />
      <button
        ref={dragHandleRef}
        type="button"
        aria-label="拖曳重排"
        className="mt-1 cursor-grab touch-none opacity-0 transition group-hover:opacity-40 hover:!opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="size-4 text-muted-foreground" />
      </button>

      {type === "bullet-list" && (
        <span className="mt-1 select-none text-sm text-foreground">•</span>
      )}

      <div
        ref={(el) => setBlockRef(block.id, el)}
        contentEditable
        suppressContentEditableWarning
        onKeyDown={(e) => onKeyDown(e, block.id)}
        onInput={(e) => onTextChange(e.currentTarget.textContent ?? "")}
        data-placeholder={blockPlaceholder(type)}
        className={editableClassName}
      >
        {text}
      </div>
    </div>
  );
}

function blockEditableClass(type: BlockType): string {
  const base =
    "flex-1 rounded px-2 py-1 outline-none focus:bg-muted/30 empty:before:text-muted-foreground/40 empty:before:content-[attr(data-placeholder)]";
  switch (type) {
    case "heading-1":
      return `${base} text-3xl font-bold`;
    case "heading-2":
      return `${base} text-2xl font-semibold`;
    case "heading-3":
      return `${base} text-xl font-medium`;
    case "quote":
      return `${base} border-l-4 border-primary/50 pl-3 italic text-muted-foreground`;
    case "code":
      return `${base} font-mono text-sm bg-muted rounded`;
    case "bullet-list":
    case "numbered-list":
      return `${base} text-sm text-foreground`;
    default:
      return `${base} min-h-[1.75rem] text-sm text-foreground`;
  }
}

function blockPlaceholder(type: BlockType): string {
  switch (type) {
    case "heading-1": return "標題 1";
    case "heading-2": return "標題 2";
    case "heading-3": return "標題 3";
    case "quote": return "引言…";
    case "code": return "// 程式碼";
    case "bullet-list": return "清單項目…";
    case "numbered-list": return "清單項目…";
    default: return "輸入文字…";
  }
}

interface TypeSelectorButtonProps {
  currentType: BlockType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: BlockType) => void;
}

function TypeSelectorButton({ currentType, open, onOpenChange, onSelect }: TypeSelectorButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onOpenChange]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-medium text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-muted hover:text-foreground"
        aria-label="切換區塊類型"
        title="切換區塊類型"
      >
        {BLOCK_TYPE_LABELS[currentType]}
        <ChevronDown className="size-3" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-32 rounded-md border border-border bg-popover shadow-md">
          {BLOCK_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { onSelect(t); onOpenChange(false); }}
              className={`flex w-full items-center gap-2 px-2 py-1 text-left text-xs hover:bg-muted ${t === currentType ? "font-semibold text-primary" : "text-foreground"}`}
            >
              <span className="w-5 font-mono text-[10px] text-muted-foreground">{BLOCK_TYPE_LABELS[t]}</span>
              {BLOCK_TYPE_NAMES[t]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

