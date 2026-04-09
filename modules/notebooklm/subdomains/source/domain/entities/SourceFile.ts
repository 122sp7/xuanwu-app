/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Aggregate: SourceFile — workspace-scoped file with lifecycle status.
 */

export type SourceFileStatus = "active" | "archived" | "deleted";

export type SourceFileClassification = "image" | "manifest" | "record" | "other";

export interface SourceFile {
  readonly id: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly accountId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly classification: SourceFileClassification;
  readonly tags: readonly string[];
  readonly currentVersionId: string;
  readonly retentionPolicyId?: string;
  readonly status: SourceFileStatus;
  readonly source?: string;
  readonly detail?: string;
  readonly href?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
  readonly deletedAtISO?: string;
}

const ARCHIVEABLE_STATUS: readonly SourceFileStatus[] = ["active"];
const RESTOREABLE_STATUS: readonly SourceFileStatus[] = ["archived"];

export function canArchiveSourceFile(file: SourceFile): boolean {
  return ARCHIVEABLE_STATUS.includes(file.status);
}

export function canRestoreSourceFile(file: SourceFile): boolean {
  return RESTOREABLE_STATUS.includes(file.status);
}
