/**
 * CachedPlatformContextViewRepository — Firestore-backed View Repository (Driven Adapter)
 *
 * Implements: PlatformContextViewRepository
 * Reads PlatformContextView from "platform-contexts" collection.
 */

import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { PlatformContextViewRepository, PlatformContextView } from "../../domain/ports/output";

export class CachedPlatformContextViewRepository implements PlatformContextViewRepository {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	async getView(contextId: string): Promise<PlatformContextView | null> {
		const snap = await getDoc(doc(this.db, "platform-contexts", contextId));
		if (!snap.exists()) return null;
		const data = snap.data() as Record<string, unknown>;
		return {
			contextId,
			lifecycleState: typeof data.lifecycleState === "string" ? data.lifecycleState : "unknown",
			capabilityKeys: Array.isArray(data.capabilityKeys) ? (data.capabilityKeys as string[]) : [],
		};
	}
}
