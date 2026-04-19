"use client";

/**
 * WorkspaceAuditSection — workspace.audit tab — activity / audit log.
 */

import { Badge, Button } from "@packages";
import { Activity, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createClientAuditUseCases } from "../../outbound/firebase-composition";
import type { AuditEntrySnapshot } from "../../../subdomains/audit/domain/entities/AuditEntry";
import {
  AUDIT_EVENT_TYPES,
  matchesAuditEventType,
  type EventTypeFilter,
} from "./workspace-audit-filter";
const auditUseCases = createClientAuditUseCases();

interface WorkspaceAuditSectionProps {
  workspaceId: string;
  accountId: string;
}

export function WorkspaceAuditSection({
  workspaceId,
  accountId: _accountId,
}: WorkspaceAuditSectionProps): React.ReactElement {
  const { listAuditEntriesByWorkspace } = auditUseCases;
  const [eventType, setEventType] = useState<EventTypeFilter>("全部");
  const [auditEntries, setAuditEntries] = useState<AuditEntrySnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    const sorted = [...auditEntries].sort(
      (a, b) => new Date(b.recordedAtISO).getTime() - new Date(a.recordedAtISO).getTime(),
    );

    return sorted.filter((entry) => matchesAuditEventType(entry, eventType));
  }, [auditEntries, eventType]);

  useEffect(() => {
    let active = true;
    void listAuditEntriesByWorkspace.execute(workspaceId).then((result) => {
      if (active) {
        setAuditEntries(result);
        setLoadError(null);
        setIsLoading(false);
      }
    }).catch(() => {
      if (active) {
        setAuditEntries([]);
        setLoadError("日誌載入失敗，請稍後再試。");
        setIsLoading(false);
      }
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
        {AUDIT_EVENT_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setEventType(type)}
            aria-pressed={eventType === type}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              eventType === type
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:bg-muted/60"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {loadError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {loadError}
        </p>
      )}

      {isLoading ? (
        <div className="rounded-xl border border-border/40 bg-card/20 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">日誌載入中…</p>
        </div>
      ) : filteredEntries.length > 0 ? (
        <div className="space-y-2 rounded-xl border border-border/40 bg-card/20 p-2">
          {filteredEntries.map((entry) => (
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
          <p className="text-sm font-medium text-muted-foreground">
            {eventType === "全部" ? "尚無日誌記錄" : `「${eventType}」目前無日誌`}
          </p>
          {eventType === "全部" && (
            <p className="mt-1 text-xs text-muted-foreground/70">
              工作區成員的操作行為（建立、修改、刪除）將自動記錄於此。
            </p>
          )}
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
