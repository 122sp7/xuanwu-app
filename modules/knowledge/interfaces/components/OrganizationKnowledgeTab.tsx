"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRightIcon, RefreshCwIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

import type { WorkspaceEntity } from "@/modules/workspace";
import { Badge } from "@/ui/shadcn/ui/badge";
import { Button } from "@/ui/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import { Input } from "@/ui/shadcn/ui/input";
import { Progress } from "@/ui/shadcn/ui/progress";
import type { WorkspaceKnowledgeSummary } from "../../domain/entities/KnowledgeSummary";
import { getWorkspaceKnowledgeSummary } from "../queries/knowledge.queries";

// ── Types ──────────────────────────────────────────────────────────────────────

interface WorkspaceKnowledgeEntry {
  readonly workspace: WorkspaceEntity;
  readonly summary: WorkspaceKnowledgeSummary;
}

interface OrganizationKnowledgeTabProps {
  readonly workspaces: readonly WorkspaceEntity[];
}

const summaryStatusVariantMap = {
  "needs-input": "outline",
  staged: "secondary",
  ready: "default",
} as const;

// ── Per-workspace health row ───────────────────────────────────────────────────

interface WorkspaceHealthCardProps {
  readonly entry: WorkspaceKnowledgeEntry;
}

function WorkspaceHealthCard({ entry }: WorkspaceHealthCardProps) {
  const { workspace, summary } = entry;
  const registered = Math.max(0, summary.registeredAssetCount);
  const ready = Math.max(0, summary.readyAssetCount);
  const readyRatio =
    registered > 0 ? Math.max(0, Math.min(100, Math.round((ready / registered) * 100))) : 0;

  return (
    <div className="rounded-xl border border-border/40 px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Workspace identity + status */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="link" className="h-auto p-0 text-sm font-semibold">
              <Link href={`/workspace/${workspace.id}?tab=Knowledge`}>{workspace.name}</Link>
            </Button>
            <Badge variant={summaryStatusVariantMap[summary.status]}>{summary.status}</Badge>
            <Badge
              variant={
                workspace.lifecycleState === "active"
                  ? "default"
                  : workspace.lifecycleState === "preparatory"
                    ? "secondary"
                    : "outline"
              }
            >
              {workspace.lifecycleState}
            </Badge>
          </div>

          {/* Ready ratio */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {ready} / {registered} 份文件就緒
              </span>
              <span>{readyRatio}%</span>
            </div>
            <Progress value={readyRatio} className="h-1.5" />
          </div>

          {/* Blocked reasons — shown only when non-empty */}
          {summary.blockedReasons.length > 0 && (
            <ul className="list-disc space-y-0.5 pl-4 text-xs text-amber-600 dark:text-amber-400">
              {summary.blockedReasons.slice(0, 2).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
              {summary.blockedReasons.length > 2 && (
                <li>+{summary.blockedReasons.length - 2} 個問題</li>
              )}
            </ul>
          )}
        </div>

        {/* Quick-action links */}
        <div className="flex shrink-0 flex-wrap items-start justify-end gap-1">
          <Button asChild variant="outline" size="sm" className="h-6 gap-1 text-xs">
            <Link href={`/workspace/${workspace.id}?tab=Knowledge`}>
              <ChevronRightIcon className="size-3" />
              管理
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-6 text-xs">
            <Link href={`/workspace/${workspace.id}?tab=Files`}>上傳</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

async function loadKnowledgeEntries(
  workspaces: readonly WorkspaceEntity[],
): Promise<readonly WorkspaceKnowledgeEntry[]> {
  return Promise.all(
    workspaces.map(async (workspace) => {
      try {
        const summary = await getWorkspaceKnowledgeSummary(workspace);
        return { workspace, summary };
      } catch {
        return {
          workspace,
          summary: {
            registeredAssetCount: 0,
            readyAssetCount: 0,
            supportedSourceCount: 0,
            status: "needs-input" as const,
            blockedReasons: ["摘要載入失敗"],
            nextActions: [],
            visibleSurface: "workspace-tab-live" as const,
            contractStatus: "contract-live" as const,
          },
        };
      }
    }),
  );
}

export function OrganizationKnowledgeTab({ workspaces }: OrganizationKnowledgeTabProps) {
  const [entries, setEntries] = useState<readonly WorkspaceKnowledgeEntry[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [searchQuery, setSearchQuery] = useState("");

  const loadAll = useCallback(async (loadControl?: { readonly isCancelled?: () => boolean }) => {
    if (loadControl?.isCancelled?.()) {
      return;
    }
    setLoadState("loading");
    try {
      const results = await loadKnowledgeEntries(workspaces);
      if (!loadControl?.isCancelled?.()) {
        setEntries(results);
        setLoadState("loaded");
      }
    } catch {
      if (!loadControl?.isCancelled?.()) {
        setEntries([]);
        setLoadState("error");
      }
    }
  }, [workspaces]);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => loadAll({ isCancelled: () => cancelled }));

    return () => {
      cancelled = true;
    };
  }, [loadAll]);

  // ── Aggregates ────────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    let totalRegistered = 0;
    let totalReady = 0;
    let readyWorkspaces = 0;

    for (const { summary } of entries) {
      totalRegistered += Math.max(0, summary.registeredAssetCount);
      totalReady += Math.max(0, summary.readyAssetCount);
      if (summary.status === "ready") readyWorkspaces += 1;
    }

    const orgReadyRatio =
      totalRegistered > 0
        ? Math.max(0, Math.min(100, Math.round((totalReady / totalRegistered) * 100)))
        : 0;

    return { totalRegistered, totalReady, orgReadyRatio, readyWorkspaces, totalWorkspaces: entries.length };
  }, [entries]);

  // ── Filtered workspace list ───────────────────────────────────────────────
  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(({ workspace }) =>
      workspace.name.toLowerCase().includes(q) || workspace.id.toLowerCase().includes(q),
    );
  }, [entries, searchQuery]);

  return (
    <div className="space-y-4">
      {/* ── Summary row ──────────────────────────────────────────────────── */}
      <Card className="border border-border/50">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>知識庫總覽</CardTitle>
              <CardDescription>組織下各工作區知識庫狀態。點擊工作區名稱可直接管理。</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => void loadAll()}
              disabled={loadState === "loading"}
            >
              <RefreshCwIcon className="size-3" />
              重新整理
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadState === "error" && (
            <p className="text-sm text-destructive">無法載入知識摘要，請稍後再試。</p>
          )}

          {/* 3-number summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">就緒工作區</p>
              <p className="mt-1 text-xl font-semibold">
                {kpis.readyWorkspaces}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  / {kpis.totalWorkspaces}
                </span>
              </p>
            </div>
            <div className="rounded-xl border border-border/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">已就緒文件</p>
              <p className="mt-1 text-xl font-semibold">
                {kpis.totalReady}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  / {kpis.totalRegistered}
                </span>
              </p>
            </div>
            <div
              className={[
                "rounded-xl border px-4 py-3",
                kpis.orgReadyRatio < 50 && kpis.totalRegistered > 0
                  ? "border-amber-400/40 bg-amber-50/30 dark:bg-amber-950/20"
                  : "border-border/40",
              ].join(" ")}
            >
              <p className="text-xs text-muted-foreground">就緒比例</p>
              <p
                className={[
                  "mt-1 text-xl font-semibold",
                  kpis.orgReadyRatio < 50 && kpis.totalRegistered > 0
                    ? "text-amber-600 dark:text-amber-400"
                    : "",
                ].join(" ")}
              >
                {kpis.orgReadyRatio}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Per-workspace health list ─────────────────────────────────────── */}
      <Card className="border border-border/50">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>工作區知識庫狀態</CardTitle>
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-7 w-48 pl-7 text-xs"
                placeholder="搜尋工作區名稱…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入中…</p>
          )}
          {loadState === "loaded" && entries.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的工作區。</p>
          )}
          {loadState === "loaded" && entries.length > 0 && filteredEntries.length === 0 && (
            <p className="py-2 text-center text-sm text-muted-foreground">
              沒有符合搜尋條件的工作區。
            </p>
          )}
          {loadState === "loaded" &&
            filteredEntries.map((entry) => (
              <WorkspaceHealthCard key={entry.workspace.id} entry={entry} />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
