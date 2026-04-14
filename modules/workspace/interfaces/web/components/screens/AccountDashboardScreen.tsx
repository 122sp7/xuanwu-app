"use client";

import Link from "next/link";
import {
  BookOpen,
  Brain,
  Database,
  FileText,
  FolderOpen,
  Library,
  MessageSquare,
  Notebook,
  Shield,
  User,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Badge } from "@ui-shadcn/ui/badge";

import type { WorkspaceEntity } from "../../../contracts";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AccountDashboardScreenProps {
  readonly accountId: string;
  readonly accountName: string | null;
  readonly accountType: "user" | "organization";
  readonly workspaces: WorkspaceEntity[];
  readonly workspacesHydrated: boolean;
  readonly activeWorkspaceId: string | null;
  readonly currentUserId: string | null;
}

// ── Quick-access card definitions ─────────────────────────────────────────────

interface QuickAccessCard {
  readonly key: string;
  readonly label: string;
  readonly description: string;
  readonly icon: React.ReactNode;
  readonly buildHref: (accountId: string, workspaceId: string) => string;
}

const WORKSPACE_QUICK_ACCESS_CARDS: readonly QuickAccessCard[] = [
  {
    key: "knowledge-pages",
    label: "知識頁面",
    description: "管理知識頁面內容",
    icon: <FileText className="size-5 text-blue-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Overview&panel=knowledge-pages`,
  },
  {
    key: "articles",
    label: "文章",
    description: "知識庫文章管理",
    icon: <BookOpen className="size-5 text-emerald-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Overview&panel=knowledge-base-articles`,
  },
  {
    key: "files",
    label: "檔案",
    description: "工作區檔案管理",
    icon: <FolderOpen className="size-5 text-amber-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Files`,
  },
  {
    key: "members",
    label: "成員",
    description: "工作區成員與角色",
    icon: <Users className="size-5 text-violet-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Members`,
  },
  {
    key: "knowledge-base",
    label: "知識庫",
    description: "結構化知識管理",
    icon: <Notebook className="size-5 text-cyan-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Knowledge`,
  },
  {
    key: "rag-query",
    label: "RAG 查詢",
    description: "問答與引用檢索",
    icon: <Brain className="size-5 text-pink-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Notebook`,
  },
  {
    key: "ai-chat",
    label: "AI 對話",
    description: "AI 助手對話介面",
    icon: <MessageSquare className="size-5 text-orange-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=AiChat`,
  },
  {
    key: "databases",
    label: "資料庫",
    description: "結構化資料表管理",
    icon: <Database className="size-5 text-indigo-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Overview&panel=knowledge-databases`,
  },
  {
    key: "source-libraries",
    label: "來源庫",
    description: "文件來源管理",
    icon: <Library className="size-5 text-teal-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Overview&panel=source-libraries`,
  },
  {
    key: "governance",
    label: "治理",
    description: "存取與權限治理",
    icon: <Shield className="size-5 text-red-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Overview&panel=governance`,
  },
  {
    key: "profile",
    label: "工作區資料",
    description: "工作區基本設定",
    icon: <User className="size-5 text-slate-500" />,
    buildHref: (a, w) => `/${enc(a)}/${enc(w)}?tab=Overview&panel=profile`,
  },
];

function enc(s: string): string {
  return encodeURIComponent(s);
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AccountDashboardScreen({
  accountId,
  accountName,
  accountType,
  workspaces,
  workspacesHydrated,
  activeWorkspaceId,
}: AccountDashboardScreenProps) {
  const activeWorkspace = activeWorkspaceId
    ? workspaces.find((w) => w.id === activeWorkspaceId) ?? null
    : null;

  const sortedWorkspaces = [...workspaces].sort((a, b) =>
    a.name.localeCompare(b.name, "zh-Hant"),
  );

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">儀表板</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {accountName ?? accountId} ·{" "}
          <Badge variant="outline" className="text-[10px]">
            {accountType === "organization" ? "組織" : "個人"}
          </Badge>
        </p>
      </div>

      {/* ── Active workspace quick-access ──────────────────────────────── */}
      {activeWorkspace ? (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">
              目前工作區：{activeWorkspace.name}
            </h2>
            <Badge variant="secondary" className="text-[10px]">
              {activeWorkspace.lifecycleState}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {WORKSPACE_QUICK_ACCESS_CARDS.map((card) => (
              <Link
                key={card.key}
                href={card.buildHref(accountId, activeWorkspace.id)}
                className="group"
              >
                <Card className="h-full transition-colors group-hover:border-primary/50 group-hover:bg-accent/40">
                  <CardHeader className="flex-row items-center gap-2 pb-1 pt-3">
                    {card.icon}
                    <CardTitle className="text-sm">{card.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0">
                    <CardDescription className="text-xs">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-border/50 bg-card/70 p-6">
          <p className="text-sm text-muted-foreground">
            {workspacesHydrated
              ? "尚未選取工作區。請先從工作區中心選擇一個工作區。"
              : "正在載入工作區資料…"}
          </p>
        </section>
      )}

      {/* ── All workspaces list ─────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">
          所有工作區
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            ({sortedWorkspaces.length})
          </span>
        </h2>

        {!workspacesHydrated ? (
          <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
            正在載入工作區清單…
          </div>
        ) : sortedWorkspaces.length === 0 ? (
          <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
            目前帳號沒有工作區。
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedWorkspaces.map((workspace) => {
              const isActive = workspace.id === activeWorkspaceId;
              return (
                <Link
                  key={workspace.id}
                  href={`/${enc(accountId)}/${enc(workspace.id)}`}
                  className="group"
                >
                  <Card
                    className={`h-full transition-colors group-hover:border-primary/50 group-hover:bg-accent/40 ${
                      isActive ? "border-primary/30 bg-primary/5" : ""
                    }`}
                  >
                    <CardHeader className="pb-2 pt-4">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">{workspace.name}</CardTitle>
                        {isActive && (
                          <Badge variant="secondary" className="text-[10px]">
                            Active
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs">
                        {workspace.lifecycleState} · {workspace.visibility}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0">
                      <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                        <span>Cap: {workspace.capabilities.length}</span>
                        <span>·</span>
                        <span>Teams: {workspace.teamIds.length}</span>
                        <span>·</span>
                        <span>Grants: {workspace.grants.length}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
