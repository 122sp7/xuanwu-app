import { z } from "@lib-zod";

export const AUDIT_ACTIONS = ["create", "update", "delete", "login", "export"] as const;

export const AuditActionSchema = z.enum(AUDIT_ACTIONS).brand("AuditAction");
export type AuditAction = z.infer<typeof AuditActionSchema>;

export function createAuditAction(raw: string): AuditAction {
  return AuditActionSchema.parse(raw);
}
