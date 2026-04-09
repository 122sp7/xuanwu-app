/**
 * TokenRefreshPort — Driven port for emitting token-refresh signals.
 * Decouples account application layer from the identity subdomain.
 * Platform identity adapter implements this port.
 */

export interface TokenRefreshSignalInput {
  accountId: string;
  reason: string;
  traceId?: string;
}

export interface TokenRefreshPort {
  emitTokenRefreshSignal(input: TokenRefreshSignalInput): Promise<void>;
}
