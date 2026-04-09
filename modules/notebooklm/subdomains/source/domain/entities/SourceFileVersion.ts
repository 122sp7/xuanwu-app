/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Entity: SourceFileVersion — immutable version snapshot of a source file.
 */

export type SourceFileVersionStatus = "pending" | "stored" | "active" | "superseded";

export interface SourceFileVersion {
  readonly id: string;
  readonly fileId: string;
  readonly versionNumber: number;
  readonly status: SourceFileVersionStatus;
  readonly storagePath: string;
  readonly checksum?: string;
  readonly createdAtISO: string;
}

export function isVersionImmutable(version: SourceFileVersion): boolean {
  return version.status === "active" || version.status === "superseded";
}
