"use client";

import { PanelLeftClose, SlidersHorizontal } from "lucide-react";

interface ShellSidebarHeaderProps {
  sectionLabel: string;
  sectionIcon: React.ReactNode;
  onOpenCustomize: () => void;
  onToggleCollapsed: () => void;
}

export function ShellSidebarHeader({
  sectionLabel,
  sectionIcon,
  onOpenCustomize,
  onToggleCollapsed,
}: ShellSidebarHeaderProps) {
  return (
    <div className="flex shrink-0 items-center border-b border-border/40 px-2 py-1.5">
      <span className="flex flex-1 items-center gap-1.5 px-1 text-[11px] font-semibold tracking-tight text-foreground/80">
        {sectionIcon}
        {sectionLabel}
      </span>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          title="設定"
          aria-label="設定"
          onClick={onOpenCustomize}
          className="flex size-6 items-center justify-center rounded text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
        >
          <SlidersHorizontal className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label="收起側欄"
          title="收起側欄"
          className="flex size-6 items-center justify-center rounded text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
        >
          <PanelLeftClose className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
