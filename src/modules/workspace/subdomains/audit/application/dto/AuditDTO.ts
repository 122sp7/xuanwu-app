import { z } from "@lib-zod";
import { AUDIT_ACTIONS } from "../../domain/value-objects/AuditAction";
import { AUDIT_SEVERITIES } from "../../domain/value-objects/AuditSeverity";

export const RecordAuditEntrySchema = z.object({
  workspaceId: z.string().uuid(),
  actorId: z.string(),
  action: z.enum(AUDIT_ACTIONS),
  resourceType: z.string().min(1),
  resourceId: z.string(),
  severity: z.enum(AUDIT_SEVERITIES),
  detail: z.string(),
  source: z.enum(["workspace", "finance", "notification", "system"]),
  changes: z.array(z.object({ field: z.string(), oldValue: z.unknown(), newValue: z.unknown() })).optional(),
});

export type RecordAuditEntryDTO = z.infer<typeof RecordAuditEntrySchema>;
