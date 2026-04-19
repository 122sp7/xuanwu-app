import type { AuditEntrySnapshot } from "../../../subdomains/audit/domain/entities/AuditEntry";

export const AUDIT_EVENT_TYPES = ["全部", "任務", "成員", "設定", "文件"] as const;
export type EventTypeFilter = (typeof AUDIT_EVENT_TYPES)[number];

export function matchesAuditEventType(entry: AuditEntrySnapshot, eventType: EventTypeFilter): boolean {
  if (eventType === "全部") return true;
  const typeSource = `${entry.action} ${entry.resourceType} ${entry.detail}`.toLowerCase();
  if (eventType === "任務") return typeSource.includes("task");
  if (eventType === "成員") return typeSource.includes("member");
  if (eventType === "設定") return typeSource.includes("setting") || typeSource.includes("config");
  if (eventType === "文件") return typeSource.includes("file") || typeSource.includes("document");
  return true;
}
