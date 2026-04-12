/**
 * IdentityTokenRefreshAdapter — Implements TokenRefreshPort using the platform identity subdomain.
 * This adapter lives in the adapters layer so the application layer stays clean.
 */

import type { TokenRefreshPort, TokenRefreshSignalInput } from "../domain/ports/TokenRefreshPort";

type EmitTokenRefreshSignal = (input: TokenRefreshSignalInput) => Promise<void>;

let _emitTokenRefreshSignal: EmitTokenRefreshSignal | undefined;

export function configureTokenRefreshEmitter(emitFn: EmitTokenRefreshSignal): void {
  _emitTokenRefreshSignal = emitFn;
}

export class IdentityTokenRefreshAdapter implements TokenRefreshPort {
  async emitTokenRefreshSignal(input: TokenRefreshSignalInput): Promise<void> {
    if (!_emitTokenRefreshSignal) {
      throw new Error("Token refresh emitter is not configured.");
    }
    await _emitTokenRefreshSignal(input);
  }
}

export const tokenRefreshAdapter = new IdentityTokenRefreshAdapter();
