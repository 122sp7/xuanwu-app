"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Brain, Building2, Database, FileText, FolderKanban, MessageSquare } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { buildWikiContentTree } from "@/modules/workspace/api";
import type { WikiAccountContentNode, WikiAccountSeed } from "@/modules/workspace/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

const QUICK_ACCESS = [
  {
    href: "/knowledge/pages?scope=account",
    title: "Pages",
    description: "顯式 account summary 的頁面樹檢視與維運工具；日常建立與整理請從工作區進入。",
    icon: FileText,
  },
  {
    href: "/source/libraries",
    title: "Libraries",
    description: "維持 schema / table 型知識資產。",
    icon: Database,
  },
  {
    href: "/source/documents",
    title: "Documents",
    description: "來源文件、upload 與 ingest 狀態檢視。",
    icon: BookOpen,
  },
  {
    href: "/knowledge-base/articles",
    title: "Articles",
    description: "組織知識庫 SOP 文章、驗證管治與分類樹。",
    icon: FolderKanban,
  },
  {
    href: "/knowledge-database/databases",
    title: "Databases",
    description: "結構化資料庫、多視圖（表格、看板、日曆）管理。",
    icon: Brain,
  },
  {
    href: "/notebook/rag-query",
    title: "Ask / Cite",
    description: "查詢、引用與回答檢視。",
    icon: MessageSquare,
  },
] as const;

export default function KnowledgeHubPage() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const [contentTree, setContentTree] = useState<WikiAccountContentNode[]>([]);
  const [loading, setLoading] = useState(true);

  const accountSeeds = useMemo<WikiAccountSeed[]>(() => {
    const personalUser = authState.user;
    const activeAccountId = appState.activeAccount?.id;
    const seeds: WikiAccountSeed[] = [];

    if (personalUser) {
      seeds.push({
        accountId: personalUser.id,
        accountName: personalUser.name,
        accountType: "personal",
        isActive: activeAccountId === personalUser.id,
      });
    }

    const organizations = Object.values(appState.accounts);
    for (const organization of organizations) {
      seeds.push({
        accountId: organization.id,
        accountName: organization.name,
        accountType: "organization",
        isActive: activeAccountId === organization.id,
      });
    }

    return seeds;
  }, [appState.accounts, appState.activeAccount?.id, authState.user]);

  useEffect(() => {
    let disposed = false;

    async function load() {
      setLoading(true);
      try {
        const result = await buildWikiContentTree(accountSeeds);
        if (!disposed) {
          setContentTree(result);
        }
      } catch {
        if (!disposed) {
          setContentTree([]);
        }
      } finally {
        if (!disposed) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      disposed = true;
    };
  }, [accountSeeds]);

  const activeAccount = contentTree.find((node) => node.isActive);
  const highlightedWorkspace =
    activeAccount?.workspaces.find((workspace) => workspace.workspaceId === appState.activeWorkspaceId) ??
    activeAccount?.workspaces[0];

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge Hub</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Knowledge Hub</h1>
        <p className="text-sm text-muted-foreground">
          從這裡進入 Knowledge、Knowledge Base、Knowledge Database、Source 與 Notebook 各模組。
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Workspace-first entry</CardTitle>
          <CardDescription>先鎖定 active account，再選擇要進入的工作區，最後才分流到 Knowledge、知識頁面、Notebook / AI。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <Skeleton className="h-6 w-48" />
          ) : activeAccount ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-border/60 px-4 py-3">
                <p className="text-xs text-muted-foreground">Active Account</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Building2 className="size-4 text-primary" />
                  <Badge variant="outline">{activeAccount.accountType === "personal" ? "個人" : "組織"}</Badge>
                  <span className="font-medium text-foreground">{activeAccount.accountName}</span>
                </div>
              </div>
              <div className="rounded-xl border border-border/60 px-4 py-3">
                <p className="text-xs text-muted-foreground">Workspace Coverage</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
                  <FolderKanban className="size-4 text-primary" />
                  <span>{activeAccount.workspaces.length} 個工作區可直接進入各自的知識頁面</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">尚未取得 account context。</p>
          )}

          {highlightedWorkspace && (
            <div className="grid gap-3 lg:grid-cols-[1fr_1.1fr]">
              <div className="rounded-xl border border-border/60 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Highlighted workspace</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{highlightedWorkspace.workspaceName}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  先把這個工作區當成知識主樞紐，再從裡面打開知識頁面與 Notebook / AI。
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href={`/workspace/${highlightedWorkspace.workspaceId}`}>進入工作區</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/knowledge/pages?workspaceId=${encodeURIComponent(highlightedWorkspace.workspaceId)}`}>知識頁面</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/ai-chat?workspaceId=${encodeURIComponent(highlightedWorkspace.workspaceId)}`}>
                      Notebook / AI
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border/60 px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">Knowledge</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    先整理文件來源、Libraries 與 upload / ingest。
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">知識頁面</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    再用頁面樹與內容脈絡整理知識結構。
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">Notebook / AI</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    最後才消費這些知識做問答、摘要與洞察。
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {QUICK_ACCESS.map((item) => (
              <Link key={item.href} href={item.href} className="group">
                <Card className="h-full transition-colors hover:border-primary/40 hover:shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <item.icon className="size-4" />
                      </div>
                      <CardTitle className="text-sm">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs leading-relaxed">{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Workspace Snapshot</CardTitle>
          <CardDescription>以下工作區皆屬於目前 active account；請優先從工作區進入，再分流到 Knowledge、知識頁面與 Notebook / AI。</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : !activeAccount || activeAccount.workspaces.length === 0 ? (
            <p className="text-sm text-muted-foreground">目前帳號下沒有工作區。</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {activeAccount.workspaces.map((workspace) => (
                <Card key={workspace.workspaceId} className="transition-colors hover:border-primary/40 hover:shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{workspace.workspaceName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {workspace.contentBaseItems
                        .filter((item) => item.enabled)
                        .map((item) => (
                          <Badge key={item.key} variant="secondary" className="text-[10px]">
                            {item.label}
                          </Badge>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/workspace/${workspace.workspaceId}`}>Workspace</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/knowledge/pages?workspaceId=${encodeURIComponent(workspace.workspaceId)}`}>知識頁面</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/source/documents?workspaceId=${encodeURIComponent(workspace.workspaceId)}`}>
                          Knowledge
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/ai-chat?workspaceId=${encodeURIComponent(workspace.workspaceId)}`}>
                          <Brain className="mr-1 size-3.5" />
                          Notebook
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
