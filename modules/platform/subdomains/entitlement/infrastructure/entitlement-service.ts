/**
 * EntitlementService — Backward-compatibility re-export shim.
 *
 * Composition logic has been relocated to
 * interfaces/composition/entitlement-service.ts to fix the
 * infrastructure → application dependency direction violation.
 */
export { entitlementService } from "../interfaces/composition/entitlement-service";
