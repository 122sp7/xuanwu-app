/**
 * AccessControlService — Backward-compatibility re-export shim.
 *
 * Composition logic has been relocated to
 * interfaces/composition/access-control-service.ts to fix the
 * infrastructure → application dependency direction violation.
 */
export { accessControlService } from "../interfaces/composition/access-control-service";
