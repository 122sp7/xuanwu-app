/**
 * IAM access-control public API.
 * Canonical owner boundary for permission evaluation and policy lifecycle.
 */

export {
  EvaluatePermissionUseCase,
  CreateAccessPolicyUseCase,
  UpdateAccessPolicyUseCase,
  DeactivateAccessPolicyUseCase,
} from "../application/use-cases/access-control.use-cases";

export { accessControlService } from "../interfaces/composition/access-control-service";
export {
  isOrganizationActor,
  isActiveOrganizationAccount,
  resolveOrganizationRouteFallback,
} from "../application/services/shell-account-access";
export {
  allowDecision,
  denyDecision,
  conditionalAllowDecision,
  escalateDecision,
  isAllowed,
} from "../../../domain/value-objects/PermissionDecision";

export type {
  ShellAccountActor,
} from "../application/services/shell-account-access";
export type { AccessPolicySnapshot, CreateAccessPolicyInput } from "../domain/aggregates/AccessPolicy";
export type { AccessPolicyDomainEventType } from "../domain/events/AccessPolicyDomainEvent";
export type { AccessPolicyRepository } from "../domain/repositories/AccessPolicyRepository";
export type { SubjectRef } from "../domain/value-objects/SubjectRef";
export type { ResourceRef } from "../domain/value-objects/ResourceRef";
export type { PolicyEffect } from "../domain/value-objects/PolicyEffect";
export type { PermissionDecision, PermissionOutcome } from "../../../domain/value-objects/PermissionDecision";
