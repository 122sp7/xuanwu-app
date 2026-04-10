"use client";

import { getFirebaseAuth } from "@integration-firebase";
import { useEffect } from "react";
import { FirebaseTokenRefreshRepository } from "../../infrastructure/firebase/FirebaseTokenRefreshRepository";

const tokenRefreshRepo = new FirebaseTokenRefreshRepository();

export function useTokenRefreshListener(accountId: string | null | undefined): void {
	useEffect(() => {
		if (!accountId) return;
		if (!/^[\w-]+$/.test(accountId)) return;

		const unsubscribe = tokenRefreshRepo.subscribe(accountId, () => {
			const auth = getFirebaseAuth();
			const currentUser = auth.currentUser;
			if (!currentUser) return;
			void currentUser.getIdToken(true).catch(() => {
				// Non-fatal: token refreshes naturally on next expiry cycle.
			});
		});

		return () => unsubscribe();
	}, [accountId]);
}
