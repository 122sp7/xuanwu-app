/** iam/domain — shared IAM domain models and value objects. */

export type { PermissionDecision, PermissionOutcome } from "./value-objects/PermissionDecision";
export {
  allowDecision,
  denyDecision,
  conditionalAllowDecision,
  escalateDecision,
  isAllowed,
} from "./value-objects/PermissionDecision";
