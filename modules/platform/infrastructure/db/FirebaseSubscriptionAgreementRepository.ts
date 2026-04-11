/**
 * FirebaseSubscriptionAgreementRepository — Firestore Repository (Driven Adapter)
 *
 * Implements: SubscriptionAgreementRepository
 * Collection: "subscription-agreements"
 */

import { getFirestore, collection, query, where, getDocs, limit, setDoc, doc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { SubscriptionAgreementRepository } from "../../domain/ports/output";

export class FirebaseSubscriptionAgreementRepository implements SubscriptionAgreementRepository {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	async findEffectiveByContextId(contextId: string): Promise<unknown | null> {
		const q = query(
			collection(this.db, "subscription-agreements"),
			where("contextId", "==", contextId),
			where("billingState", "==", "active"),
			limit(1),
		);
		const snap = await getDocs(q);
		if (snap.empty) return null;
		const d = snap.docs[0];
		return { ...(d.data() as Record<string, unknown>), subscriptionAgreementId: d.id };
	}

	async save(agreement: unknown): Promise<void> {
		const record = agreement as Record<string, unknown>;
		const id = record.subscriptionAgreementId as string;
		await setDoc(doc(this.db, "subscription-agreements", id), record, { merge: true });
	}
}
