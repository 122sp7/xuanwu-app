export interface PermissionSnapshot {
  readonly actorAccountId: string;
  readonly actorRole: string;
  readonly organizationPolicyVersion: number;
  readonly workspaceGrantVersion: number;
  readonly canRead: boolean;
  readonly canUpload: boolean;
  readonly canDownload: boolean;
  readonly canArchive: boolean;
  readonly canRestore: boolean;
  readonly resolvedAtISO: string;
}

