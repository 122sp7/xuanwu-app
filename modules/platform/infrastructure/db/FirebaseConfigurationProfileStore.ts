/**
 * FirebaseConfigurationProfileStore — Firestore Store (Driven Adapter)
 *
 * Implements: ConfigurationProfileStore
 * Collection: "config-profiles"
 */

import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { ConfigurationProfileStore } from "../../domain/ports/output";

export class FirebaseConfigurationProfileStore implements ConfigurationProfileStore {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	async getProfile(profileRef: string): Promise<unknown | null> {
		const snap = await getDoc(doc(this.db, "config-profiles", profileRef));
		if (!snap.exists()) return null;
		return { profileRef, ...(snap.data() as Record<string, unknown>) };
	}
}
