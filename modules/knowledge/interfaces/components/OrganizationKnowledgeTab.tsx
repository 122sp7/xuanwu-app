"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArchiveIcon,
  ChevronRightIcon,
  DatabaseIcon,
  RefreshCwIcon,
  SearchIcon,
} from "lucide-react";
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
import { Separator } from "@/ui/shadcn/ui/separator";
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

// ── Helpers ────────────────────────────────────────────────────────────────────

function stubAction(name: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[OrganizationKnowledgeTab] Action stub: ${name}`);
  }
}

const summaryStatusVariantMap = {
  "needs-input": "outline",
  staged: "secondary",
  ready: "default",
} as const;

// ── Sub-components ─────────────────────────────────────────────────────────────

interface OrgKpiCardProps {
  readonly label: string;
  readonly value: number | string;
  readonly sub?: string;
  readonly variant?: "default" | "warning" | "destructive";
}

function OrgKpiCard({ label, value, sub, variant = "default" }: OrgKpiCardProps) {
  return (
    <div
      className={[
        "rounded-xl border px-4 py-3",
        variant === "destructive"
          ? "border-destructive/40 bg-destructive/5"
          : variant === "warning"
            ? "border-amber-400/40 bg-amber-50/30 dark:bg-amber-950/20"
            : "border-border/40",
      ].join(" ")}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={[
          "mt-1 text-xl font-semibold",
          variant === "destructive" ? "text-destructive" : "",
          variant === "warning" ? "text-amber-600 dark:text-amber-400" : "",
        ].join(" ")}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

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
        {/* Workspace identity */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="link" className="h-auto p-0 text-sm font-semibold">
              <Link href={`/workspace/${workspace.id}?tab=Knowledge`}>
                {workspace.name}
              </Link>
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

          {/* Asset counts + progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {ready} / {registered} ready
              </span>
              <span>{readyRatio}%</span>
            </div>
            <Progress value={readyRatio} className="h-1.5" />
          </div>

          {/* Blocked reasons */}
          {summary.blockedReasons.length > 0 && (
            <ul className="list-disc space-y-0.5 pl-4 text-xs text-amber-600 dark:text-amber-400">
              {summary.blockedReasons.slice(0, 2).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
              {summary.blockedReasons.length > 2 && (
                <li>+{summary.blockedReasons.length - 2} more</li>
              )}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex shrink-0 flex-wrap items-start justify-end gap-1">
          <Button asChild variant="outline" size="sm" className="h-6 gap-1 text-xs">
            <Link href={`/workspace/${workspace.id}?tab=Knowledge`}>
              <ChevronRightIcon className="size-3" />
              Manage
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-6 gap-1 text-xs">
            <Link href={`/workspace/${workspace.id}?tab=Files`}>
              Upload
            </Link>
          </Button>
        </div>
      </div>

      <p className="mt-2 break-all font-mono text-[10px] text-muted-foreground/50">
        {workspace.id}
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function OrganizationKnowledgeTab({ workspaces }: OrganizationKnowledgeTabProps) {
  const [entries, setEntries] = useState<readonly WorkspaceKnowledgeEntry[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [searchQuery, setSearchQuery] = useState("");

  const loadAll = useCallback(async () => {
    setLoadState("loading");
    try {
      const results = await Promise.all(
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
                blockedReasons: ["summary load failed"],
                nextActions: [],
                visibleSurface: "workspace-tab-live" as const,
                contractStatus: "contract-live" as const,
              },
            };
          }
        }),
      );
      setEntries(results);
      setLoadState("loaded");
    } catch {
      setEntries([]);
      setLoadState("error");
    }
  }, [workspaces]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  // ── Aggregate KPIs ────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    let totalRegistered = 0;
    let totalReady = 0;
    let readyWorkspaces = 0;
    let needsInputWorkspaces = 0;
    let stagedWorkspaces = 0;

    for (const { summary } of entries) {
      totalRegistered += Math.max(0, summary.registeredAssetCount);
      totalReady += Math.max(0, summary.readyAssetCount);
      if (summary.status === "ready") readyWorkspaces += 1;
      else if (summary.status === "staged") stagedWorkspaces += 1;
      else needsInputWorkspaces += 1;
    }

    const orgReadyRatio =
      totalRegistered > 0
        ? Math.max(0, Math.min(100, Math.round((totalReady / totalRegistered) * 100)))
        : 0;

    return {
      totalRegistered,
      totalReady,
      orgReadyRatio,
      readyWorkspaces,
      stagedWorkspaces,
      needsInputWorkspaces,
      totalWorkspaces: entries.length,
    };
  }, [entries]);

  // ── Filtered workspace list ───────────────────────────────────────────────
  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(({ workspace }) =>
      workspace.name.toLowerCase().includes(q) ||
      workspace.id.toLowerCase().includes(q),
    );
  }, [entries, searchQuery]);

  return (
    <div className="space-y-4">
      {/* ── Org-level KPI summary ─────────────────────────────────────── */}
      <Card className="border border-border/50">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DatabaseIcon className="size-5" />
                Enterprise Knowledge Base
              </CardTitle>
              <CardDescription>
                跨工作區知識庫健康狀態總覽。點擊工作區名稱可直接跳至詳細管理頁。
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => void loadAll()}
              disabled={loadState === "loading"}
            >
              <RefreshCwIcon className="size-3" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadState === "error" && (
            <p className="text-sm text-destructive">無法載入知識摘要，請稍後再試。</p>
          )}

          {/* Aggregate KPI row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <OrgKpiCard label="Total Workspaces" value={kpis.totalWorkspaces} />
            <OrgKpiCard
              label="Ready Workspaces"
              value={kpis.readyWorkspaces}
              sub={`of ${kpis.totalWorkspaces}`}
            />
            <OrgKpiCard
              label="Staged"
              value={kpis.stagedWorkspaces}
              variant={kpis.stagedWorkspaces > 0 ? "warning" : "default"}
            />
            <OrgKpiCard
              label="Needs Input"
              value={kpis.needsInputWorkspaces}
              variant={kpis.needsInputWorkspaces > 0 ? "warning" : "default"}
            />
            <OrgKpiCard label="Total Docs Registered" value={kpis.totalRegistered} />
            <OrgKpiCard
              label="Org Ready Ratio"
              value={`${kpis.orgReadyRatio}%`}
              sub={`${kpis.totalReady} / ${kpis.totalRegistered} docs`}
              variant={
                kpis.orgReadyRatio < 50
                  ? "warning"
                  : "default"
              }
            />
          </div>

          {/* Org-level progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Org-wide knowledge readiness</span>
              <span>{kpis.orgReadyRatio}%</span>
            </div>
            <Progress value={kpis.orgReadyRatio} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* ── Knowledge Search (design anchor) ─────────────────────────── */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchIcon className="size-4" />
            Knowledge Search
          </CardTitle>
          <CardDescription>
            跨工作區語意搜尋（設計錨點）。後端 RAG 查詢介面尚未接線，此 UI 作為未來 retrieval API 的呼叫入口。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="輸入問題或關鍵字，跨工作區語意搜尋知識庫…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  stubAction("knowledge-search-input");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") stubAction("knowledge-search-submit");
                }}
              />
            </div>
            <Button
              variant="default"
              onClick={() => stubAction("knowledge-search-submit")}
            >
              Search
            </Button>
          </div>

          {/* Search results placeholder */}
          <div className="rounded-xl border border-dashed border-border/40 px-4 py-6 text-center">
            <SearchIcon className="mx-auto size-8 text-muted-foreground/30" />
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              搜尋結果將顯示於此
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              RAG retrieval 後端尚未接線。結果格式：文件片段 + 來源工作區 + 頁碼 + 相關度分數。
            </p>
          </div>

          {/* Result format preview (design anchor) */}
          <div className="rounded-xl border border-border/30 bg-muted/20 px-4 py-4">
            <p className="text-xs font-semibold text-muted-foreground">Expected result shape (design anchor)</p>
            <div className="mt-2 space-y-2">
              {[
                { score: "0.92", workspace: "HR工作區", doc: "2026員工手冊.pdf", page: 5, snippet: "特休假計算方式依勞基法第38條規定…" },
                { score: "0.88", workspace: "法務工作區", doc: "公司規章_v3.pdf", page: 12, snippet: "年資滿一年者享有七日帶薪年假…" },
              ].map((r) => (
                <div key={r.doc} className="rounded-lg border border-border/30 bg-background px-3 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-mono">
                        score {r.score}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{r.workspace}</span>
                      <span className="text-xs text-muted-foreground">›</span>
                      <span className="text-xs font-medium">{r.doc}</span>
                      <span className="text-xs text-muted-foreground">p.{r.page}</span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{r.snippet}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground/50">
              ⚠ 以上為靜態設計錨點，非真實查詢結果。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Per-workspace health cards ────────────────────────────────── */}
      <Card className="border border-border/50">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>Workspace Knowledge Health</CardTitle>
              <CardDescription>各工作區知識庫健康狀態，含 ready 比例與封鎖原因。</CardDescription>
            </div>
            {/* Workspace filter */}
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-7 w-48 pl-7 text-xs"
                placeholder="Filter workspaces…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">Loading workspace knowledge summaries…</p>
          )}

          {loadState === "loaded" && entries.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的工作區。</p>
          )}

          {loadState === "loaded" && entries.length > 0 && filteredEntries.length === 0 && (
            <p className="py-2 text-center text-sm text-muted-foreground">
              沒有符合篩選條件的工作區。
            </p>
          )}

          {loadState === "loaded" &&
            filteredEntries.map((entry) => (
              <WorkspaceHealthCard key={entry.workspace.id} entry={entry} />
            ))}
        </CardContent>
      </Card>

      {/* ── Org-level governance overview ─────────────────────────────── */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArchiveIcon className="size-4" />
            Knowledge Governance Overview
          </CardTitle>
          <CardDescription>
            跨工作區知識治理總覽。封存管理、版本一致性與稽核記錄概覽（設計錨點）。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">Archive Health</p>
              <p className="mt-1 text-xs text-muted-foreground">
                各工作區封存文件數量，確認過期文件已正確 archived。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => stubAction("org-archive-health")}
              >
                View archive report
              </Button>
            </div>

            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">Version Consistency</p>
              <p className="mt-1 text-xs text-muted-foreground">
                確認每個 versionGroupId 只有一份 isLatest=true，偵測雙 latest 異常。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => stubAction("org-version-consistency-check")}
              >
                Run consistency check
              </Button>
            </div>

            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">Org Audit Trail</p>
              <p className="mt-1 text-xs text-muted-foreground">
                跨工作區知識庫操作稽核：上傳、封存、回滾、存取控制變更。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => stubAction("org-knowledge-audit-log")}
              >
                View audit log
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">Access Control Review</p>
              <p className="mt-1 text-xs text-muted-foreground">
                檢視各工作區 RBAC 設定，確認 accessControl 陣列不含無效角色或已離職成員 ID。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => stubAction("org-acl-review")}
              >
                Review ACL
              </Button>
            </div>

            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">Expiry Monitor</p>
              <p className="mt-1 text-xs text-muted-foreground">
                列出 expiresAtISO 在未來 30 天內的文件，提醒知識庫管理員更新或封存。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => stubAction("org-expiry-monitor")}
              >
                View expiring docs
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/60">
            ⚠ Governance actions are design anchors only. Backend implementation follows{" "}
            <code className="text-[10px]">docs/architecture/knowledge.md</code> §3 and §5 specs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
