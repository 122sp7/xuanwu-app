"use client";

import { useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";

import { draggable, dropTargetForElements } from "@lib-dragdrop";
import type { BlockType, RichTextSpan } from "../../domain/value-objects/block-content";
import { richTextToPlainText } from "../../domain/value-objects/block-content";
import { TypeSelectorButton } from "./block-type-selector";

export interface BlockRowProps {
  readonly block: { id: string; content: { type: BlockType; richText: ReadonlyArray<RichTextSpan> } };
  readonly index: number;
  readonly setBlockRef: (id: string, el: HTMLDivElement | null) => void;
  readonly onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>, blockId: string) => void;
  readonly onTextChange: (text: string) => void;
  readonly onTypeChange: (type: BlockType) => void;
}

export function BlockRow({ block, setBlockRef, onKeyDown, onTextChange, onTypeChange }: BlockRowProps) {
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);

  useEffect(() => {
    const handleEl = dragHandleRef.current;
    const dropEl = dropRef.current;
    if (!handleEl || !dropEl) return;
    const cleanupDraggable = draggable({ element: handleEl, getInitialData: () => ({ blockId: block.id }) });
    const cleanupDrop = dropTargetForElements({ element: dropEl, getData: () => ({ blockId: block.id }) });
    return () => { cleanupDraggable(); cleanupDrop(); };
  }, [block.id]);

  const { type, richText } = block.content;

  if (type === "divider") {
    return (
      <div ref={dropRef} className="group flex items-center gap-1 py-1">
        <TypeSelectorButton currentType={type} open={typeMenuOpen} onOpenChange={setTypeMenuOpen} onSelect={onTypeChange} />
        <button ref={dragHandleRef} type="button" aria-label="拖曳重排" className="cursor-grab touch-none opacity-0 transition group-hover:opacity-40 hover:!opacity-100 active:cursor-grabbing">
          <GripVertical className="size-4 text-muted-foreground" />
        </button>
        <hr className="flex-1 border-t border-border/60" />
      </div>
    );
  }

  return (
    <div ref={dropRef} className="group flex items-start gap-1">
      <TypeSelectorButton currentType={type} open={typeMenuOpen} onOpenChange={setTypeMenuOpen} onSelect={onTypeChange} />
      <button ref={dragHandleRef} type="button" aria-label="拖曳重排" className="mt-1 cursor-grab touch-none opacity-0 transition group-hover:opacity-40 hover:!opacity-100 active:cursor-grabbing">
        <GripVertical className="size-4 text-muted-foreground" />
      </button>
      {type === "bullet-list" && <span className="mt-1 select-none text-sm text-foreground">•</span>}
      <div
        ref={(el) => setBlockRef(block.id, el)}
        role="textbox"
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
        onKeyDown={(e) => onKeyDown(e, block.id)}
        onInput={(e) => onTextChange(e.currentTarget.textContent ?? "")}
        data-placeholder={blockPlaceholder(type)}
        className={blockEditableClass(type)}
      >
        {richTextToPlainText(richText)}
      </div>
    </div>
  );
}

function blockEditableClass(type: BlockType): string {
  const base = "flex-1 rounded px-2 py-1 outline-none focus:bg-muted/30 empty:before:text-muted-foreground/40 empty:before:content-[attr(data-placeholder)]";
  switch (type) {
    case "heading-1": return `${base} text-3xl font-bold`;
    case "heading-2": return `${base} text-2xl font-semibold`;
    case "heading-3": return `${base} text-xl font-medium`;
    case "quote": return `${base} border-l-4 border-primary/50 pl-3 italic text-muted-foreground`;
    case "code": return `${base} font-mono text-sm bg-muted rounded`;
    case "bullet-list":
    case "numbered-list": return `${base} text-sm text-foreground`;
    default: return `${base} min-h-[1.75rem] text-sm text-foreground`;
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
