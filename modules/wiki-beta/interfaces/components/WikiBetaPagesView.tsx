"use client";

/**
 * WikiBetaPagesView — notion-like page tree with content panel.
 *
 * Left panel shows hierarchical page tree with expand/collapse.
 * Right panel provides create/rename/move operations.
 * Uses shadcn components for consistent design language.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  FilePlus,
  FileText,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Plus,
  Move,
} from "lucide-react";

import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
import { Input } from "@ui-shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import { Separator } from "@ui-shadcn/ui/separator";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { cn } from "@ui-shadcn/utils";

import {
  createWikiBetaPage,
  listWikiBetaPagesTree,
  moveWikiBetaPage,
  renameWikiBetaPage,
} from "../../application";
import type { WikiBetaPageTreeNode } from "../../domain";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface WikiBetaPagesViewProps {
  readonly accountId: string;
  readonly workspaceId?: string;
}

interface FlatPageOption {
  id: string;
  label: string;
  depth: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function flattenPages(nodes: WikiBetaPageTreeNode[], depth = 0): FlatPageOption[] {
  const out: FlatPageOption[] = [];
  for (const node of nodes) {
    out.push({ id: node.id, label: node.title, depth });
    out.push(...flattenPages(node.children, depth + 1));
  }
  return out;
}

/* ------------------------------------------------------------------ */
/*  Tree node                                                         */
/* ------------------------------------------------------------------ */

function PageTreeItem({
  node,
  depth,
  selectedId,
  onSelect,
  onCreateChild,
  onRename,
  onMove,
}: {
  readonly node: WikiBetaPageTreeNode;
  readonly depth: number;
  readonly selectedId: string | null;
  readonly onSelect: (id: string) => void;
  readonly onCreateChild: (parentId: string) => void;
  readonly onRename: (pageId: string, currentTitle: string) => void;
  readonly onMove: (pageId: string, currentParentId: string | null) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 rounded-md px-1 py-0.5 text-sm transition",
          isSelected
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        {/* Expand/Collapse toggle */}
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded transition hover:bg-muted-foreground/10",
            !hasChildren && "invisible",
          )}
          aria-label={expanded ? "收起" : "展開"}
        >
          {expanded ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
        </button>

        {/* Icon */}
        {hasChildren ? (
          <FolderOpen className="size-4 shrink-0 text-muted-foreground/60" />
        ) : (
          <FileText className="size-4 shrink-0 text-muted-foreground/60" />
        )}

        {/* Title */}
        <button
          type="button"
          onClick={() => onSelect(node.id)}
          className="min-w-0 flex-1 truncate text-left text-sm"
        >
          {node.title}
        </button>

        {/* Actions menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex size-5 shrink-0 items-center justify-center rounded opacity-0 transition hover:bg-muted-foreground/10 group-hover:opacity-100"
              aria-label="頁面操作"
            >
              <MoreHorizontal className="size-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onCreateChild(node.id)}>
              <FilePlus className="mr-2 size-3.5" />
              新增子頁
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRename(node.id, node.title)}>
              <Pencil className="mr-2 size-3.5" />
              重新命名
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onMove(node.id, node.parentPageId)}>
              <Move className="mr-2 size-3.5" />
              移動頁面
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <PageTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onCreateChild={onCreateChild}
              onRename={onRename}
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function WikiBetaPagesView({ accountId, workspaceId }: WikiBetaPagesViewProps) {
  const [tree, setTree] = useState<WikiBetaPageTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  // Create form state
  const [newTitle, setNewTitle] = useState("");
  const [newParentId, setNewParentId] = useState<string>("");

  const pageOptions = useMemo(() => flattenPages(tree), [tree]);
  const selectedPage = useMemo(() => {
    function find(nodes: WikiBetaPageTreeNode[]): WikiBetaPageTreeNode | null {
      for (const n of nodes) {
        if (n.id === selectedPageId) return n;
        const found = find(n.children);
        if (found) return found;
      }
      return null;
    }
    return find(tree);
  }, [tree, selectedPageId]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listWikiBetaPagesTree(accountId, workspaceId);
      setTree(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [accountId, workspaceId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleCreate = useCallback(
    async (parentId?: string | null) => {
      const title = parentId ? window.prompt("子頁標題") : newTitle.trim();
      if (!title) return;
      try {
        await createWikiBetaPage({
          accountId,
          workspaceId,
          title,
          parentPageId: parentId ?? (newParentId || null),
        });
        setNewTitle("");
        setNewParentId("");
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "建立頁面失敗");
      }
    },
    [accountId, newParentId, newTitle, refresh, workspaceId],
  );

  const handleRename = useCallback(
    async (pageId: string, currentTitle: string) => {
      const nextTitle = window.prompt("新的頁面標題", currentTitle);
      if (!nextTitle?.trim()) return;
      try {
        await renameWikiBetaPage({ accountId, pageId, title: nextTitle });
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "重新命名失敗");
      }
    },
    [accountId, refresh],
  );

  const handleMove = useCallback(
    async (pageId: string, currentParentId: string | null) => {
      const raw = window.prompt("輸入新的 parent page id，留空代表 root", currentParentId ?? "");
      if (raw === null) return;
      try {
        await moveWikiBetaPage({
          accountId,
          pageId,
          targetParentPageId: raw.trim() || null,
        });
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "移動頁面失敗");
      }
    },
    [accountId, refresh],
  );

  return (
    <div className="flex h-full min-h-0">
      {/* ── Left: Page tree ── */}
      <div className="flex w-64 flex-col border-r border-border/60">
        <div className="flex h-10 items-center justify-between border-b border-border/60 px-3">
          <span className="text-xs font-semibold text-muted-foreground">
            頁面樹
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={() => void handleCreate(null)}
            aria-label="新增根頁面"
          >
            <Plus className="size-3.5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-1">
          {loading ? (
            <div className="space-y-2 p-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded" />
              ))}
            </div>
          ) : error ? (
            <p className="p-2 text-xs text-destructive">{error}</p>
          ) : tree.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <File className="mb-2 size-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">尚未建立頁面</p>
              <p className="mt-1 text-[10px] text-muted-foreground/70">
                按右上方 + 新增第一個頁面
              </p>
            </div>
          ) : (
            tree.map((node) => (
              <PageTreeItem
                key={node.id}
                node={node}
                depth={0}
                selectedId={selectedPageId}
                onSelect={setSelectedPageId}
                onCreateChild={(parentId) => void handleCreate(parentId)}
                onRename={(pageId, title) => void handleRename(pageId, title)}
                onMove={(pageId, parentId) => void handleMove(pageId, parentId)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Right: Content area ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-auto p-6">
        {selectedPage ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-muted-foreground/60" />
                <h2 className="text-xl font-semibold text-foreground">
                  {selectedPage.title}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-[10px]">
                  {selectedPage.slug}
                </Badge>
                <span>·</span>
                <span>{selectedPage.status}</span>
                {selectedPage.children.length > 0 && (
                  <>
                    <span>·</span>
                    <span>{selectedPage.children.length} 個子頁</span>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Page content placeholder */}
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="mx-auto mb-3 size-10 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">
                  頁面內容區域
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  此處將放置區塊式編輯器 (Block Editor)，支援文字、標題、列表、引用等元素。
                </p>
              </CardContent>
            </Card>

            {/* Quick actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleRename(selectedPage.id, selectedPage.title)}
              >
                <Pencil className="mr-1.5 size-3.5" />
                重新命名
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleCreate(selectedPage.id)}
              >
                <FilePlus className="mr-1.5 size-3.5" />
                新增子頁
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleMove(selectedPage.id, selectedPage.parentPageId)}
              >
                <Move className="mr-1.5 size-3.5" />
                移動
              </Button>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <FileText className="mb-3 size-12 text-muted-foreground/20" />
            <h3 className="text-base font-medium text-foreground">
              選擇或建立一個頁面
            </h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              從左側頁面樹選擇一個頁面來查看內容，或建立新頁面。
            </p>

            <Separator className="my-6 max-w-sm" />

            {/* Quick create */}
            <Card className="w-full max-w-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">快速建立頁面</CardTitle>
                <CardDescription className="text-xs">
                  輸入標題並選擇父頁面來新增。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="頁面標題"
                  className="h-9 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTitle.trim()) {
                      void handleCreate(null);
                    }
                  }}
                />
                <Select value={newParentId} onValueChange={setNewParentId}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Root (無父頁面)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="root">Root (無父頁面)</SelectItem>
                    {pageOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {"　".repeat(opt.depth)}{opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!newTitle.trim()}
                  onClick={() => void handleCreate(null)}
                >
                  <Plus className="mr-1.5 size-3.5" />
                  建立頁面
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
