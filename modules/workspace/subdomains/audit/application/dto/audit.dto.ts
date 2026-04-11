/**
 * Application-layer DTO re-exports for the audit subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { AuditLogEntity, AuditLogSource } from "../../domain/entities/AuditLog";
export type { AuditSeverity } from "../../domain/schema";
