export type TokenRefreshReason = "role:changed" | "policy:changed";

/** Represents the signal written to Firestore when Custom Claims change. */
export interface TokenRefreshSignal {
  readonly accountId: string;
  readonly reason: TokenRefreshReason;
  readonly issuedAt: string; // ISO-8601
  readonly traceId?: string;
}
