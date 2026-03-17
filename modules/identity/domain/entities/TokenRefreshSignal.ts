/**
 * TokenRefreshSignal — Domain Value Object.
 * Represents the signal written to Firestore when Custom Claims change.
 * Per 00-logic-overview.md [S6] three-way Claims refresh handshake.
 * Zero external dependencies.
 */

export type TokenRefreshReason = "role:changed" | "policy:changed";

export interface TokenRefreshSignal {
  readonly accountId: string;
  readonly reason: TokenRefreshReason;
  readonly issuedAt: string; // ISO-8601
  readonly traceId?: string;
}
