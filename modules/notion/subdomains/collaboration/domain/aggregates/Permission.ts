/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/aggregates
 * Aggregate root: Permission
 *
 * Governs access to a knowledge subject (page | article | database).
 * Supports link-based sharing via linkToken.
 */

export type PermissionLevel = "view" | "comment" | "edit" | "full";
export type PrincipalType = "user" | "team" | "public" | "link";

export interface PermissionSnapshot {
  readonly id: string;
  readonly subjectId: string;
  readonly subjectType: "page" | "article" | "database";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly principalId: string;
  readonly principalType: PrincipalType;
  readonly level: PermissionLevel;
  readonly grantedByUserId: string;
  readonly grantedAtISO: string;
  readonly expiresAtISO: string | null;
  readonly linkToken: string | null;
}

export type PermissionId = string;
