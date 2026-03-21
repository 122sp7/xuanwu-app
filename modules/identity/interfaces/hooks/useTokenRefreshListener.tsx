"use client";

/**
 * useTokenRefreshListener — Client Token Refresh Listener [S6].
 *
 * Party 3 of the three-way Claims refresh handshake:
 *   Party 1 (Claims Handler) — emits TOKEN_REFRESH_SIGNAL to `tokenRefreshSignals/{accountId}`
 *   Party 2 (IER CRITICAL_LANE) — routes role/policy change events
 *   Party 3 (this hook) — listens for signal and force-refreshes Firebase ID token
 *
 * Client obligation per SK_TOKEN_REFRESH_CONTRACT [S6]:
 *   On receiving TOKEN_REFRESH_SIGNAL → getIdToken(true) → new token on subsequent requests.
 *
 * Must be mounted once per authenticated session (e.g. shell layout).
 */

import { useEffect } from "react";
import { getFirebaseAuth } from "@integration-firebase";
import { FirebaseTokenRefreshRepository } from "../../infrastructure/firebase/FirebaseTokenRefreshRepository";

const tokenRefreshRepo = new FirebaseTokenRefreshRepository();

/**
 * @param accountId - Authenticated user's account ID, or null/undefined when signed out.
 */
export function useTokenRefreshListener(accountId: string | null | undefined): void {
  useEffect(() => {
    if (!accountId) return;
    // Guard: accountId must be a valid Firestore document ID
    if (!/^[\w-]+$/.test(accountId)) return;

    const unsubscribe = tokenRefreshRepo.subscribe(accountId, () => {
      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      // [S6] Force-refresh the ID token so subsequent requests carry updated Custom Claims.
      void currentUser.getIdToken(/* forceRefresh */ true).catch(() => {
        // Non-fatal: token refreshes naturally on next expiry cycle.
      });
    });

    return () => unsubscribe();
  }, [accountId]);
}
