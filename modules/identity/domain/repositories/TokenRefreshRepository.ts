/**
 * TokenRefreshRepository — Port for emitting and observing token refresh signals.
 * Defined in domain; implemented in infrastructure.
 * Per [S6] SK_TOKEN_REFRESH_CONTRACT.
 */

import type { TokenRefreshSignal } from "../entities/TokenRefreshSignal";

export interface TokenRefreshRepository {
  /**
   * Emit a token refresh signal for the given account.
   * Called by Claims Handler after role or policy changes.
   */
  emit(signal: TokenRefreshSignal): Promise<void>;

  /**
   * Subscribe to token refresh signals for a given accountId.
   * Fires callback on every signal change (skip first emission to avoid no-op refresh).
   * Returns an unsubscribe function.
   */
  subscribe(accountId: string, onSignal: () => void): () => void;
}
