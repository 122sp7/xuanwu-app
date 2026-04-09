/**
 * TokenRefreshSignal — Domain Value Object.
 * Represents the signal written to Firestore when Custom Claims change.
 */

export type TokenRefreshReason = "role:changed" | "policy:changed";

export interface TokenRefreshSignal {
	readonly accountId: string;
	readonly reason: TokenRefreshReason;
	readonly issuedAt: string;
	readonly traceId?: string;
}
