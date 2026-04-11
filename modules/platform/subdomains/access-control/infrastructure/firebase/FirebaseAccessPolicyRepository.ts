/**
 * FirebaseAccessPolicyRepository — Infrastructure adapter for access-policy persistence.
 * Firebase SDK only exists in this file.
 */
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { AccessPolicyRepository } from "../../domain/repositories/AccessPolicyRepository";
import type { AccessPolicySnapshot } from "../../domain/aggregates/AccessPolicy";

const COLLECTION = "accessPolicies";

function toSnapshot(id: string, data: Record<string, unknown>): AccessPolicySnapshot {
  return {
    id,
    subjectRef: data.subjectRef as AccessPolicySnapshot["subjectRef"],
    resourceRef: data.resourceRef as AccessPolicySnapshot["resourceRef"],
    actions: data.actions as string[],
    effect: data.effect as AccessPolicySnapshot["effect"],
    conditions: (data.conditions as string[]) ?? [],
    isActive: Boolean(data.isActive),
    createdAtISO: data.createdAtISO as string,
    updatedAtISO: data.updatedAtISO as string,
  };
}

export class FirebaseAccessPolicyRepository implements AccessPolicyRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(id: string): Promise<AccessPolicySnapshot | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id));
    if (!snap.exists()) return null;
    return toSnapshot(snap.id, snap.data() as Record<string, unknown>);
  }

  async findBySubject(subjectId: string): Promise<AccessPolicySnapshot[]> {
    const q = query(
      collection(this.db, COLLECTION),
      where("subjectRef.subjectId", "==", subjectId),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, unknown>));
  }

  async findActiveBySubjectAndResource(
    subjectId: string,
    resourceType: string,
    resourceId?: string,
  ): Promise<AccessPolicySnapshot[]> {
    const constraints = [
      where("subjectRef.subjectId", "==", subjectId),
      where("resourceRef.resourceType", "==", resourceType),
      where("isActive", "==", true),
    ];
    if (resourceId) {
      constraints.push(where("resourceRef.resourceId", "==", resourceId));
    }
    const q = query(collection(this.db, COLLECTION), ...constraints);
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, unknown>));
  }

  async save(snapshot: AccessPolicySnapshot): Promise<void> {
    await setDoc(doc(this.db, COLLECTION, snapshot.id), {
      ...snapshot,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async update(snapshot: AccessPolicySnapshot): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, snapshot.id), {
      actions: snapshot.actions,
      effect: snapshot.effect,
      conditions: snapshot.conditions,
      isActive: snapshot.isActive,
      updatedAtISO: snapshot.updatedAtISO,
      updatedAt: serverTimestamp(),
    });
  }
}
