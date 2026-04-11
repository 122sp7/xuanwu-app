"use client";

import { getFirebaseAuth } from "@integration-firebase";
import { useEffect } from "react";
import { FirebaseTokenRefreshRepository } from "../../api";

let _tokenRefreshRepo: FirebaseTokenRefreshRepository | undefined;

function getTokenRefreshRepo(): FirebaseTokenRefreshRepository {
	if (!_tokenRefreshRepo) _tokenRefreshRepo = new FirebaseTokenRefreshRepository();
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
