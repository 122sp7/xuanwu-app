/**
 * Platform compatibility façade for access-control.
 * Canonical ownership now lives in the IAM bounded context.
 */

export {
  EvaluatePermissionUseCase,
  CreateAccessPolicyUseCase,
  UpdateAccessPolicyUseCase,
  DeactivateAccessPolicyUseCase,
  accessControlService,
  isOrganizationActor,
  isActiveOrganizationAccount,
  resolveOrganizationRouteFallback,
  allowDecision,
  denyDecision,
  conditionalAllowDecision,
  escalateDecision,
  isAllowed,
} from "@/modules/iam/subdomains/access-control/api";

export type {
  ShellAccountActor,
  AccessPolicySnapshot,
  CreateAccessPolicyInput,
  AccessPolicyDomainEventType,
  AccessPolicyRepository,
  SubjectRef,
  ResourceRef,
  PolicyEffect,
  PermissionDecision,
  PermissionOutcome,
} from "@/modules/iam/subdomains/access-control/api";
