/**
 * CachedUsageMeterRepository — Firestore-backed View Repository (Driven Adapter)
 *
 * Implements: UsageMeterRepository
 * Reads SubscriptionEntitlementsView from "subscription-agreements" collection.
 */

import { getFirestore, collection, query, where, getDocs, limit } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { UsageMeterRepository, SubscriptionEntitlementsView } from "../../domain/ports/output";

export class CachedUsageMeterRepository implements UsageMeterRepository {
private get db() {
return getFirestore(firebaseClientApp);
}

async getEntitlementsView(contextId: string): Promise<SubscriptionEntitlementsView | null> {
const q = query(
collection(this.db, "subscription-agreements"),
where("contextId", "==", contextId),
where("billingState", "==", "active"),
limit(1),
);
const snap = await getDocs(q);
if (snap.empty) return null;
const data = snap.docs[0].data() as Record<string, unknown>;
return {
contextId,
planCode: typeof data.planCode === "string" ? data.planCode : "free",
entitlements: Array.isArray(data.entitlements) ? (data.entitlements as string[]) : [],
usageLimits: Array.isArray(data.usageLimits) ? (data.usageLimits as string[]) : [],
};
}
}
