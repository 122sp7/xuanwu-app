/**
 * Module: workspace-audit
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Audit domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// ─── Core entity types ────────────────────────────────────────────────────────

export type { AuditLogEntity, AuditLogSource } from "../domain/entities/AuditLog";

export type {
  AuditLog,
  AuditAction,
  AuditSeverity,
  ChangeRecord,
} from "../domain/schema";

export { AuditLogSchema, AUDIT_ACTIONS, AUDIT_SEVERITIES } from "../domain/schema";

// ─── Query functions ──────────────────────────────────────────────────────────

export {
  getOrganizationAuditLogs,
  getWorkspaceAuditLogs,
} from "../interfaces/queries/audit.queries";

export { WorkspaceAuditTab } from "../interfaces/components/WorkspaceAuditTab";
export { AuditStream } from "../interfaces/components/AuditStream";
