"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, FolderOpen, Layers } from "lucide-react";

import type { CategorySnapshot as Category } from "@/modules/notion/api";

// ── Category tree helpers ────────────────────────────────────────────────────

export interface CategoryNode extends Category {
  children: CategoryNode[];
}

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>();
  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] });
  }
  const roots: CategoryNode[] = [];
  for (const node of map.values()) {
    if (node.parentCategoryId) {
      map.get(node.parentCategoryId)?.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

// ── Category tree panel ──────────────────────────────────────────────────────

interface CategoryTreePanelProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryTreePanel({ categories, selectedId, onSelect }: CategoryTreePanelProps) {
  const roots = useMemo(() => buildCategoryTree(categories), [categories]);

  return (
    <aside className="w-52 shrink-0 space-y-1">
      <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        分類
      </p>
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
          selectedId === null
            ? "bg-primary/10 text-primary font-medium"
            : "text-foreground hover:bg-muted"
        }`}
      >
        <Layers className="size-3.5 shrink-0 text-muted-foreground" />
        全部文章
      </button>
      {roots.map((node) => (
        <CategoryNodeRow
          key={node.id}
          node={node}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
      {categories.length === 0 && (
        <p className="px-2 text-xs text-muted-foreground/60">尚無分類</p>
      )}
    </aside>
  );
}

interface CategoryNodeRowProps {
  node: CategoryNode;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function CategoryNodeRow({ node, selectedId, onSelect }: CategoryNodeRowProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="p-0.5 text-muted-foreground opacity-0 transition hover:opacity-100"
          style={{ visibility: hasChildren ? "visible" : "hidden" }}
          aria-label={expanded ? "折疊" : "展開"}
        >
          {expanded ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
        </button>
        <button
          type="button"
          onClick={() => onSelect(node.id)}
          className={`flex flex-1 items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors ${
            isSelected
              ? "bg-primary/10 text-primary font-medium"
              : "text-foreground hover:bg-muted"
          }`}
        >
          <FolderOpen className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{node.name}</span>
          {node.articleIds.length > 0 && (
            <span className="ml-auto text-[10px] text-muted-foreground/60">
              {node.articleIds.length}
            </span>
          )}
        </button>
      </div>
      {hasChildren && expanded && (
        <div className="ml-4 space-y-0.5 border-l border-border/40 pl-1">
          {node.children.map((child) => (
            <CategoryNodeRow
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
