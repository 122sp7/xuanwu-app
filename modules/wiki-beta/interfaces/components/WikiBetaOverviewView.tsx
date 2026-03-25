"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Building2, Database, FileText, FolderKanban, MessageSquare } from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { Badge } from "@ui-shadcn/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

import { buildWikiBetaContentTree } from "../../api";
import type { WikiBetaAccountContentNode, WikiBetaAccountSeed } from "../../api";

const QUICK_ACCESS = [
  {
    href: "/wiki-beta/pages",
    title: "Pages",
    description: "層級頁面結構、命名與移動管理。",
    icon: FileText,
  },
  {
    href: "/wiki-beta/libraries",
    title: "Libraries",
    description: "欄位模型與資料列維護。",
    icon: Database,
  },
  {
    href: "/wiki-beta/documents",
    title: "Documents",
    description: "文件上傳、處理與索引狀態。",
    icon: BookOpen,
  },
  {
    href: "/wiki-beta/rag-query",
    title: "RAG Query",
    description: "知識問答與引用檢視。",
    icon: MessageSquare,
  },
] as const;

export function WikiBetaOverviewView() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const [contentTree, setContentTree] = useState<WikiBetaAccountContentNode[]>([]);
  const [loading, setLoading] = useState(true);

  const accountSeeds = useMemo<WikiBetaAccountSeed[]>(() => {
    const personalUser = authState.user;
    const activeAccountId = appState.activeAccount?.id;
    const seeds: WikiBetaAccountSeed[] = [];

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
        const result = await buildWikiBetaContentTree(accountSeeds);
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Account Wiki-Beta Dashboard</CardTitle>
          <CardDescription>顯示目前 active account 底下的 Wiki-Beta 範圍，並提供 account-level 與 workspace-level 的進入點。</CardDescription>
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
                  <span>{activeAccount.workspaces.length} 個工作區可進入各自的 WorkSpace Wiki-Beta</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">尚未取得 account context。</p>
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
          <CardDescription>以下工作區皆屬於目前 active account，點擊後直接進入該 workspace 的 Wiki-Beta 範圍。</CardDescription>
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
                <Link key={workspace.workspaceId} href={workspace.href}>
                  <Card className="transition-colors hover:border-primary/40 hover:shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{workspace.workspaceName}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-1">
                      {workspace.contentBaseItems
                        .filter((item) => item.enabled)
                        .map((item) => (
                          <Badge key={item.key} variant="secondary" className="text-[10px]">
                            {item.label}
                          </Badge>
                        ))}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
