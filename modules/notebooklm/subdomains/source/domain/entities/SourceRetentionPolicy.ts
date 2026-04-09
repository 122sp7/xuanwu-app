/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Value Object: SourceRetentionPolicy — governs how long files are retained.
 */

export interface SourceRetentionPolicy {
  readonly id: string;
  readonly organizationId: string;
  readonly retentionDays: number;
  readonly legalHold: boolean;
  readonly purgeMode: "soft-delete" | "hard-delete";
  readonly updatedAtISO: string;
}
