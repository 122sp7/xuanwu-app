/**
 * Module: knowledge-collaboration
 * Layer: domain/repositories
 */

import type { Permission, PermissionLevel } from "../entities/permission.entity";

export interface GrantPermissionInput {
  readonly subjectId: string;
  readonly subjectType: "page" | "article" | "database";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly principalId: string;
  readonly principalType: "user" | "team";
  readonly level: PermissionLevel;
  readonly grantedByUserId: string;
  readonly expiresAtISO?: string | null;
}

export interface IPermissionRepository {
  grant(input: GrantPermissionInput): Promise<Permission>;
  revoke(accountId: string, permissionId: string): Promise<void>;
  findById(accountId: string, permissionId: string): Promise<Permission | null>;
  listBySubject(accountId: string, subjectId: string): Promise<Permission[]>;
  listByPrincipal(accountId: string, principalId: string): Promise<Permission[]>;
}
