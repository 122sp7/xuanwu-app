/**
 * IdentityTokenRefreshAdapter — Implements TokenRefreshPort using the IAM public boundary.
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
    // TODO(ADR-1300): This require() breaks a circular dependency — Chain B:
    //   account/infrastructure/identity-token-refresh.adapter
    //   → identity/api → identity/interfaces
    //   → identity/application → account (via token-refresh callback wiring).
    //
    // The lazy require() is intentional and must remain until this flow is
    // wired through constructor injection (DI composition root).
    // Auto-configure: lazy-require the IAM api boundary to avoid import-time
    // side effects in the account api boundary.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("../../../api") as {
      identityApi?: { emitTokenRefreshSignal?: EmitTokenRefreshSignal };
    };
    if (typeof mod.identityApi?.emitTokenRefreshSignal !== "function") {
      throw new Error("modules/iam/api missing identityApi.emitTokenRefreshSignal export");
    }
    _emitTokenRefreshSignal = mod.identityApi.emitTokenRefreshSignal;
  }
  return _emitTokenRefreshSignal;
}

export class IdentityTokenRefreshAdapter implements TokenRefreshPort {
  async emitTokenRefreshSignal(input: TokenRefreshSignalInput): Promise<void> {
    await getEmitFn()(input);
  }
}

export const tokenRefreshAdapter = new IdentityTokenRefreshAdapter();
