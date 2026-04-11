"use client";

import { useEffect, useState } from "react";

import type { AuditLogEntity } from "../../application/dto/audit.dto";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Badge } from "@ui-shadcn/ui/badge";
import { getWorkspaceAuditLogs } from "../queries/audit.queries";

function formatAuditDate(value: string) {
  if (!value) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

interface WorkspaceAuditTabProps {
  readonly workspaceId: string;
}

export function WorkspaceAuditTab({ workspaceId }: WorkspaceAuditTabProps) {
  const [logs, setLogs] = useState<AuditLogEntity[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadLogs() {
      setLoadState("loading");

      try {
        const nextLogs = await getWorkspaceAuditLogs(workspaceId);
        if (cancelled) {
          return;
        }

        setLogs(nextLogs);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspaceAuditTab] Failed to load audit logs:", error);
        }

        if (!cancelled) {
          setLogs([]);
          setLoadState("error");
        }
      }
    }

    void loadLogs();

    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Audit</CardTitle>
        <CardDescription>
          工作區相關行為紀錄、來源與時間軸。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading audit log…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">
            無法載入 audit log，請重新整理頁面或稍後再試。
          </p>
        )}

        {loadState === "loaded" && logs.length === 0 && (
          <p className="text-sm text-muted-foreground">
            目前尚未記錄這個工作區的 audit entries。
          </p>
        )}

        {loadState === "loaded" && logs.length > 0 && (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-border/40 px-4 py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{log.action}</p>
                      <Badge variant="outline">{log.source}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.detail || "—"}</p>
                    <p className="text-xs text-muted-foreground">Actor: {log.actorId}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatAuditDate(log.occurredAtISO)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
