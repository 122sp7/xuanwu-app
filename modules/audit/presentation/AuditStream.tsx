"use client";

/**
 * AuditStream — 高密度稽核事件時間軸。
 * 以不可變事件流的視覺語言呈現：誰、何時、做了什麼。
 */

import { format } from "date-fns";
import { zhTW } from "date-fns/locale/zh-TW";
import { ShieldAlert } from "lucide-react";

import { Badge } from "@ui-shadcn/ui/badge";
import { ScrollArea } from "@ui-shadcn/ui/scroll-area";

import type { AuditLog, AuditSeverity } from "../domain/schema";

// ── 嚴重程度視覺樣式 ──────────────────────────────────────────────────────

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

// ── 操作類型中文標籤 ──────────────────────────────────────────────────────

const ACTION_LABEL: Record<string, string> = {
  create: "建立",
  update: "更新",
  delete: "刪除",
  login: "登入",
  export: "匯出",
};

// ── 單筆事件列 ─────────────────────────────────────────────────────────────

interface AuditRowProps {
  log: AuditLog;
}

function AuditRow({ log }: AuditRowProps) {
  const timeLabel = (() => {
    try {
      return format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss", { locale: zhTW });
    } catch {
      return log.createdAt;
    }
  })();

  const actionLabel = ACTION_LABEL[log.action] ?? log.action;
  const changeCount = log.changes?.length ?? 0;

  return (
    <div className="mb-6 ml-6 relative group">
      {/* 時間軸節點 */}
      <span
        className={`absolute -left-[1.85rem] flex h-3.5 w-3.5 items-center justify-center rounded-full ring-2 ring-background ${SEVERITY_DOT[log.severity]}`}
      />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
        <div className="space-y-0.5 min-w-0">
          {/* 操作摘要 */}
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            <span className="font-semibold truncate max-w-[120px]">
              {log.createdBy.name}
            </span>
            <span className="text-muted-foreground">執行了</span>
            <Badge variant="outline" className="text-xs uppercase px-1.5 py-0">
              {actionLabel}
            </Badge>
            <span className="text-muted-foreground">於</span>
            <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">
              {log.resourceType}
            </code>
            {log.severity === "critical" && (
              <ShieldAlert className="h-3.5 w-3.5 text-destructive shrink-0" />
            )}
          </div>

          {/* 變更摘要 */}
          {changeCount > 0 && (
            <p className="text-xs text-muted-foreground">
              變更了 {changeCount} 個欄位
              {log.changes?.[0] ? `，包含「${log.changes[0].field}」` : ""}
            </p>
          )}

          {/* 嚴重程度 + 工作區來源 */}
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="secondary"
              className="text-xs px-1.5 py-0"
            >
              {SEVERITY_LABEL[log.severity]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              @{log.workspaceId}
            </span>
          </div>
        </div>

        {/* 時間 */}
        <time className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
          {timeLabel}
        </time>
      </div>
    </div>
  );
}

// ── 主要元件 ────────────────────────────────────────────────────────────────

interface AuditStreamProps {
  /** 稽核日誌清單（由外部查詢後傳入） */
  logs: AuditLog[];
  /** ScrollArea 高度，預設 600px */
  height?: number;
}

export function AuditStream({ logs, height = 600 }: AuditStreamProps) {
  if (logs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        目前尚無稽核紀錄。
      </p>
    );
  }

  return (
    <ScrollArea className="w-full rounded-md border" style={{ height }}>
      <div className="p-4">
        {/* 時間軸容器 */}
        <div className="relative border-l border-border/60 ml-1.5">
          {logs.map((log) => (
            <AuditRow key={log.id} log={log} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
