import { z } from "zod";

export const AUDIT_SEVERITIES = ["low", "medium", "high", "critical"] as const;

export const AuditSeveritySchema = z.enum(AUDIT_SEVERITIES).brand("AuditSeverity");
export type AuditSeverity = z.infer<typeof AuditSeveritySchema>;

export function createAuditSeverity(raw: string): AuditSeverity {
  return AuditSeveritySchema.parse(raw);
}

export function severityLevel(severity: AuditSeverity): number {
  const levels: Record<string, number> = { low: 0, medium: 1, high: 2, critical: 3 };
  return levels[severity] ?? 0;
}
