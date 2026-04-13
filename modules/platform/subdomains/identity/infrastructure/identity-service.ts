/**
 * identity-service.ts — Backward-compatibility re-export shim.
 *
 * Composition logic (use-case wiring, service facade) has been relocated to
 * interfaces/composition/identity-service.ts to fix the
 * infrastructure → application dependency direction violation.
 */

export {
  createIdentityRepository,
  createTokenRefreshRepository,
  createClientAuthUseCases,
  identityApi,
} from "../interfaces/composition/identity-service";
export type { EmitTokenRefreshSignalInput } from "../interfaces/composition/identity-service";

