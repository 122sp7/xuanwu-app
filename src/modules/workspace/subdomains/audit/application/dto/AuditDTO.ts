import { z } from "zod";
import { AuditActionSchema } from "../../domain/value-objects/AuditAction";
import { AuditSeveritySchema } from "../../domain/value-objects/AuditSeverity";

export const RecordAuditEntrySchema = z.object({
  workspaceId: z.string().uuid(),
  actorId: z.string(),
  action: AuditActionSchema,
  resourceType: z.string().min(1),
  resourceId: z.string(),
  severity: AuditSeveritySchema,
  detail: z.string(),
  source: z.enum(["workspace", "finance", "notification", "system"]),
  changes: z.array(z.object({ field: z.string(), oldValue: z.unknown(), newValue: z.unknown() })).optional(),
});

export type RecordAuditEntryDTO = z.infer<typeof RecordAuditEntrySchema>;
