/**
 * workspace/audit domain/ports — driven port interfaces for the audit subdomain.
 *
 * Re-exports the repository contract from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { AuditRepository } from "../repositories/AuditRepository";
