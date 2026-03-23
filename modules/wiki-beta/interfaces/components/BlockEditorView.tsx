"use client";

/**
 * BlockEditorView.tsx
 * Purpose: Notion-like block editor UI for wiki-beta pages.
 * Responsibilities: render blocks, handle keyboard input, slash command menu.
 * Constraints: client-only; state managed via useBlockEditorStore (Zustand).
 */

import { useEffect, useRef, useCallback } from "react";
import {
  GripVertical,
  Plus,
  Type,
  Hash,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Trash2,
} from "lucide-react";

import {
  type Block,
  type BlockType,
  useBlockEditorStore,
} from "../store/block-editor.store";

// ── Slash command menu items ───────────────────────────────────────────────

interface SlashMenuItem {
  type: BlockType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SLASH_MENU_ITEMS: SlashMenuItem[] = [
  { type: "paragraph", label: "段落", description: "純文字段落", icon: Type },
  { type: "heading1", label: "標題 1", description: "大標題", icon: Hash },
  { type: "heading2", label: "標題 2", description: "中標題", icon: Hash },
  { type: "heading3", label: "標題 3", description: "小標題", icon: Hash },
  { type: "bulletList", label: "項目符號清單", description: "無序清單", icon: List },
  { type: "numberedList", label: "編號清單", description: "有序清單", icon: ListOrdered },
  { type: "quote", label: "引用", description: "引用區塊", icon: Quote },
  { type: "code", label: "程式碼", description: "程式碼區塊", icon: Code2 },
  { type: "divider", label: "分隔線", description: "水平分隔", icon: Minus },
];

// ── Block renderer helpers ─────────────────────────────────────────────────

function blockPlaceholder(type: BlockType): string {
  switch (type) {
    case "heading1": return "標題 1";
    case "heading2": return "標題 2";
    case "heading3": return "標題 3";
    case "bulletList": return "清單項目";
    case "numberedList": return "清單項目";
    case "quote": return "引用內容…";
    case "code": return "程式碼…";
    default: return "輸入 '/' 插入區塊，或開始輸入…";
  }
}

function blockClassName(type: BlockType): string {
  switch (type) {
    case "heading1": return "text-2xl font-bold tracking-tight text-foreground";
    case "heading2": return "text-xl font-semibold tracking-tight text-foreground";
    case "heading3": return "text-base font-semibold text-foreground";
    case "bulletList": return "text-sm text-foreground before:content-['•'] before:mr-2 before:text-muted-foreground";
    case "numberedList": return "text-sm text-foreground";
    case "quote": return "border-l-2 border-primary/60 pl-3 italic text-muted-foreground text-sm";
    case "code": return "font-mono text-sm bg-muted/50 rounded px-2 py-1 text-foreground";
    default: return "text-sm text-foreground";
  }
}

// ── Slash command dropdown ─────────────────────────────────────────────────

interface SlashMenuProps {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  filter: string;
}

function SlashMenu({ onSelect, onClose, filter }: SlashMenuProps) {
  const filtered = filter
    ? SLASH_MENU_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(filter.toLowerCase()) ||
          item.description.toLowerCase().includes(filter.toLowerCase()),
      )
    : SLASH_MENU_ITEMS;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (filtered.length === 0) return null;

  return (
    <div
      role="menu"
      aria-label="區塊類型選單"
      className="absolute left-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-xl border border-border/60 bg-popover shadow-lg"
    >
      <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        插入區塊
      </p>
      {filtered.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.type}
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted"
            onClick={() => onSelect(item.type)}
          >
            <Icon className="size-4 shrink-0 text-muted-foreground" />
            <span>
              <span className="font-medium text-foreground">{item.label}</span>
              <span className="ml-2 text-xs text-muted-foreground">{item.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Individual block row ───────────────────────────────────────────────────

interface BlockRowProps {
  block: Block;
  index: number;
  isFocused: boolean;
  isSlashMenuOpen: boolean;
  slashFilter: string;
}

function BlockRow({
  block,
  index,
  isFocused,
  isSlashMenuOpen,
  slashFilter,
}: BlockRowProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    updateBlockContent,
    addBlock,
    deleteBlock,
    changeBlockType,
    setFocusedBlock,
    openSlashMenu,
    closeSlashMenu,
    blocks,
  } = useBlockEditorStore();

  // Auto-focus when this block gains focus
  useEffect(() => {
    if (isFocused && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isFocused]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [block.content]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const { key, shiftKey } = e;

      if (key === "Enter" && !shiftKey) {
        e.preventDefault();
        addBlock(block.id, "paragraph");
        closeSlashMenu();
        return;
      }

      if (key === "Backspace" && block.content === "" && blocks.length > 1) {
        e.preventDefault();
        deleteBlock(block.id);
        return;
      }

      if (key === "/") {
        openSlashMenu(block.id);
        return;
      }

      if (key === "Escape") {
        closeSlashMenu();
        return;
      }
    },
    [addBlock, block.id, block.content, blocks.length, closeSlashMenu, deleteBlock, openSlashMenu],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      updateBlockContent(block.id, value);

      // Detect slash command
      if (value.endsWith("/")) {
        openSlashMenu(block.id);
      } else if (isSlashMenuOpen) {
        const slashIdx = value.lastIndexOf("/");
        if (slashIdx === -1) {
          closeSlashMenu();
        }
      }
    },
    [block.id, closeSlashMenu, isSlashMenuOpen, openSlashMenu, updateBlockContent],
  );

  function handleSlashMenuSelect(type: BlockType) {
    // Remove the trailing slash from content
    const slashIdx = block.content.lastIndexOf("/");
    const cleaned = slashIdx !== -1 ? block.content.slice(0, slashIdx) : block.content;
    updateBlockContent(block.id, cleaned);
    changeBlockType(block.id, type);
    closeSlashMenu();
  }

  if (block.type === "divider") {
    return (
      <div className="group relative flex items-center gap-2 py-2">
        <div className="drag-handle flex size-6 shrink-0 cursor-grab items-center justify-center rounded opacity-0 transition group-hover:opacity-100">
          <GripVertical className="size-3 text-muted-foreground" />
        </div>
        <hr className="flex-1 border-border/60" />
        <button
          type="button"
          aria-label="刪除分隔線"
          onClick={() => deleteBlock(block.id)}
          className="flex size-6 shrink-0 items-center justify-center rounded opacity-0 transition hover:bg-muted hover:text-destructive group-hover:opacity-100"
        >
          <Trash2 className="size-3" />
        </button>
      </div>
    );
  }

  const displayIndex = block.type === "numberedList" ? index + 1 : null;

  return (
    <div
      className="group relative flex items-start gap-2 rounded-md py-0.5 hover:bg-muted/30"
      data-block-id={block.id}
    >
      {/* Drag handle */}
      <button
        type="button"
        aria-label="拖曳移動區塊"
        className="drag-handle mt-1 flex size-6 shrink-0 cursor-grab items-center justify-center rounded opacity-0 transition hover:bg-muted group-hover:opacity-100"
      >
        <GripVertical className="size-3 text-muted-foreground" />
      </button>

      {/* Add block button */}
      <button
        type="button"
        aria-label="在此之後新增區塊"
        onClick={() => addBlock(block.id, "paragraph")}
        className="mt-1 flex size-6 shrink-0 items-center justify-center rounded opacity-0 transition hover:bg-muted group-hover:opacity-100"
      >
        <Plus className="size-3 text-muted-foreground" />
      </button>

      {/* Numbered list counter */}
      {displayIndex !== null && (
        <span className="mt-1.5 shrink-0 text-sm text-muted-foreground">{displayIndex}.</span>
      )}

      {/* Content area */}
      <div className="relative min-w-0 flex-1">
        <textarea
          ref={textareaRef}
          rows={1}
          value={block.content}
          placeholder={blockPlaceholder(block.type)}
          aria-label={`區塊 ${index + 1} 內容`}
          className={`w-full resize-none bg-transparent outline-none placeholder:text-muted-foreground/50 ${blockClassName(block.type)}`}
          onFocus={() => setFocusedBlock(block.id)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        {/* Slash command menu */}
        {isSlashMenuOpen && (
          <SlashMenu
            onSelect={handleSlashMenuSelect}
            onClose={closeSlashMenu}
            filter={slashFilter}
          />
        )}
      </div>

      {/* Delete button */}
      <button
        type="button"
        aria-label="刪除此區塊"
        onClick={() => deleteBlock(block.id)}
        className="mt-1 flex size-6 shrink-0 items-center justify-center rounded opacity-0 transition hover:bg-muted hover:text-destructive group-hover:opacity-100"
      >
        <Trash2 className="size-3" />
      </button>
    </div>
  );
}

// ── Main BlockEditorView ───────────────────────────────────────────────────

interface BlockEditorViewProps {
  /** Page ID for this editor instance. */
  pageId: string;
  /** Initial blocks to load (optional, defaults to one empty paragraph). */
  initialBlocks?: Block[];
}

export function BlockEditorView({ pageId, initialBlocks }: BlockEditorViewProps) {
  const {
    blocks,
    focusedBlockId,
    slashMenuOpen,
    slashMenuBlockId,
    initPage,
    addBlock,
  } = useBlockEditorStore();

  useEffect(() => {
    const seed = initialBlocks ?? [
      { id: "blk_seed", type: "paragraph" as BlockType, content: "", sortOrder: 0 },
    ];
    initPage(pageId, seed);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  function getSlashFilter(blockId: string): string {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return "";
    const slashIdx = block.content.lastIndexOf("/");
    return slashIdx !== -1 ? block.content.slice(slashIdx + 1) : "";
  }

  return (
    <div
      className="mx-auto w-full max-w-3xl px-2 py-4"
      onClick={(e) => {
        // Click on empty area below blocks → add a new block
        const target = e.target as HTMLElement;
        if (target === e.currentTarget) {
          addBlock(blocks.at(-1)?.id ?? null, "paragraph");
        }
      }}
      aria-label="區塊編輯器"
    >
      {blocks.length === 0 ? (
        <button
          type="button"
          className="w-full rounded-md border border-dashed border-border/60 p-8 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          onClick={() => addBlock(null, "paragraph")}
        >
          點擊或按下 Enter 開始編輯…
        </button>
      ) : (
        <div className="space-y-0.5">
          {blocks.map((block, index) => (
            <BlockRow
              key={block.id}
              block={block}
              index={index}
              isFocused={focusedBlockId === block.id}
              isSlashMenuOpen={slashMenuOpen && slashMenuBlockId === block.id}
              slashFilter={slashMenuOpen && slashMenuBlockId === block.id ? getSlashFilter(block.id) : ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}
