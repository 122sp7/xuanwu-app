import { z } from "@lib-zod";

import { AUDIT_ACTIONS } from "../schema";

export const AuditActionSchema = z.enum(AUDIT_ACTIONS).brand("AuditAction");

export type AuditAction = z.infer<typeof AuditActionSchema>;

export function createAuditAction(raw: string): AuditAction {
  return AuditActionSchema.parse(raw);
}

export function unsafeAuditAction(raw: string): AuditAction {
  return raw as AuditAction;
}
