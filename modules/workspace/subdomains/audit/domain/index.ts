// ── Existing domain types ────────────────────────────────────────────────────
export type { AuditLogEntity, AuditLogSource } from "./entities/AuditLog";
export type { AuditLog, AuditAction, AuditSeverity, ChangeRecord } from "./schema";
export { AuditLogSchema, AUDIT_ACTIONS, AUDIT_SEVERITIES } from "./schema";
export type { AuditRepository } from "./repositories/AuditRepository";

// ── Rich DDD additions ──────────────────────────────────────────────────────
export * from "./aggregates";
export * from "./events";
export * from "./services";
export * from "./value-objects";

