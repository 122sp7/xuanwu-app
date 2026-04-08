"use client";

import Link from "next/link";
import { BookOpenIcon, FileTextIcon, Loader2, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

import type { KnowledgePageTreeNode } from "@/modules/knowledge/api";
import { getKnowledgePageTreeByWorkspace } from "@/modules/knowledge/api";
import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";

interface WorkspaceWikiViewProps {
  readonly workspace: WorkspaceEntity;
}

/** Base left-padding (rem) for depth-0 tree items. */
const TREE_INDENT_BASE_REM = 0.5;
/** Additional left-padding (rem) per nesting level. */
const TREE_INDENT_STEP_REM = 1.25;

function flattenTree(nodes: KnowledgePageTreeNode[], depth = 0): Array<{ node: KnowledgePageTreeNode; depth: number }> {
  const out: Array<{ node: KnowledgePageTreeNode; depth: number }> = [];
  for (const node of nodes) {
    out.push({ node, depth });
    out.push(...flattenTree(node.children as KnowledgePageTreeNode[], depth + 1));
  }
  return out;
}

export function WorkspaceWikiView({ workspace }: WorkspaceWikiViewProps) {
  const [pages, setPages] = useState<KnowledgePageTreeNode[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadPages() {
      setLoadState("loading");
      try {
        const result = await getKnowledgePageTreeByWorkspace(workspace.accountId, workspace.id);
        if (!cancelled) {
          setPages(result);
          setLoadState("loaded");
        }
      } catch {
        if (!cancelled) setLoadState("error");
      }
    }

    void loadPages();

    return () => { cancelled = true; };
  }, [workspace.accountId, workspace.id]);

  const flatPages = flattenTree(pages);

  return (
    <div className="space-y-4">
      <Card className="border-border/60 bg-card/80">
        <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 pb-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpenIcon className="size-4 shrink-0 text-primary" />
              <span className="truncate">Wiki · {workspace.name}</span>
            </CardTitle>
            <CardDescription className="mt-0.5">
              此工作區的 Wiki 頁面
            </CardDescription>
          </div>
          <Button asChild size="sm" className="shrink-0 gap-1.5">
            <Link
              href={`/knowledge/pages?workspaceId=${workspace.id}`}
            >
              <PlusIcon className="size-3.5" />
              <span className="hidden sm:inline">新增頁面</span>
              <span className="sm:hidden">新增</span>
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="pb-4">
          {loadState === "loading" && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          )}

          {loadState === "error" && (
            <p className="py-4 text-center text-sm text-destructive">
              無法載入頁面，請稍後再試。
            </p>
          )}

          {loadState === "loaded" && flatPages.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                <BookOpenIcon className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">尚無 Wiki 頁面</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  建立第一頁來開始記錄工作區知識。
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link href={`/knowledge/pages?workspaceId=${workspace.id}`}>
                  <PlusIcon className="size-3.5" />
                  建立第一頁
                </Link>
              </Button>
            </div>
          )}

          {loadState === "loaded" && flatPages.length > 0 && (
            <ul className="divide-y divide-border/50">
              {flatPages.map(({ node, depth }) => (
                <li key={node.id}>
                  <Link
                    href={`/knowledge/pages?pageId=${node.id}`}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition hover:bg-muted"
                    style={{ paddingLeft: `${TREE_INDENT_BASE_REM + depth * TREE_INDENT_STEP_REM}rem` }}
                  >
                    <FileTextIcon className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                      {node.title}
                    </span>
                    <span className="shrink-0 rounded-full border border-border/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {node.slug}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/source/documents?workspaceId=${encodeURIComponent(workspace.id)}`}>前往工作區文件</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/notebook/rag-query?workspaceId=${encodeURIComponent(workspace.id)}`}>RAG 知識查詢</Link>
        </Button>
      </div>
    </div>
  );
}
