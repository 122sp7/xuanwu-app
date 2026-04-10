"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { Badge } from "@ui-shadcn/ui/badge";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import type { KnowledgePageTreeNode } from "../../domain/aggregates/KnowledgePage";
import { getKnowledgePageTree, getKnowledgePageTreeByWorkspace } from "../queries";
import { PageTreeView } from "./PageTreeView";

/**
 * KnowledgePagesRouteScreen
 * Route-level screen component for /knowledge/pages.
 * Encapsulates data-loading, scope resolution and layout so that the
 * Next.js route file stays thin (params/context wiring only).
 */
export function KnowledgePagesRouteScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const requestedWorkspaceId = searchParams.get("workspaceId")?.trim() ?? "";
  const scopeParam = searchParams.get("scope")?.trim() ?? "";
  const isAccountSummary = scopeParam === "account";
  const workspaceId = isAccountSummary ? "" : requestedWorkspaceId || appState.activeWorkspaceId || "";
  const currentUserId = authState.user?.id ?? "";

  const [nodes, setNodes] = useState<KnowledgePageTreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!accountId) { setLoading(false); return; }
    if (!isAccountSummary && !workspaceId) {
      setNodes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const tree = isAccountSummary
        ? await getKnowledgePageTree(accountId)
        : await getKnowledgePageTreeByWorkspace(accountId, workspaceId);
      setNodes(tree);
    } finally {
      setLoading(false);
    }
  }, [accountId, isAccountSummary, workspaceId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">頁面</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isAccountSummary ? "secondary" : "outline"}>
            {isAccountSummary ? "Account Summary" : "Workspace Scope"}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {isAccountSummary
              ? "這是顯式 account summary mode。僅用於跨工作區總覽，預設不在此建立新頁面。"
              : "知識頁面階層樹預設綁定目前工作區。點選頁面進入內容編輯器。"}
          </p>
        </div>
      </header>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push("/knowledge")}
          className="inline-flex items-center rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          返回 Knowledge Hub
        </button>
      </div>

      {!accountId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          尚未取得帳號情境，請先登入。
        </p>
      ) : !isAccountSummary && !workspaceId ? (
        <p className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
          尚未選定工作區。請先從工作區進入知識頁面，或在網址帶入 workspaceId 後再查看頁面樹。
        </p>
      ) : loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <PageTreeView
          nodes={nodes}
          accountId={accountId}
          workspaceId={workspaceId || undefined}
          currentUserId={currentUserId}
          allowCreate={!isAccountSummary && Boolean(workspaceId)}
          emptyStateDescription={
            isAccountSummary
              ? "這個 account summary 目前沒有可顯示的頁面。請改從工作區建立與維護頁面。"
              : "這個工作區尚無頁面。點擊「新增頁面」開始建立。"
          }
          onPageClick={(pageId) => router.push(`/knowledge/pages/${pageId}`)}
          onCreated={() => load()}
        />
      )}
    </div>
  );
}
