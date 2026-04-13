/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/repositories
 * Contract: PermissionRepository
 */

import type { PermissionSnapshot, PermissionLevel, PrincipalType } from "../aggregates/Permission";

export interface GrantPermissionInput {
  readonly subjectId: string;
  readonly subjectType: "page" | "article" | "database";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly principalId: string;
  readonly principalType: PrincipalType;
  readonly level: PermissionLevel;
  readonly grantedByUserId: string;
  readonly expiresAtISO?: string | null;
  readonly linkToken?: string | null;
}

export interface PermissionRepository {
  grant(input: GrantPermissionInput): Promise<PermissionSnapshot>;
  revoke(accountId: string, permissionId: string): Promise<void>;
  findById(accountId: string, permissionId: string): Promise<PermissionSnapshot | null>;
  listBySubject(accountId: string, subjectId: string): Promise<PermissionSnapshot[]>;
}
