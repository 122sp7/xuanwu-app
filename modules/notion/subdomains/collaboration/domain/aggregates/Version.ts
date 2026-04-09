/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/aggregates
 * Aggregate root: Version
 *
 * Represents a named snapshot of a knowledge page or article captured at a point in time.
 * Allows users to restore prior states of content.
 */

export interface VersionSnapshot {
  readonly id: string;
  readonly contentId: string;
  readonly contentType: "page" | "article";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly snapshotBlocks: unknown[];
  readonly label: string | null;
  readonly description: string | null;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
}

export type VersionId = string;
