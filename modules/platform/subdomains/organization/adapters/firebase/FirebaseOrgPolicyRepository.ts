/**
 * FirebaseOrgPolicyRepository — Infrastructure adapter for org-policy persistence.
 * OrgPolicy lives in top-level `orgPolicies` collection, independent of `organizations`.
 */

import {
  getFirestore,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { OrgPolicyRepository } from "../../domain/repositories/OrgPolicyRepository";
import type { OrgPolicy, CreateOrgPolicyInput, UpdateOrgPolicyInput } from "../../domain/entities/Organization";
import { toOrgPolicy } from "./organization-mappers";

export class FirebaseOrgPolicyRepository implements OrgPolicyRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async createPolicy(input: CreateOrgPolicyInput): Promise<OrgPolicy> {
    const now = new Date().toISOString();
    const ref = await addDoc(collection(this.db, "orgPolicies"), {
      orgId: input.orgId,
      name: input.name,
      description: input.description,
      rules: input.rules,
      scope: input.scope,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      _createdAt: serverTimestamp(),
    });
    return {
      id: ref.id,
      orgId: input.orgId,
      name: input.name,
      description: input.description,
      rules: input.rules,
      scope: input.scope,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
  }

  async updatePolicy(policyId: string, data: UpdateOrgPolicyInput): Promise<void> {
    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
      _updatedAt: serverTimestamp(),
    };
    if (data.name !== undefined) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.rules !== undefined) updates.rules = data.rules;
    if (data.scope !== undefined) updates.scope = data.scope;
    if (data.isActive !== undefined) updates.isActive = data.isActive;
    await updateDoc(doc(this.db, "orgPolicies", policyId), updates);
  }

  async deletePolicy(policyId: string): Promise<void> {
    await deleteDoc(doc(this.db, "orgPolicies", policyId));
  }

  async getPolicies(orgId: string): Promise<OrgPolicy[]> {
    const q = query(collection(this.db, "orgPolicies"), where("orgId", "==", orgId));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toOrgPolicy(d.id, d.data() as Record<string, unknown>));
  }
}
