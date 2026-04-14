"use client";

import { useEffect, useMemo, useState } from "react";

import { useAccountRouteContext } from "@/modules/platform/api/ui";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";

import { useWorkspaceHub } from "../../../../../interfaces/web/hooks/useWorkspaceHub";
import { AuditStream } from "../AuditStream";
import { getOrganizationAuditLogs } from "../../queries/audit.queries";

function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(value instanceof Date ? value : new Date(value));
  } catch {
    return value instanceof Date ? value.toISOString() : String(value);
  }
}

const MAX_DISPLAYED_AUDIT_LOGS = 50;

export function OrganizationAuditRouteScreen() {
  const { organizationId, isResolvingOrganizationRoute } = useAccountRouteContext();
  const { loadState: workspaceLoadState, workspaces } = useWorkspaceHub({
    accountId: organizationId,
    accountType: "organization",
  });
  const [auditLogs, setAuditLogs] = useState<
    Awaited<ReturnType<typeof getOrganizationAuditLogs>>
  >([]);
  const [auditLoadState, setAuditLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  const workspaceNameById = useMemo(
    () => new Map(workspaces.map((workspace) => [workspace.id, workspace.name])),
    [workspaces],
  );

  useEffect(() => {
    if (!organizationId || workspaceLoadState !== "loaded") {
      return;
    }

    let cancelled = false;
    const workspaceIds = workspaces.map((workspace) => workspace.id);

    async function load() {
      setAuditLoadState("loading");
      try {
        const logs = await getOrganizationAuditLogs(workspaceIds, MAX_DISPLAYED_AUDIT_LOGS);
        if (!cancelled) {
          setAuditLogs(logs);
          setAuditLoadState("loaded");
        }
      } catch {
        if (!cancelled) {
          setAuditLogs([]);
          setAuditLoadState("error");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [organizationId, workspaceLoadState, workspaces]);

  if (isResolvingOrganizationRoute) {
    return <p className="text-sm text-muted-foreground">正在同步組織帳號內容…</p>;
  }

  if (!organizationId) {
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
          {(workspaceLoadState === "loading" || auditLoadState === "loading") && (
            <p className="text-sm text-muted-foreground">載入稽核資料中…</p>
          )}
          {(workspaceLoadState === "error" || auditLoadState === "error") && (
            <p className="text-sm text-destructive">讀取稽核資料失敗，請稍後重新整理頁面。</p>
          )}
          {workspaceLoadState === "loaded" && auditLoadState === "loaded" && auditLogs.length === 0 && (
            <p className="text-sm text-muted-foreground">目前沒有可顯示的 audit logs。</p>
          )}
          {workspaceLoadState === "loaded" && auditLoadState === "loaded" &&
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