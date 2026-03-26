"use client";

import { useEffect, useMemo, useState } from "react";

import { useApp } from "@/app/providers/app-provider";
import { AuditStream, getOrganizationAuditLogs } from "@/modules/workspace-audit/api";
import { getWorkspacesForAccount } from "@/modules/workspace/api";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { formatDateTime, isOrganizationAccount } from "../_utils";

const MAX_DISPLAYED_AUDIT_LOGS = 50;

export default function OrganizationAuditPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  const [workspaces, setWorkspaces] = useState<
    Awaited<ReturnType<typeof getWorkspacesForAccount>>
  >([]);
  const [auditLogs, setAuditLogs] = useState<
    Awaited<ReturnType<typeof getOrganizationAuditLogs>>
  >([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  useEffect(() => {
    if (!activeOrganizationId) return;
    let cancelled = false;
    const organizationId = activeOrganizationId;

    async function load() {
      setLoadState("loading");
      try {
        const nextWorkspaces = await getWorkspacesForAccount(organizationId);
        const workspaceIds = nextWorkspaces.map((w) => w.id);
        const logs = await getOrganizationAuditLogs(workspaceIds, MAX_DISPLAYED_AUDIT_LOGS);
        if (!cancelled) {
          setWorkspaces(nextWorkspaces);
          setAuditLogs(logs);
          setLoadState("loaded");
        }
      } catch {
        if (!cancelled) {
          setWorkspaces([]);
          setAuditLogs([]);
          setLoadState("error");
        }
      }
    }
    void load();

    return () => {
      cancelled = true;
    };
  }, [activeOrganizationId]);

  const workspaceNameById = useMemo(
    () => new Map(workspaces.map((w) => [w.id, w.name])),
    [workspaces],
  );

  if (!activeOrganizationId) {
    return (
      <div className="">
        <p className="text-sm text-muted-foreground">請先切換到組織帳戶。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">稽核</h1>
        <p className="mt-1 text-sm text-muted-foreground">組織下所有工作區的 audit log 彙整。</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Audit</CardTitle>
          <CardDescription>組織下所有工作區的 audit log 彙整。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">載入稽核資料中…</p>
          )}
          {loadState === "error" && (
            <p className="text-sm text-destructive">讀取稽核資料失敗，請稍後重新整理頁面。</p>
          )}
          {loadState === "loaded" && auditLogs.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的 audit logs。</p>
          )}
          {loadState === "loaded" &&
            auditLogs.slice(0, MAX_DISPLAYED_AUDIT_LOGS).map((log) => (
              <div key={log.id} className="rounded-lg border border-border/40 px-3 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{log.action}</p>
                  <Badge variant="outline">{log.source}</Badge>
                  <Badge variant="secondary">
                    {workspaceNameById.get(log.workspaceId) ?? log.workspaceId}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{log.detail || "—"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(log.occurredAtISO)}
                </p>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* ── 稽核時間軸（新版 AuditStream）─────────────────────────────── */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>稽核時間軸</CardTitle>
          <CardDescription>
            以時間軸視覺化呈現稽核事件；嚴重程度由色點標示（藍 = 中、橘 = 高、紅 = 嚴重）。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuditStream logs={auditLogs} height={500} />
        </CardContent>
      </Card>
    </div>
  );
}
