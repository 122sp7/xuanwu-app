/**
 * platform infrastructure API — for infrastructure adapters only.
 *
 * This file is NOT part of the platform capability-contract boundary.
 * Cross-module infrastructure adapters (Firestore repos, Storage adapters, etc.)
 * must import Firebase primitives from here, not from the main api/index.ts.
 *
 * @see ADR-1401 Dependency Leakage — Infrastructure API symbols removed from platform/api/index.ts
 * @see modules/platform/api/index.ts — capability contracts only
 */

export {
  firestoreInfrastructureApi,
  storageInfrastructureApi,
  functionsInfrastructureApi,
} from "./infrastructure-api";
