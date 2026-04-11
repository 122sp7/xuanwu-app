/**
 * FirebaseIntegrationContractRepository — Firestore Repository (Driven Adapter)
 *
 * Implements: IntegrationContractRepository
 * Collection: "integration-contracts"
 */

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { IntegrationContractRepository } from "../../domain/ports/output";

export class FirebaseIntegrationContractRepository implements IntegrationContractRepository {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	async findById(integrationContractId: string): Promise<unknown | null> {
		const snap = await getDoc(doc(this.db, "integration-contracts", integrationContractId));
		if (!snap.exists()) return null;
		return { integrationContractId, ...(snap.data() as Record<string, unknown>) };
	}

	async save(contract: unknown): Promise<void> {
		const record = contract as Record<string, unknown>;
		const id = record.integrationContractId as string;
		await setDoc(doc(this.db, "integration-contracts", id), record, { merge: true });
	}
}
