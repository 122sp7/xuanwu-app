export type { AuditLogEntity, AuditLogSource } from "./domain/entities/AuditLog";
export type { AuditRepository } from "./domain/repositories/AuditRepository";
export {
  ListOrganizationAuditLogsUseCase,
  ListWorkspaceAuditLogsUseCase,
} from "./application/use-cases/audit.use-cases";
export { FirebaseAuditRepository } from "./infrastructure/firebase/FirebaseAuditRepository";
export {
  getOrganizationAuditLogs,
  getWorkspaceAuditLogs,
} from "./interfaces/queries/audit.queries";
export { WorkspaceAuditTab } from "./interfaces/components/WorkspaceAuditTab";

// ── 新增：精簡領域 Schema 與 Presentation 元件（奧卡姆剃刀重構） ──────────
export type {
  AuditLog,
  AuditAction,
  AuditSeverity,
  ChangeRecord,
} from "./domain/schema";
export { AuditLogSchema, AUDIT_ACTIONS, AUDIT_SEVERITIES } from "./domain/schema";
export { AuditStream } from "./presentation/AuditStream";
