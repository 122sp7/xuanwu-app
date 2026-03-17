/**
 * FirebaseTokenRefreshRepository — Infrastructure adapter for [S6] TOKEN_REFRESH_SIGNAL.
 * Writes/reads `tokenRefreshSignals/{accountId}` in Firestore.
 * Firebase SDK only exists in this file.
 */

import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { firebaseClientApp } from "@/infrastructure/firebase/client";
import type { TokenRefreshRepository } from "../../domain/repositories/TokenRefreshRepository";
import type { TokenRefreshSignal } from "../../domain/entities/TokenRefreshSignal";

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
