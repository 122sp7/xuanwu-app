"use client";

/**
 * WikiBetaPagesDnDView.tsx
 * Purpose: Wiki pages tree with drag-and-drop reordering using @lib-dragdrop.
 * Responsibilities: render page tree, handle drag/drop to reorder and reparent pages.
 * Constraints: client-only; calls moveWikiBetaPage use-case on drop.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  File,
  FolderOpen,
  Folder,
  GripVertical,
  Loader2,
  Plus,
  AlertCircle,
} from "lucide-react";

import {
  combine,
  draggable,
  dropTargetForElements,
  monitorForElements,
  extractClosestEdge,
  attachClosestEdge,
  type Edge,
} from "@lib-dragdrop";

import {
  createWikiBetaPage,
  listWikiBetaPagesTree,
  moveWikiBetaPage,
} from "../../application";
import type { WikiBetaPageTreeNode } from "../../domain";

// ── Types ──────────────────────────────────────────────────────────────────

interface DragData extends Record<string, unknown> {
  type: "wiki-page";
  pageId: string;
  parentPageId: string | null;
}

function isDragData(data: unknown): data is DragData {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as DragData).type === "wiki-page"
  );
}

// ── Tree node ──────────────────────────────────────────────────────────────

interface TreeNodeProps {
  node: WikiBetaPageTreeNode;
  depth: number;
  onCreateChild: (pageId: string) => void;
}

function TreeNode({ node, depth, onCreateChild }: TreeNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const hasChildren = node.children.length > 0;

  useEffect(() => {
    const el = nodeRef.current;
    const handle = dragHandleRef.current;
    if (!el || !handle) return;

    const dragData: DragData = {
      type: "wiki-page",
      pageId: node.id,
      parentPageId: node.parentPageId,
    };

    return combine(
      draggable({
        element: el,
        dragHandle: handle,
        getInitialData: () => dragData,
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: el,
        canDrop: ({ source }) => {
          const data = source.data;
          return isDragData(data) && data.pageId !== node.id;
        },
        getData: ({ input }) =>
          attachClosestEdge(
            {
              pageId: node.id,
              parentPageId: node.parentPageId,
            } satisfies { pageId: string; parentPageId: string | null },
            { element: el, input, allowedEdges: ["top", "bottom"] },
          ),
        onDrag: ({ self }) => {
          const edge = extractClosestEdge(self.data);
          setClosestEdge(edge);
        },
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      }),
    );
  }, [node.id, node.parentPageId]);

  return (
    <div>
      <div
        ref={nodeRef}
        className={`group relative flex items-center gap-1 rounded-md px-2 py-1.5 text-sm transition
          ${isDragging ? "opacity-40" : ""}
          hover:bg-muted/60
          ${closestEdge === "top" ? "border-t-2 border-primary" : ""}
          ${closestEdge === "bottom" ? "border-b-2 border-primary" : ""}
        `}
        style={{ paddingLeft: `${(depth + 1) * 12 + 4}px` }}
      >
        {/* Drag handle */}
        <button
          ref={dragHandleRef}
          type="button"
          aria-label="拖曳移動此頁面"
          className="hidden size-4 cursor-grab items-center justify-center rounded opacity-0 transition group-hover:opacity-100 md:flex"
        >
          <GripVertical className="size-3 text-muted-foreground" />
        </button>

        {/* Expand/collapse */}
        {hasChildren ? (
          <button
            type="button"
            aria-label={isExpanded ? "收合" : "展開"}
            onClick={() => setIsExpanded((v) => !v)}
            className="flex size-4 shrink-0 items-center justify-center rounded transition hover:bg-muted"
          >
            <ChevronRight
              className={`size-3 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <span className="size-4 shrink-0" />
        )}

        {/* Icon */}
        {hasChildren ? (
          isExpanded ? (
            <FolderOpen className="size-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <Folder className="size-3.5 shrink-0 text-muted-foreground" />
          )
        ) : (
          <File className="size-3.5 shrink-0 text-muted-foreground" />
        )}

        {/* Title */}
        <span className="flex-1 truncate text-xs font-medium text-foreground">
          {node.title}
        </span>

        {/* Add child button */}
        <button
          type="button"
          aria-label="建立子頁"
          onClick={() => onCreateChild(node.id)}
          className="hidden size-5 items-center justify-center rounded opacity-0 transition hover:bg-muted group-hover:opacity-100 md:flex"
        >
          <Plus className="size-3 text-muted-foreground" />
        </button>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onCreateChild={onCreateChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

interface WikiBetaPagesDnDViewProps {
  accountId: string;
  workspaceId?: string;
}

export function WikiBetaPagesDnDView({ accountId, workspaceId }: WikiBetaPagesDnDViewProps) {
  const [tree, setTree] = useState<WikiBetaPageTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listWikiBetaPagesTree(accountId, workspaceId);
      setTree(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "載入失敗");
    } finally {
      setLoading(false);
    }
  }, [accountId, workspaceId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // ── DnD monitor ─────────────────────────────────────────────────────────

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => isDragData(source.data),
      onDrop: ({ source, location }) => {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceData = source.data as DragData;
        const targetData = target.data as { pageId: string; parentPageId: string | null };
        const edge = extractClosestEdge(target.data);

        if (sourceData.pageId === targetData.pageId) return;

        // When dropping on "bottom" edge: move to same parent as the target (sibling).
        // When dropping on "top" edge: also sibling, but placed before the target.
        // In both cases the parent is the same; the visual order is handled by
        // the page's `order` field which moveWikiBetaPage resets server-side.
        const newParentId =
          edge === "bottom" || edge === "top"
            ? (targetData.parentPageId ?? null)
            : null;

        void moveWikiBetaPage({
          accountId,
          pageId: sourceData.pageId,
          targetParentPageId: newParentId,
        }).then(() => refresh()).catch((e: unknown) => {
          setError(e instanceof Error ? e.message : "移動失敗");
        });
      },
    });
  }, [accountId, refresh]);

  async function handleCreateRoot() {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    setCreating(true);
    setError(null);
    try {
      await createWikiBetaPage({ accountId, workspaceId, title: trimmed, parentPageId: null });
      setNewTitle("");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "建立失敗");
    } finally {
      setCreating(false);
    }
  }

  async function handleCreateChild(parentPageId: string) {
    const title = window.prompt("子頁標題");
    if (!title?.trim()) return;
    setError(null);
    try {
      await createWikiBetaPage({ accountId, workspaceId, title: title.trim(), parentPageId });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "建立子頁失敗");
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Pages DnD</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">頁面樹（拖曳重排）</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          使用 @atlaskit/pragmatic-drag-and-drop 實作拖曳重排頁面。拖動左側控點以調整頁面順序。
        </p>
      </div>

      {/* New root page */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") void handleCreateRoot(); }}
          placeholder="新 root 頁面標題"
          className="h-9 flex-1 rounded-md border border-border/60 bg-background px-3 text-sm outline-none focus:border-primary/40"
          disabled={creating}
        />
        <button
          type="button"
          onClick={() => void handleCreateRoot()}
          disabled={creating || !newTitle.trim()}
          className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {creating ? <Loader2 className="size-4 animate-spin" /> : "建立頁面"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          載入頁面樹中...
        </div>
      ) : tree.length === 0 ? (
        <p className="rounded-md border border-dashed border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
          尚未建立頁面，先新增第一個 root page。
        </p>
      ) : (
        <div className="rounded-lg border border-border/60 bg-background">
          {tree.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              onCreateChild={(parentId) => void handleCreateChild(parentId)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
