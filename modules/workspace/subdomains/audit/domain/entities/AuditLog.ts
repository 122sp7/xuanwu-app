export type AuditLogSource = "workspace" | "finance" | "notification" | "system";

export interface AuditLogEntity {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly action: string;
  readonly detail: string;
  readonly source: AuditLogSource;
  readonly occurredAtISO: string;
}
