export type FileAuditAction =
  | "upload_init"
  | "upload_complete"
  | "list_files"
  | "download_url_issued"
  | "archive"
  | "restore";

export interface AuditRecord {
  readonly id: string;
  readonly fileId?: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
  readonly action: FileAuditAction;
  readonly occurredAtISO: string;
  readonly detail?: string;
}

