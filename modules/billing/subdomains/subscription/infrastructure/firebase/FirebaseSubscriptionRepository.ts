/**
 * FirebaseSubscriptionRepository — Infrastructure adapter for subscription persistence.
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
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { SubscriptionRepository } from "../../domain/repositories/SubscriptionRepository";
import type { SubscriptionSnapshot } from "../../domain/aggregates/Subscription";

const COLLECTION = "subscriptions";

function toSnapshot(id: string, data: Record<string, unknown>): SubscriptionSnapshot {
  return {
    id,
    contextId: data.contextId as string,
    planCode: data.planCode as string,
    billingCycle: data.billingCycle as SubscriptionSnapshot["billingCycle"],
    status: data.status as SubscriptionSnapshot["status"],
    currentPeriodStart: data.currentPeriodStart as string,
    currentPeriodEnd: data.currentPeriodEnd != null ? (data.currentPeriodEnd as string) : null,
    cancelledAt: data.cancelledAt != null ? (data.cancelledAt as string) : null,
    createdAtISO: data.createdAtISO as string,
    updatedAtISO: data.updatedAtISO as string,
  };
}

export class FirebaseSubscriptionRepository implements SubscriptionRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(id: string): Promise<SubscriptionSnapshot | null> {
    const snap = await getDoc(doc(this.db, COLLECTION, id));
    if (!snap.exists()) return null;
    return toSnapshot(snap.id, snap.data() as Record<string, unknown>);
  }

  async findActiveByContextId(contextId: string): Promise<SubscriptionSnapshot | null> {
    const q = query(
      collection(this.db, COLLECTION),
      where("contextId", "==", contextId),
      where("status", "in", ["active", "trialing"]),
      orderBy("createdAtISO", "desc"),
      limit(1),
    );
    const snaps = await getDocs(q);
    if (snaps.empty) return null;
    const d = snaps.docs[0];
    return toSnapshot(d.id, d.data() as Record<string, unknown>);
  }

  async findByContextId(contextId: string): Promise<SubscriptionSnapshot[]> {
    const q = query(
      collection(this.db, COLLECTION),
      where("contextId", "==", contextId),
      orderBy("createdAtISO", "desc"),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, unknown>));
  }

  async save(snapshot: SubscriptionSnapshot): Promise<void> {
    await setDoc(doc(this.db, COLLECTION, snapshot.id), {
      ...snapshot,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async update(snapshot: SubscriptionSnapshot): Promise<void> {
    await updateDoc(doc(this.db, COLLECTION, snapshot.id), {
      status: snapshot.status,
      currentPeriodStart: snapshot.currentPeriodStart,
      currentPeriodEnd: snapshot.currentPeriodEnd,
      cancelledAt: snapshot.cancelledAt,
      updatedAtISO: snapshot.updatedAtISO,
      updatedAt: serverTimestamp(),
    });
  }
}
