/**
 * EntitlementService — Composition root for entitlement use cases.
 *
 * Relocated from infrastructure/ to interfaces/composition/ to fix
 * the infrastructure → application dependency direction violation (HX-1-001).
 * Wires repositories; provides a unified service interface.
 */
import {
  GrantEntitlementUseCase,
  SuspendEntitlementUseCase,
  RevokeEntitlementUseCase,
  ResolveEntitlementsUseCase,
  CheckFeatureEntitlementUseCase,
} from "../../application/use-cases/entitlement.use-cases";
import { FirebaseEntitlementGrantRepository } from "../../infrastructure/firebase/FirebaseEntitlementGrantRepository";
import type { CommandResult } from "@shared-types";

let _repo: FirebaseEntitlementGrantRepository | undefined;

function getRepo(): FirebaseEntitlementGrantRepository {
  if (!_repo) _repo = new FirebaseEntitlementGrantRepository();
  return _repo;
}

export const entitlementService = {
  grantEntitlement: (input: {
    contextId: string;
    featureKey: string;
    quota?: number | null;
    expiresAt?: string | null;
  }): Promise<CommandResult> => new GrantEntitlementUseCase(getRepo()).execute(input),

  suspendEntitlement: (entitlementId: string): Promise<CommandResult> =>
    new SuspendEntitlementUseCase(getRepo()).execute(entitlementId),

  revokeEntitlement: (entitlementId: string): Promise<CommandResult> =>
    new RevokeEntitlementUseCase(getRepo()).execute(entitlementId),

  resolveEntitlements: (contextId: string): Promise<CommandResult> =>
    new ResolveEntitlementsUseCase(getRepo()).execute(contextId),

  checkFeatureEntitlement: (contextId: string, featureKey: string): Promise<CommandResult> =>
    new CheckFeatureEntitlementUseCase(getRepo()).execute(contextId, featureKey),
};
