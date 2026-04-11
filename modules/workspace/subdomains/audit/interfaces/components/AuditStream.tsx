"use client";

import { format } from "date-fns";
import { zhTW } from "date-fns/locale/zh-TW";
import { ShieldAlert } from "lucide-react";

import { Badge } from "@ui-shadcn/ui/badge";
import { ScrollArea } from "@ui-shadcn/ui/scroll-area";

import type { AuditLogEntity, AuditLogSource } from "../../application/dto/audit.dto";
import type { AuditSeverity } from "../../application/dto/audit.dto";

interface AuditStreamItem {
  id: string;
  actorName: string;
  action: string;
  resourceType: string;
  detail: string;
  severity: AuditSeverity;
  workspaceId: string;
  occurredAtISO: string;
}

const SOURCE_SEVERITY: Record<AuditLogSource, AuditSeverity> = {
  workspace: "low",
  finance: "high",
  notification: "low",
  system: "medium",
};

function toStreamItem(entity: AuditLogEntity): AuditStreamItem {
  return {
    id: entity.id,
    actorName: entity.actorId,
    action: entity.action,
    resourceType: entity.source,
    detail: entity.detail,
    severity: SOURCE_SEVERITY[entity.source] ?? "low",
    workspaceId: entity.workspaceId,
    occurredAtISO: entity.occurredAtISO,
  };
}

const SEVERITY_DOT: Record<AuditSeverity, string> = {
  low: "bg-muted-foreground/40",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  critical: "bg-destructive",
};

const SEVERITY_LABEL: Record<AuditSeverity, string> = {
  low: "低",
  medium: "中",
  high: "高",
  critical: "嚴重",
};

interface AuditRowProps {
  item: AuditStreamItem;
}

function AuditRow({ item }: AuditRowProps) {
  const timeLabel = (() => {
    try {
      return format(new Date(item.occurredAtISO), "yyyy-MM-dd HH:mm:ss", { locale: zhTW });
    } catch {
      return item.occurredAtISO;
    }
  })();

  return (
    <div className="mb-6 ml-6 relative group">
      <span
        className={`absolute -left-[1.85rem] flex h-3.5 w-3.5 items-center justify-center rounded-full ring-2 ring-background ${SEVERITY_DOT[item.severity]}`}
      />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
        <div className="space-y-0.5 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            <span className="font-semibold truncate max-w-[120px]">{item.actorName}</span>
            <span className="text-muted-foreground">執行了</span>
            <Badge variant="outline" className="text-xs uppercase px-1.5 py-0">
              {item.action}
            </Badge>
            <span className="text-muted-foreground">於</span>
            <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">
              {item.resourceType}
            </code>
            {item.severity === "critical" && (
              <ShieldAlert className="h-3.5 w-3.5 text-destructive shrink-0" />
            )}
          </div>

          {item.detail && (
            <p className="text-xs text-muted-foreground">{item.detail}</p>
          )}

          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {SEVERITY_LABEL[item.severity]}
            </Badge>
            <span className="text-xs text-muted-foreground">@{item.workspaceId}</span>
          </div>
        </div>

        <time className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
          {timeLabel}
        </time>
      </div>
    </div>
  );
}

interface AuditStreamProps {
  logs: readonly AuditLogEntity[];
  height?: number;
}

export function AuditStream({ logs, height = 500 }: AuditStreamProps) {
  if (logs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        目前尚無稽核紀錄。
      </p>
    );
  }

  const items = logs.map(toStreamItem);

  return (
    <ScrollArea className="w-full rounded-md border" style={{ height }}>
      <div className="p-4">
        <div className="relative border-l border-border/60 ml-1.5">
          {items.map((item) => (
            <AuditRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
