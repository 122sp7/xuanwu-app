/**
 * Audit subdomain schema — immutable operation records.
 */

import { z } from "@lib-zod";
import { BaseEntitySchema } from "@/modules/shared/domain/types";

export const AUDIT_ACTIONS = ["create", "update", "delete", "login", "export"] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export const AUDIT_SEVERITIES = ["low", "medium", "high", "critical"] as const;
export type AuditSeverity = (typeof AUDIT_SEVERITIES)[number];

const ChangeRecordSchema = z.object({
  field: z.string(),
  oldValue: z.unknown(),
  newValue: z.unknown(),
});

export type ChangeRecord = z.infer<typeof ChangeRecordSchema>;

export const AuditLogSchema = BaseEntitySchema.extend({
  action: z.enum(AUDIT_ACTIONS),
  resourceType: z.string(),
  resourceId: z.string(),
  severity: z.enum(AUDIT_SEVERITIES),
  changes: z.array(ChangeRecordSchema).optional(),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;
