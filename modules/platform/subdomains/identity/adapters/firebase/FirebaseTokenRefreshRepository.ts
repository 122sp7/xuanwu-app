import { firebaseClientApp } from "@integration-firebase/client";
import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import type { TokenRefreshRepository, TokenRefreshSignal } from "../../domain";

const COLLECTION = "tokenRefreshSignals";

export class FirebaseTokenRefreshRepository implements TokenRefreshRepository {
	private get db() {
		return getFirestore(firebaseClientApp);
	}

	async emit(signal: TokenRefreshSignal): Promise<void> {
		await setDoc(
			doc(this.db, COLLECTION, signal.accountId),
			{
				accountId: signal.accountId,
				reason: signal.reason,
				issuedAt: signal.issuedAt,
				...(signal.traceId ? { traceId: signal.traceId } : {}),
			},
			{ merge: true },
		);
	}

	subscribe(accountId: string, onSignal: () => void): () => void {
		let isFirstEmission = true;
		const ref = doc(this.db, COLLECTION, accountId);
		return onSnapshot(ref, () => {
			if (isFirstEmission) {
				isFirstEmission = false;
				return;
			}
			onSignal();
		});
	}
}
