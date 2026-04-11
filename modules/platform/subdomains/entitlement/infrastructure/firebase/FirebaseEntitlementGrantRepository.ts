/**
 * FirebaseEntitlementGrantRepository — Infrastructure adapter for entitlement persistence.
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
import type { EntitlementGrantRepository } from "../../domain/repositories/EntitlementGrantRepository";
import type { EntitlementGrantSnapshot } from "../../domain/aggregates/EntitlementGrant";

const COLLECTION = "entitlementGrants";

function toSnapshot(id: string, data: Record<string, unknown>): EntitlementGrantSnapshot {
  return {
    id,
    contextId: data.contextId as string,
    featureKey: data.featureKey as string,
    quota: data.quota != null ? (data.quota as number) : null,
    status: data.status as EntitlementGrantSnapshot["status"],
    grantedAt: data.grantedAt as string,
    expiresAt: data.expiresAt != null ? (data.expiresAt as string) : null,
    updatedAtISO: data.updatedAtISO as string,
  };
}

export class FirebaseEntitlementGrantRepository implements EntitlementGrantRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(id: string): Promise<EntitlementGrantSnapshot | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id));
    if (!snap.exists()) return null;
    return toSnapshot(snap.id, snap.data() as Record<string, unknown>);
  }

  async findByContextId(contextId: string): Promise<EntitlementGrantSnapshot[]> {
    const q = query(collection(this.db, COLLECTION), where("contextId", "==", contextId));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, unknown>));
  }

  async findActiveByContextAndFeature(
    contextId: string,
    featureKey: string,
  ): Promise<EntitlementGrantSnapshot | null> {
    const q = query(
      collection(this.db, COLLECTION),
      where("contextId", "==", contextId),
      where("featureKey", "==", featureKey),
      where("status", "==", "active"),
    );
    const snaps = await getDocs(q);
    if (snaps.empty) return null;
    const d = snaps.docs[0];
    return toSnapshot(d.id, d.data() as Record<string, unknown>);
  }

  async save(snapshot: EntitlementGrantSnapshot): Promise<void> {
    await setDoc(doc(this.db, COLLECTION, snapshot.id), {
      ...snapshot,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async update(snapshot: EntitlementGrantSnapshot): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, snapshot.id), {
      status: snapshot.status,
      updatedAtISO: snapshot.updatedAtISO,
      updatedAt: serverTimestamp(),
    });
  }
}
