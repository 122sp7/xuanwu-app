/**
 * workspace/subdomains/audit API boundary.
 */

export type { AuditLogEntity, AuditLogSource } from "../domain/entities/AuditLog";

export type {
  AuditLog,
  AuditAction,
  AuditSeverity,
  ChangeRecord,
} from "../domain/schema";

export { AuditLogSchema, AUDIT_ACTIONS, AUDIT_SEVERITIES } from "../domain/schema";

export {
  getOrganizationAuditLogs,
  getWorkspaceAuditLogs,
  recordWorkspaceAuditEntry,
} from "../interfaces/composition/audit-service";

export { WorkspaceAuditTab } from "../interfaces/components/WorkspaceAuditTab";
export { AuditStream } from "../interfaces/components/AuditStream";
export { OrganizationAuditRouteScreen } from "../interfaces/components/screens/OrganizationAuditRouteScreen";
export type { RecordAuditEntryInput } from "../domain/aggregates/AuditEntry";
