"use client";

/**
 * WorkspaceAuditSection — workspace.audit tab — activity / audit log.
 */

import { Badge, Button } from "@packages";
import { Activity, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { createClientAuditUseCases } from "../../outbound/firebase-composition";
import type { AuditEntrySnapshot } from "../../../subdomains/audit/domain/entities/AuditEntry";
const auditUseCases = createClientAuditUseCases();

interface WorkspaceAuditSectionProps {
  workspaceId: string;
  accountId: string;
}

const EVENT_TYPES = ["全部", "任務", "成員", "設定", "文件"] as const;

export function WorkspaceAuditSection({
  workspaceId,
  accountId: _accountId,
}: WorkspaceAuditSectionProps): React.ReactElement {
  const { listAuditEntriesByWorkspace } = auditUseCases;
  const [auditEntries, setAuditEntries] = useState<AuditEntrySnapshot[]>([]);

  useEffect(() => {
    let active = true;
    void listAuditEntriesByWorkspace.execute(workspaceId).then((result) => {
      if (active) setAuditEntries(result);
    }).catch(() => {
      if (active) setAuditEntries([]);
    });
    return () => { active = false; };
  }, [listAuditEntriesByWorkspace, workspaceId]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">日誌</h2>
        </div>
        <Button size="sm" variant="ghost" disabled>
          <Filter className="size-3.5" />
          篩選
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {EVENT_TYPES.map((type, i) => (
          <Badge key={type} variant={i === 0 ? "default" : "outline"} className="cursor-pointer text-xs">
            {type}
          </Badge>
        ))}
      </div>

      {auditEntries.length > 0 ? (
        <div className="space-y-2 rounded-xl border border-border/40 bg-card/20 p-2">
          {auditEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-border/30 bg-card/40 px-3 py-2.5"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{entry.detail}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.resourceType}:{entry.resourceId} · {entry.recordedAtISO}
                </p>
              </div>
              <Badge variant={entry.severity === "critical" ? "default" : "outline"}>
                {entry.action}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
          <Activity className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">尚無日誌記錄</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            工作區成員的操作行為（建立、修改、刪除）將自動記錄於此。
          </p>
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
