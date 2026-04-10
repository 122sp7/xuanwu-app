/**
 * IdentityTokenRefreshAdapter — Implements TokenRefreshPort using the platform identity subdomain.
 * This adapter lives in the adapters layer so the application layer stays clean.
 */

import { identityApi } from "@/modules/platform/subdomains/identity/api";
import type { TokenRefreshPort, TokenRefreshSignalInput } from "../domain/ports/TokenRefreshPort";

export class IdentityTokenRefreshAdapter implements TokenRefreshPort {
  async emitTokenRefreshSignal(input: TokenRefreshSignalInput): Promise<void> {
    await identityApi.emitTokenRefreshSignal(input);
  }
}

export const tokenRefreshAdapter = new IdentityTokenRefreshAdapter();
