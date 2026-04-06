"use client";

/**
 * Module: knowledge
 * Layer: interfaces/components
 * Purpose: PageEditorView — Firebase-connected block editor for a KnowledgePage.
 *
 * Differs from BlockEditorView (which is a standalone demo):
 * - Loads existing blocks from Firestore on mount.
 * - Persists every mutation (add / update / delete / reorder) via server actions.
 * - Uses optimistic local state so the UI stays responsive.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { GripVertical, ChevronDown, Loader2 } from "lucide-react";

import { draggable, dropTargetForElements, monitorForElements } from "@lib-dragdrop";
import { v7 as uuid } from "@lib-uuid";

import type { BlockContent, BlockType } from "../../domain/value-objects/block-content";
import { BLOCK_TYPES, emptyTextBlockContent } from "../../domain/value-objects/block-content";
import { getKnowledgeBlocks } from "../queries/knowledge.queries";
import {
  addKnowledgeBlock,
  updateKnowledgeBlock,
  deleteKnowledgeBlock,
  reorderKnowledgePageBlocks,
} from "../_actions/knowledge.actions";

// ── Constants ─────────────────────────────────────────────────────────────────

const TEMP_ID_PREFIX = "tmp-";
const UPDATE_DEBOUNCE_MS = 700;

// ── Types ─────────────────────────────────────────────────────────────────────

interface EditorBlock {
  readonly id: string; // "tmp-<uuid>" while awaiting server; real ID after
  readonly content: BlockContent;
}

// ── Block type labels / names (mirrors BlockEditorView) ───────────────────────

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

// ── Component ─────────────────────────────────────────────────────────────────

export interface PageEditorViewProps {
  accountId: string;
  pageId: string;
}

export function PageEditorView({ accountId, pageId }: PageEditorViewProps) {
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const [loading, setLoading] = useState(true);

  // Keep a ref in sync so callbacks can read current blocks without stale closures.
  const blocksRef = useRef<EditorBlock[]>([]);
  useEffect(() => { blocksRef.current = blocks; }, [blocks]);

  // Focus intent: "__after:{id}" or "{id}"
  const focusNextRef = useRef<string | null>(null);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Debounce timers per block ID for text updates.
  const debounceRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  // Latest content per block ID — needed so debounced save always uses the
  // most recent text even if the user kept typing.
  const latestContentRef = useRef(new Map<string, BlockContent>());

  const setBlockRef = useCallback((id: string, el: HTMLDivElement | null) => {
    blockRefs.current[id] = el;
  }, []);

  // ── Load from Firebase ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!accountId || !pageId) { setLoading(false); return; }
    setLoading(true);

    void (async () => {
      try {
        const firebaseBlocks = await getKnowledgeBlocks(accountId, pageId);
        if (firebaseBlocks.length === 0) {
          // Page has no blocks yet — create the first empty one.
          const content = emptyTextBlockContent();
          const result = await addKnowledgeBlock({ accountId, pageId, content, index: 0 });
          const initialId = result.success ? result.aggregateId : `${TEMP_ID_PREFIX}${uuid()}`;
          setBlocks([{ id: initialId, content }]);
        } else {
          setBlocks(firebaseBlocks.map((b) => ({ id: b.id, content: b.content })));
        }
      } catch {
        setBlocks([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [accountId, pageId]);

  // ── Focus resolution (runs after every render) ──────────────────────────────

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

  // ── DnD monitor ────────────────────────────────────────────────────────────

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) return;
        const fromId = source.data["blockId"] as string | undefined;
        const toId = target.data["blockId"] as string | undefined;
        if (!fromId || !toId || fromId === toId) return;

        const current = blocksRef.current;
        const fromIdx = current.findIndex((b) => b.id === fromId);
        const toIdx = current.findIndex((b) => b.id === toId);
        if (fromIdx === -1 || toIdx === -1) return;

        const next = [...current];
        const [moved] = next.splice(fromIdx, 1);
        if (!moved) return;
        next.splice(toIdx, 0, moved);
        setBlocks(next);

        // Persist reorder only when all blocks have real IDs.
        const hasTemp = next.some((b) => b.id.startsWith(TEMP_ID_PREFIX));
        if (!hasTemp) {
          void reorderKnowledgePageBlocks({
            accountId,
            pageId,
            blockIds: next.map((b) => b.id),
          });
        }
      },
    });
  }, [accountId, pageId]);

  // ── Mutations ───────────────────────────────────────────────────────────────

  const addBlock = useCallback((afterId?: string) => {
    const current = blocksRef.current;
    const afterIdx = afterId ? current.findIndex((b) => b.id === afterId) : current.length - 1;
    const insertIndex = afterIdx + 1;

    const tempId = `${TEMP_ID_PREFIX}${uuid()}`;
    const content = emptyTextBlockContent();

    setBlocks((prev) => {
      const next = [...prev];
      next.splice(insertIndex, 0, { id: tempId, content });
      return next;
    });

    focusNextRef.current = afterId ? `__after:${afterId}` : tempId;

    void addKnowledgeBlock({ accountId, pageId, content, index: insertIndex })
      .then((result) => {
        if (result.success) {
          setBlocks((cur) =>
            cur.map((b) => (b.id === tempId ? { ...b, id: result.aggregateId } : b)),
          );
        } else {
          setBlocks((cur) =>
            cur.length <= 1 ? cur : cur.filter((b) => b.id !== tempId),
          );
        }
      });
  }, [accountId, pageId]);

  const updateBlock = useCallback((id: string, text: string) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const newContent: BlockContent = { ...b.content, text };
        latestContentRef.current.set(id, newContent);
        return { ...b, content: newContent };
      }),
    );

    // Temp blocks: skip remote — they will be created with the right text when
    // the addKnowledgeBlock promise resolves (blocks carry the latest content).
    if (id.startsWith(TEMP_ID_PREFIX)) return;

    const existing = debounceRef.current.get(id);
    if (existing) clearTimeout(existing);

    const tid = setTimeout(() => {
      debounceRef.current.delete(id);
      const content = latestContentRef.current.get(id);
      if (content) {
        void updateKnowledgeBlock({ accountId, blockId: id, content });
      }
    }, UPDATE_DEBOUNCE_MS);

    debounceRef.current.set(id, tid);
  }, [accountId]);

  const changeBlockType = useCallback((id: string, type: BlockType) => {
    let updatedContent: BlockContent | undefined;

    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        updatedContent = { ...b.content, type };
        latestContentRef.current.set(id, updatedContent);
        return { ...b, content: updatedContent };
      }),
    );

    if (!id.startsWith(TEMP_ID_PREFIX) && updatedContent) {
      void updateKnowledgeBlock({ accountId, blockId: id, content: updatedContent });
    }
  }, [accountId]);

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      if (prev.length <= 1) {
        // Reset to empty instead of removing the last block.
        const existingId = prev[0]?.id ?? id;
        const emptyContent = emptyTextBlockContent();
        latestContentRef.current.set(existingId, emptyContent);
        if (!existingId.startsWith(TEMP_ID_PREFIX)) {
          void updateKnowledgeBlock({ accountId, blockId: existingId, content: emptyContent });
        }
        return [{ id: existingId, content: emptyContent }];
      }

      if (!id.startsWith(TEMP_ID_PREFIX)) {
        void deleteKnowledgeBlock({ accountId, blockId: id });
      }
      return prev.filter((b) => b.id !== id);
    });
  }, [accountId]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>, blockId: string) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        addBlock(blockId);
      } else if (event.key === "Backspace") {
        const el = blockRefs.current[blockId];
        if (!el?.textContent) {
          event.preventDefault();
          const idx = blocksRef.current.findIndex((b) => b.id === blockId);
          if (idx > 0) {
            const prevId = blocksRef.current[idx - 1]?.id;
            deleteBlock(blockId);
            if (prevId) focusNextRef.current = prevId;
          }
        }
      }
    },
    [addBlock, deleteBlock],
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">載入內容中…</span>
      </div>
    );
  }

  return (
    <div className="min-h-[200px] space-y-0.5">
      {blocks.map((block, idx) => (
        <ConnectedBlockRow
          key={block.id}
          block={block}
          index={idx}
          setBlockRef={setBlockRef}
          onKeyDown={handleKeyDown}
          onTextChange={(text) => updateBlock(block.id, text)}
          onTypeChange={(type) => changeBlockType(block.id, type)}
        />
      ))}
      <p className="mt-2 text-[11px] text-muted-foreground/50">
        {blocks.length} 個區塊 · Enter 新增 · Backspace 刪除空白區塊 · 拖曳重排
      </p>
    </div>
  );
}

// ── ConnectedBlockRow ─────────────────────────────────────────────────────────

interface ConnectedBlockRowProps {
  readonly block: EditorBlock;
  readonly index: number;
  readonly setBlockRef: (id: string, el: HTMLDivElement | null) => void;
  readonly onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>, blockId: string) => void;
  readonly onTextChange: (text: string) => void;
  readonly onTypeChange: (type: BlockType) => void;
}

function ConnectedBlockRow({
  block,
  setBlockRef,
  onKeyDown,
  onTextChange,
  onTypeChange,
}: ConnectedBlockRowProps) {
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
        <BlockTypeButton
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
      <BlockTypeButton
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
        role="textbox"
        tabIndex={0}
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

// ── BlockTypeButton ───────────────────────────────────────────────────────────

interface BlockTypeButtonProps {
  currentType: BlockType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: BlockType) => void;
}

function BlockTypeButton({ currentType, open, onOpenChange, onSelect }: BlockTypeButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

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
              className={`flex w-full items-center gap-2 px-2 py-1 text-left text-xs hover:bg-muted ${
                t === currentType ? "font-semibold text-primary" : "text-foreground"
              }`}
            >
              <span className="w-5 font-mono text-[10px] text-muted-foreground">
                {BLOCK_TYPE_LABELS[t]}
              </span>
              {BLOCK_TYPE_NAMES[t]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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
