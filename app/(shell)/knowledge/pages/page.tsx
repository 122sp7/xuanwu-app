"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { getKnowledgePageTree, PageTreeView } from "@/modules/knowledge/api";
import type { KnowledgePageTreeNode } from "@/modules/knowledge/api";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

export default function KnowledgePagesPage() {
  const router = useRouter();
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const workspaceId = appState.activeWorkspaceId ?? "";
  const currentUserId = authState.user?.id ?? "";

  const [nodes, setNodes] = useState<KnowledgePageTreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!accountId) { setLoading(false); return; }
    setLoading(true);
    try {
      const tree = await getKnowledgePageTree(accountId);
      setNodes(tree);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">頁面</h1>
        <p className="text-sm text-muted-foreground">
          知識頁面階層樹。點選頁面進入內容編輯器。
        </p>
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
          workspaceId={workspaceId}
          currentUserId={currentUserId}
          onPageClick={(pageId) => router.push(`/knowledge/pages/${pageId}`)}
          onCreated={() => load()}
        />
      )}
    </div>
  );
}
