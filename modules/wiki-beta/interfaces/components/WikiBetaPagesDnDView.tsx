"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GripVertical, Loader2 } from "lucide-react";

import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@lib-dragdrop";

import { listWikiBetaPagesTree, moveWikiBetaPage } from "../../application";
import type { WikiBetaPageTreeNode } from "../../domain";

interface WikiBetaPagesDnDViewProps {
  readonly accountId: string;
  readonly workspaceId?: string;
}

/**
 * WikiBetaPagesDnDView
 *
 * Flat-list DnD reorder of top-level pages.
 * Dragging a page onto another triggers moveWikiBetaPage to update parent.
 * No over-engineering: single-level DnD with minimal state.
 */
export function WikiBetaPagesDnDView({ accountId, workspaceId }: WikiBetaPagesDnDViewProps) {
  const [pages, setPages] = useState<WikiBetaPageTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tree = await listWikiBetaPagesTree(accountId, workspaceId);
      setPages(tree);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to load pages");
    } finally {
      setLoading(false);
    }
  }, [accountId, workspaceId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // DnD monitor: drop page onto another → reparent
  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) return;
        const draggedId = source.data["pageId"] as string | undefined;
        const targetId = target.data["pageId"] as string | undefined;
        if (!draggedId || !targetId || draggedId === targetId) return;

        // Optimistically reorder locally (flat reorder only)
        setPages((prev) => {
          const fromIdx = prev.findIndex((p) => p.id === draggedId);
          const toIdx = prev.findIndex((p) => p.id === targetId);
          if (fromIdx === -1 || toIdx === -1) return prev;
          const next = [...prev];
          const [moved] = next.splice(fromIdx, 1);
          if (!moved) return prev;
          next.splice(toIdx, 0, moved);
          return next;
        });

        // Persist: move dragged page under target as parent
        void moveWikiBetaPage({
          accountId,
          pageId: draggedId,
          targetParentPageId: targetId,
        }).catch((e: unknown) => {
          setError(e instanceof Error ? e.message : "move failed");
          void refresh();
        });
      },
    });
  }, [accountId, refresh]);

  return (
    <section className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Pages DnD</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">頁面樹拖曳重組</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          使用 @atlaskit/pragmatic-drag-and-drop 拖曳頁面至另一個頁面下（重新設定父層）。
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          載入頁面中…
        </div>
      )}

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {!loading && pages.length === 0 && (
        <p className="text-sm text-muted-foreground">尚無頁面，請先在「頁面」頁面建立頁面。</p>
      )}

      {pages.length > 0 && (
        <ul className="space-y-1.5">
          {pages.map((page) => (
            <DraggablePage key={page.id} page={page} />
          ))}
        </ul>
      )}
    </section>
  );
}

interface DraggablePageProps {
  readonly page: WikiBetaPageTreeNode;
}

function DraggablePage({ page }: DraggablePageProps) {
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    const handleEl = dragHandleRef.current;
    const itemEl = itemRef.current;
    if (!handleEl || !itemEl) return;

    const cleanupDraggable = draggable({
      element: handleEl,
      getInitialData: () => ({ pageId: page.id }),
    });
    const cleanupDrop = dropTargetForElements({
      element: itemEl,
      getData: () => ({ pageId: page.id }),
      onDragEnter: () => setIsDragOver(true),
      onDragLeave: () => setIsDragOver(false),
      onDrop: () => setIsDragOver(false),
    });
    return () => {
      cleanupDraggable();
      cleanupDrop();
    };
  }, [page.id]);

  return (
    <li
      ref={itemRef}
      className={`flex items-center gap-2 rounded-md border px-3 py-2 transition ${
        isDragOver
          ? "border-primary/60 bg-primary/5"
          : "border-border/60 bg-background"
      }`}
    >
      <button
        ref={dragHandleRef}
        type="button"
        aria-label="拖曳重排"
        className="cursor-grab touch-none opacity-30 hover:opacity-80 active:cursor-grabbing"
      >
        <GripVertical className="size-4 text-muted-foreground" />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-sm font-medium text-foreground">{page.title}</span>
        <span className="shrink-0 rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
          {page.slug}
        </span>
        {page.children.length > 0 && (
          <span className="shrink-0 text-[10px] text-muted-foreground/60">
            {page.children.length} 子頁面
          </span>
        )}
      </div>
    </li>
  );
}
