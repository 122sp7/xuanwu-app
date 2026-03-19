export type FileVersionStatus = "pending" | "stored" | "active" | "superseded";

export interface FileVersion {
  readonly id: string;
  readonly fileId: string;
  readonly versionNumber: number;
  readonly status: FileVersionStatus;
  readonly storagePath: string;
  readonly checksum?: string;
  readonly createdAtISO: string;
}

export function isVersionImmutable(version: FileVersion): boolean {
  return version.status === "active" || version.status === "superseded";
}

