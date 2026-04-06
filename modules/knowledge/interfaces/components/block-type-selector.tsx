"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

import { BLOCK_TYPES } from "../../domain/value-objects/block-content";
import type { BlockType } from "../../domain/value-objects/block-content";
import { BLOCK_TYPE_LABELS, BLOCK_TYPE_NAMES } from "./block-type-constants";

interface TypeSelectorButtonProps {
  currentType: BlockType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: BlockType) => void;
}

export function TypeSelectorButton({ currentType, open, onOpenChange, onSelect }: TypeSelectorButtonProps) {
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
