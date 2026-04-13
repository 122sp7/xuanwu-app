"use client";

import { getFirebaseAuth } from "@integration-firebase";
import { useEffect } from "react";
import { createTokenRefreshRepository } from "../composition/identity-service";

let _tokenRefreshRepo: ReturnType<typeof createTokenRefreshRepository> | undefined;

function getTokenRefreshRepo(): ReturnType<typeof createTokenRefreshRepository> {
	if (!_tokenRefreshRepo) _tokenRefreshRepo = createTokenRefreshRepository();
	return _tokenRefreshRepo;
}

export function useTokenRefreshListener(accountId: string | null | undefined): void {
	useEffect(() => {
		if (!accountId) return;
		if (!/^[\w-]+$/.test(accountId)) return;

		const unsubscribe = getTokenRefreshRepo().subscribe(accountId, () => {
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
