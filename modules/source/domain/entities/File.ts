export type FileStatus = "active" | "archived" | "deleted";

export interface File {
  readonly id: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly accountId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly classification: "image" | "manifest" | "record" | "other";
  readonly tags: readonly string[];
  readonly currentVersionId: string;
  readonly retentionPolicyId?: string;
  readonly status: FileStatus;
  readonly source?: string;
  readonly detail?: string;
  readonly href?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
  readonly deletedAtISO?: string;
}

const ARCHIVEABLE_STATUS: readonly FileStatus[] = ["active"];
const RESTOREABLE_STATUS: readonly FileStatus[] = ["archived"];

export function canArchiveFile(file: File): boolean {
  return ARCHIVEABLE_STATUS.includes(file.status);
}

export function canRestoreFile(file: File): boolean {
  return RESTOREABLE_STATUS.includes(file.status);
}
