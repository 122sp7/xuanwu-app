/**
 * FirebaseAccountPolicyRepository — Policy persistence adapter.
 * Firebase SDK only exists in this file.
 */

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { AccountPolicyRepository } from "../../domain/repositories/AccountPolicyRepository";
import type { AccountPolicy, CreatePolicyInput, UpdatePolicyInput } from "../../domain/entities/AccountPolicy";

function toAccountPolicy(id: string, data: Record<string, unknown>): AccountPolicy {
  return {
    id,
    accountId: data.accountId as string,
    name: typeof data.name === "string" ? data.name : "",
    description: typeof data.description === "string" ? data.description : "",
    rules: Array.isArray(data.rules) ? (data.rules as AccountPolicy["rules"]) : [],
    isActive: data.isActive === true,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
    traceId: typeof data.traceId === "string" ? data.traceId : undefined,
  };
}

export class FirebaseAccountPolicyRepository implements AccountPolicyRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(id: string): Promise<AccountPolicy | null> {
    const snap = await getDoc(doc(this.db, "accountPolicies", id));
    if (!snap.exists()) return null;
    return toAccountPolicy(snap.id, snap.data() as Record<string, unknown>);
  }

  async findAllByAccountId(accountId: string): Promise<AccountPolicy[]> {
    const q = query(collection(this.db, "accountPolicies"), where("accountId", "==", accountId));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toAccountPolicy(d.id, d.data() as Record<string, unknown>));
  }

  async findActiveByAccountId(accountId: string): Promise<AccountPolicy[]> {
    const q = query(
      collection(this.db, "accountPolicies"),
      where("accountId", "==", accountId),
      where("isActive", "==", true),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toAccountPolicy(d.id, d.data() as Record<string, unknown>));
  }

  async create(input: CreatePolicyInput): Promise<AccountPolicy> {
    const now = new Date().toISOString();
    const ref = await addDoc(collection(this.db, "accountPolicies"), {
      accountId: input.accountId,
      name: input.name,
      description: input.description,
      rules: input.rules,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      ...(input.traceId ? { traceId: input.traceId } : {}),
      _createdAt: serverTimestamp(),
    });
    return {
      id: ref.id,
      accountId: input.accountId,
      name: input.name,
      description: input.description,
      rules: input.rules,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      traceId: input.traceId,
    };
  }

  async update(policyId: string, data: UpdatePolicyInput): Promise<void> {
    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString(), _updatedAt: serverTimestamp() };
    if (data.name !== undefined) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.rules !== undefined) updates.rules = data.rules;
    if (data.isActive !== undefined) updates.isActive = data.isActive;
    await updateDoc(doc(this.db, "accountPolicies", policyId), updates);
  }

  async delete(policyId: string): Promise<void> {
    await deleteDoc(doc(this.db, "accountPolicies", policyId));
  }
}
