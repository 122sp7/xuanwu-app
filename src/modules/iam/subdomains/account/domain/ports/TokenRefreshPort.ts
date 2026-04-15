export type TokenRefreshReason = "role:changed" | "policy:changed";

export interface TokenRefreshSignalInput {
  accountId: string;
  reason: TokenRefreshReason;
  traceId?: string;
}

export interface TokenRefreshPort {
  emitTokenRefreshSignal(input: TokenRefreshSignalInput): Promise<void>;
}
