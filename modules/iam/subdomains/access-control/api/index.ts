/**
 * IAM access-control public API.
 * Transitional canonical boundary while implementation is converged from legacy owners.
 */

export {
  accessControlService,
  isOrganizationActor,
  isActiveOrganizationAccount,
  resolveOrganizationRouteFallback,
} from "@/modules/platform/subdomains/access-control/api";

export type {
  ShellAccountActor,
  AccessPolicySnapshot,
  CreateAccessPolicyInput,
  AccessPolicyDomainEventType,
  AccessPolicyRepository,
  SubjectRef,
  ResourceRef,
  PolicyEffect,
} from "@/modules/platform/subdomains/access-control/api";
