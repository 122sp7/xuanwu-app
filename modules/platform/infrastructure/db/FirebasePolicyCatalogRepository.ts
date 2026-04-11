/**
 * FirebasePolicyCatalogRepository — Firestore Repository (Driven Adapter)
 *
 * Implements: PolicyCatalogRepository
 * Collection: "policy-catalogs"
 */

import { getFirestore, collection, query, orderBy, limit, getDocs, setDoc, doc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { PolicyCatalogRepository } from "../../domain/ports/output";

export class FirebasePolicyCatalogRepository implements PolicyCatalogRepository {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	async findActiveByContextId(contextId: string): Promise<unknown | null> {
		const q = query(
			collection(this.db, "policy-catalogs"),
			orderBy("revision", "desc"),
			limit(1),
		);
		const snap = await getDocs(q);
		if (snap.empty) return null;
		const d = snap.docs[0];
		return { contextId, ...(d.data() as Record<string, unknown>), id: d.id };
	}

	async saveRevision(catalog: unknown): Promise<void> {
		const record = catalog as Record<string, unknown>;
		const contextId = record.contextId as string;
		const revision = record.revision as number;
		const id = `${contextId}__rev${revision}`;
		await setDoc(doc(this.db, "policy-catalogs", id), record, { merge: true });
	}
}
