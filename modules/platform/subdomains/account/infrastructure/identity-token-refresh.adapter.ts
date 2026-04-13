/**
 * IdentityTokenRefreshAdapter — Implements TokenRefreshPort using the platform identity subdomain.
 * This adapter lives in the adapters layer so the application layer stays clean.
 */

import type { TokenRefreshPort, TokenRefreshSignalInput } from "../domain/ports/TokenRefreshPort";

type EmitTokenRefreshSignal = (input: TokenRefreshSignalInput) => Promise<void>;

let _emitTokenRefreshSignal: EmitTokenRefreshSignal | undefined;

/**
 * Override the default token refresh emitter. Call before first use of
 * token-refresh flows if a custom emitter is needed.
 */
export function configureTokenRefreshEmitter(emitFn: EmitTokenRefreshSignal): void {
  _emitTokenRefreshSignal = emitFn;
}

function getEmitFn(): EmitTokenRefreshSignal {
  if (!_emitTokenRefreshSignal) {
    // Auto-configure: import identity api lazily to avoid import-time
    // side effects in the account api boundary.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { identityApi } = require("../../identity/api") as {
      identityApi: { emitTokenRefreshSignal: EmitTokenRefreshSignal };
    };
    _emitTokenRefreshSignal = identityApi.emitTokenRefreshSignal;
  }
  return _emitTokenRefreshSignal;
}

export class IdentityTokenRefreshAdapter implements TokenRefreshPort {
  async emitTokenRefreshSignal(input: TokenRefreshSignalInput): Promise<void> {
    await getEmitFn()(input);
  }
}

export const tokenRefreshAdapter = new IdentityTokenRefreshAdapter();
