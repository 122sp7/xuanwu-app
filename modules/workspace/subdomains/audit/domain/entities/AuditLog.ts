export type AuditLogSource = "workspace" | "finance" | "notification" | "system";

/**
 * AuditLogEntity
 * 
 * actorId: Receives platform's "actor reference" published language token.
 * This field DOES NOT own Actor semantics — it consumes the token from platform.
 * (See AGENTS.md ubiquitous language for context map rules.)
 */
export interface AuditLogEntity {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly action: string;
  readonly detail: string;
  readonly source: AuditLogSource;
  readonly occurredAtISO: string;
}
