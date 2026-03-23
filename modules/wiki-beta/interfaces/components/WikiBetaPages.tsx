"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  createWikiBetaPage,
  listWikiBetaPagesTree,
  moveWikiBetaPage,
  renameWikiBetaPage,
} from "../../application";
import type { WikiBetaPageTreeNode } from "../../domain";

interface WikiBetaPagesProps {
  readonly accountId: string;
  readonly workspaceId?: string;
}

interface FlatPageOption {
  id: string;
  label: string;
}

function flattenPages(nodes: WikiBetaPageTreeNode[], depth = 0): FlatPageOption[] {
  const out: FlatPageOption[] = [];
  for (const node of nodes) {
    out.push({ id: node.id, label: `${"  ".repeat(depth)}${node.title}` });
    out.push(...flattenPages(node.children, depth + 1));
  }
  return out;
}

function PageTreeNode({
  node,
  onCreateChild,
  onRename,
  onMove,
}: {
  readonly node: WikiBetaPageTreeNode;
  readonly onCreateChild: (pageId: string) => void;
  readonly onRename: (pageId: string, currentTitle: string) => void;
  readonly onMove: (pageId: string, currentParentId: string | null) => void;
}) {
  return (
    <li className="space-y-2 rounded-md border border-border/60 bg-background p-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium text-foreground">{node.title}</p>
        <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
          {node.slug}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => onCreateChild(node.id)}
          className="rounded-md border border-border/60 px-2 py-1 text-muted-foreground hover:text-foreground"
        >
          建立子頁
        </button>
        <button
          type="button"
          onClick={() => onRename(node.id, node.title)}
          className="rounded-md border border-border/60 px-2 py-1 text-muted-foreground hover:text-foreground"
        >
          重新命名
        </button>
        <button
          type="button"
          onClick={() => onMove(node.id, node.parentPageId)}
          className="rounded-md border border-border/60 px-2 py-1 text-muted-foreground hover:text-foreground"
        >
          移動
        </button>
      </div>

      {node.children.length > 0 ? (
        <ul className="space-y-2 border-l border-border/60 pl-3">
          {node.children.map((child) => (
            <PageTreeNode
              key={child.id}
              node={child}
              onCreateChild={onCreateChild}
              onRename={onRename}
              onMove={onMove}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function WikiBetaPages({ accountId, workspaceId }: WikiBetaPagesProps) {
  const [title, setTitle] = useState("");
  const [parentPageId, setParentPageId] = useState<string>("");
  const [tree, setTree] = useState<WikiBetaPageTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageOptions = useMemo(() => flattenPages(tree), [tree]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listWikiBetaPagesTree(accountId, workspaceId);
      setTree(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [accountId, workspaceId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleCreate = useCallback(
    async (targetParentPageId?: string | null) => {
      const rawTitle = targetParentPageId ? window.prompt("子頁標題") : title;
      if (!rawTitle) {
        return;
      }

      const finalTitle = rawTitle.trim();
      if (!finalTitle) {
        return;
      }
      try {
        await createWikiBetaPage({
          accountId,
          workspaceId,
          title: finalTitle,
          parentPageId: targetParentPageId ?? (parentPageId || null),
        });

        setTitle("");
        setParentPageId("");
        await refresh();
      } catch (e) {
        const message = e instanceof Error ? e.message : "create page failed";
        setError(message);
      }
    },
    [accountId, parentPageId, refresh, title, workspaceId],
  );

  const handleRename = useCallback(
    async (pageId: string, currentTitle: string) => {
      const nextTitle = window.prompt("新的頁面標題", currentTitle);
      if (!nextTitle || !nextTitle.trim()) {
        return;
      }
      try {
        await renameWikiBetaPage({ accountId, pageId, title: nextTitle });
        await refresh();
      } catch (e) {
        const message = e instanceof Error ? e.message : "rename page failed";
        setError(message);
      }
    },
    [accountId, refresh],
  );

  const handleMove = useCallback(
    async (pageId: string, currentParentId: string | null) => {
      const raw = window.prompt(
        "輸入新的 parent page id，留空代表 root",
        currentParentId ?? "",
      );
      if (raw === null) {
        return;
      }
      try {
        await moveWikiBetaPage({
          accountId,
          pageId,
          targetParentPageId: raw.trim() ? raw.trim() : null,
        });
        await refresh();
      } catch (e) {
        const message = e instanceof Error ? e.message : "move page failed";
        setError(message);
      }
    },
    [accountId, refresh],
  );

  return (
    <section className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Pages MVP</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Notion-like Page Tree</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          目前為最小可行版本：建立、重新命名、移動頁面。slug 由 namespace policy 推導，操作會發佈 domain event。
        </p>
      </div>

      <div className="grid gap-2 rounded-lg border border-border/60 bg-muted/20 p-3 md:grid-cols-[1fr_auto_auto]">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="輸入頁面標題"
          className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm outline-none focus:border-primary/40"
        />
        <select
          value={parentPageId}
          onChange={(event) => setParentPageId(event.target.value)}
          className="h-9 rounded-md border border-border/60 bg-background px-2 text-sm"
          aria-label="Select parent page"
        >
          <option value="">Root</option>
          {pageOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => void handleCreate(null)}
          className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          建立頁面
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          載入頁面樹中...
        </div>
      ) : error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
      ) : tree.length === 0 ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          尚未建立頁面，先新增第一個 root page。
        </p>
      ) : (
        <ul className="space-y-2">
          {tree.map((node) => (
            <PageTreeNode
              key={node.id}
              node={node}
              onCreateChild={(pageId) => void handleCreate(pageId)}
              onRename={(pageId, currentTitle) => void handleRename(pageId, currentTitle)}
              onMove={(pageId, currentParentId) => void handleMove(pageId, currentParentId)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}