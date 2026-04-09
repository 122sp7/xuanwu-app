/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationPermissions/{id}
 */

import {
  collection, doc, getDoc, getDocs, getFirestore,
  query, serverTimestamp, setDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { PermissionSnapshot, PermissionLevel, PrincipalType } from "../../domain/aggregates/Permission";
import type { IPermissionRepository, GrantPermissionInput } from "../../domain/repositories/IPermissionRepository";

function permissionsCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "collaborationPermissions");
}

function permissionDoc(db: ReturnType<typeof getFirestore>, accountId: string, id: string) {
  return doc(db, "accounts", accountId, "collaborationPermissions", id);
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
  private db() { return getFirestore(firebaseClientApp); }

  async grant(input: GrantPermissionInput): Promise<PermissionSnapshot> {
    const db = this.db();
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
      _createdAt: serverTimestamp(),
    };
    await setDoc(permissionDoc(db, input.accountId, id), data);
    return toPermission(id, data);
  }

  async revoke(accountId: string, permissionId: string): Promise<void> {
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(permissionDoc(this.db(), accountId, permissionId));
  }

  async findById(accountId: string, permissionId: string): Promise<PermissionSnapshot | null> {
    const snap = await getDoc(permissionDoc(this.db(), accountId, permissionId));
    if (!snap.exists()) return null;
    return toPermission(snap.id, snap.data() as Record<string, unknown>);
  }

  async listBySubject(accountId: string, subjectId: string): Promise<PermissionSnapshot[]> {
    const db = this.db();
    const q = query(permissionsCol(db, accountId), where("subjectId", "==", subjectId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toPermission(d.id, d.data() as Record<string, unknown>));
  }
}
