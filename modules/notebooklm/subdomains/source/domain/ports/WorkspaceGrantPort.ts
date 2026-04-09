/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/ports
 * Port: WorkspaceGrantPort — resolves per-actor workspace permissions snapshot.
 */

export interface WorkspaceGrantSnapshot {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly grantVersion: number;
  readonly canRead: boolean;
  readonly canUpload: boolean;
  readonly canDownload: boolean;
  readonly canArchive: boolean;
  readonly canRestore: boolean;
}

export interface WorkspaceGrantPort {
  getWorkspaceGrantSnapshot(
    workspaceId: string,
    actorAccountId: string,
  ): WorkspaceGrantSnapshot | null;
}
