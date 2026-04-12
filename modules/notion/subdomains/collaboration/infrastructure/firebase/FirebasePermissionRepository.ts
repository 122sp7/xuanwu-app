/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationPermissions/{id}
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { PermissionSnapshot, PermissionLevel, PrincipalType } from "../../domain/aggregates/Permission";
import type { IPermissionRepository, GrantPermissionInput } from "../../domain/repositories/IPermissionRepository";

function permissionsPath(accountId: string): string {
  return `accounts/${accountId}/collaborationPermissions`;
}

function permissionPath(accountId: string, id: string): string {
  return `accounts/${accountId}/collaborationPermissions/${id}`;
}

function toPermission(id: string, data: Record<string, unknown>): PermissionSnapshot {
  return {
    id,
    subjectId: typeof data.subjectId === "string" ? data.subjectId : "",
    subjectType: (data.subjectType as PermissionSnapshot["subjectType"]) ?? "page",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    principalId: typeof data.principalId === "string" ? data.principalId : "",
    principalType: (data.principalType as PrincipalType) ?? "user",
    level: (data.level as PermissionLevel) ?? "view",
    grantedByUserId: typeof data.grantedByUserId === "string" ? data.grantedByUserId : "",
    grantedAtISO: typeof data.grantedAtISO === "string" ? data.grantedAtISO : "",
    expiresAtISO: typeof data.expiresAtISO === "string" ? data.expiresAtISO : null,
    linkToken: typeof data.linkToken === "string" ? data.linkToken : null,
  };
}

export class FirebasePermissionRepository implements IPermissionRepository {
  async grant(input: GrantPermissionInput): Promise<PermissionSnapshot> {
    const id = generateId();
    const now = new Date().toISOString();
    const data = {
      subjectId: input.subjectId,
      subjectType: input.subjectType,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      principalId: input.principalId,
      principalType: input.principalType,
      level: input.level,
      grantedByUserId: input.grantedByUserId,
      grantedAtISO: now,
      expiresAtISO: input.expiresAtISO ?? null,
      linkToken: input.linkToken ?? null,
    };
    await firestoreInfrastructureApi.set(permissionPath(input.accountId, id), data);
    return toPermission(id, data);
  }

  async revoke(accountId: string, permissionId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(permissionPath(accountId, permissionId));
  }

  async findById(accountId: string, permissionId: string): Promise<PermissionSnapshot | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      permissionPath(accountId, permissionId),
    );
    if (!data) return null;
    return toPermission(permissionId, data);
  }

  async listBySubject(accountId: string, subjectId: string): Promise<PermissionSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      permissionsPath(accountId),
      [{ field: "subjectId", op: "==", value: subjectId }],
    );
    return docs.map((d) => toPermission(d.id, d.data));
  }
}
