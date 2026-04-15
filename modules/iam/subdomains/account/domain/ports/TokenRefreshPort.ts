/**
 * TokenRefreshPort — Driven port for emitting token-refresh signals.
 * Decouples account application layer from the identity subdomain.
 * Platform identity adapter implements this port.
 */

export type TokenRefreshReason = "role:changed" | "policy:changed";

export interface TokenRefreshSignalInput {
  accountId: string;
  reason: TokenRefreshReason;
  traceId?: string;
}

export interface TokenRefreshPort {
  emitTokenRefreshSignal(input: TokenRefreshSignalInput): Promise<void>;
}
