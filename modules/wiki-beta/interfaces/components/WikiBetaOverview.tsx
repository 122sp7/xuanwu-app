"use client";

/**
 * WikiBetaOverview — wiki + notion style knowledge overview page.
 *
 * Displays a dashboard-like overview with quick-access cards to
 * Pages, Libraries, Documents, and RAG Query. Follows the wiki-beta
 * UI-UX spec for the 知識總覽 route.
 */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Database,
  FileText,
  MessageSquare,
  Search,
} from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Separator } from "@ui-shadcn/ui/separator";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import { buildWikiBetaKnowledgeTree } from "../../application";
import type {
  WikiBetaAccountKnowledgeNode,
  WikiBetaAccountSeed,
} from "../../domain";

/* ------------------------------------------------------------------ */
/*  Quick-access cards                                                */
/* ------------------------------------------------------------------ */

const QUICK_ACCESS = [
  {
    href: "/wiki-beta/pages",
    title: "Pages",
    description: "建立與管理層級式頁面，支援樹狀導覽、拖放排序。",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    href: "/wiki-beta/libraries",
    title: "Libraries",
    description: "結構化資料管理，定義欄位、建立記錄、支援關聯。",
    icon: Database,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    href: "/wiki-beta/documents",
    title: "Documents",
    description: "上傳文件、追蹤解析狀態、管理 RAG 索引。",
    icon: BookOpen,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    href: "/wiki-beta/rag-query",
    title: "RAG Query",
    description: "基於已索引文件的智慧問答，附帶引用與來源追蹤。",
    icon: MessageSquare,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function WikiBetaOverview() {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const [knowledgeTree, setKnowledgeTree] = useState<WikiBetaAccountKnowledgeNode[]>([]);
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
        const result = await buildWikiBetaKnowledgeTree(accountSeeds);
        if (!disposed) setKnowledgeTree(result);
      } catch {
        if (!disposed) setKnowledgeTree([]);
      } finally {
        if (!disposed) setLoading(false);
      }
    }

    void load();
    return () => {
      disposed = true;
    };
  }, [accountSeeds]);

  const activeAccount = knowledgeTree.find((n) => n.isActive);
  const workspaceCount = activeAccount?.workspaces.length ?? 0;

  return (
    <div className="space-y-6 p-6">
      {/* ── Page header ── */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          知識總覽
        </h1>
        <p className="text-sm text-muted-foreground">
          Wiki Beta 入口 — 管理帳號範圍內的知識流程。
        </p>
      </div>

      {/* ── Account context ── */}
      <div className="flex flex-wrap items-center gap-2">
        {loading ? (
          <Skeleton className="h-6 w-40" />
        ) : activeAccount ? (
          <>
            <Badge variant="outline" className="text-xs">
              {activeAccount.accountType === "personal" ? "個人" : "組織"}
            </Badge>
            <span className="text-sm font-medium text-foreground">
              {activeAccount.accountName}
            </span>
            <span className="text-xs text-muted-foreground">
              · {workspaceCount} 個工作區
            </span>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            請先登入或切換帳號。
          </p>
        )}
      </div>

      <Separator />

      {/* ── Quick-access cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_ACCESS.map((item) => (
          <Link key={item.href} href={item.href} className="group">
            <Card className="h-full transition-colors hover:border-primary/40 hover:shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex size-8 items-center justify-center rounded-md ${item.bgColor}`}
                  >
                    <item.icon className={`size-4 ${item.color}`} />
                  </div>
                  <CardTitle className="text-sm font-semibold">
                    {item.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* ── Workspace overview ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">工作區</h2>
          {activeAccount && workspaceCount > 0 && (
            <Badge variant="secondary" className="text-[10px]">
              {workspaceCount}
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : !activeAccount || workspaceCount === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Search className="mb-2 size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                目前帳號下沒有工作區
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                建立工作區來開始組織您的知識內容。
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeAccount.workspaces.map((ws) => (
              <Link key={ws.workspaceId} href={ws.href}>
                <Card className="transition-colors hover:border-primary/40 hover:shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{ws.workspaceName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {ws.knowledgeBaseItems
                        .filter((item) => item.enabled)
                        .map((item) => (
                          <Badge
                            key={item.key}
                            variant="secondary"
                            className="text-[10px]"
                          >
                            {item.label}
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
