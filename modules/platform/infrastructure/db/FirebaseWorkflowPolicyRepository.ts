/**
 * FirebaseWorkflowPolicyRepository — Firestore Repository (Driven Adapter)
 *
 * Implements: WorkflowPolicyRepository
 * Collection: "workflow-policies"
 */

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { WorkflowPolicyRepository, WorkflowPolicyView } from "../../domain/ports/output";

export class FirebaseWorkflowPolicyRepository implements WorkflowPolicyRepository {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	private makeId(contextId: string, triggerKey: string): string {
		return `${contextId}__${triggerKey}`;
	}

	async getView(contextId: string, triggerKey: string): Promise<WorkflowPolicyView | null> {
		const id = this.makeId(contextId, triggerKey);
		const snap = await getDoc(doc(this.db, "workflow-policies", id));
		if (!snap.exists()) return null;
		const data = snap.data() as Record<string, unknown>;
		return {
			contextId,
			triggerKey,
			enabled: Boolean(data.enabled),
		};
	}

	async save(policy: WorkflowPolicyView): Promise<void> {
		const id = this.makeId(policy.contextId, policy.triggerKey);
		await setDoc(doc(this.db, "workflow-policies", id), policy, { merge: true });
	}
}
