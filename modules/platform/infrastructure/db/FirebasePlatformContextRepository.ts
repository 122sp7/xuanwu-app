/**
 * FirebasePlatformContextRepository — Firestore Repository (Driven Adapter)
 *
 * Implements: PlatformContextRepository
 * Collection: "platform-contexts"
 */

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { PlatformContextRepository } from "../../domain/ports/output";

export class FirebasePlatformContextRepository implements PlatformContextRepository {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	async findById(contextId: string): Promise<unknown | null> {
		const snap = await getDoc(doc(this.db, "platform-contexts", contextId));
		if (!snap.exists()) return null;
		return { contextId, ...(snap.data() as Record<string, unknown>) };
	}

	async save(context: unknown): Promise<void> {
		const record = context as Record<string, unknown>;
		const contextId = record.contextId as string;
		await setDoc(doc(this.db, "platform-contexts", contextId), record, { merge: true });
	}
}
