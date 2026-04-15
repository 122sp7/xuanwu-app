/**
 * Iam Module — public API surface.
 * All cross-module consumers must import from here only.
 */

// account
export { Account } from "./subdomains/account/domain/entities/Account";
export type { AccountSnapshot } from "./subdomains/account/domain/entities/Account";
export {
  CreateUserAccountUseCase,
  UpdateUserProfileUseCase,
  CreditWalletUseCase,
  DebitWalletUseCase,
  AssignAccountRoleUseCase,
  RevokeAccountRoleUseCase,
  GetAccountProfileUseCase,
  UpdateAccountProfileUseCase,
} from "./subdomains/account/application/use-cases/AccountUseCases";

// identity
export { UserIdentity } from "./subdomains/identity/domain/entities/UserIdentity";
export type { UserIdentitySnapshot } from "./subdomains/identity/domain/entities/UserIdentity";

// access-control
export { AccessPolicy } from "./subdomains/access-control/domain/aggregates/AccessPolicy";
export type { AccessPolicySnapshot } from "./subdomains/access-control/domain/aggregates/AccessPolicy";
export type { AccessPolicyRepository } from "./subdomains/access-control/domain/repositories/AccessPolicyRepository";
export type { PolicyEffect } from "./subdomains/access-control/domain/value-objects/PolicyEffect";
export type { SubjectRef } from "./subdomains/access-control/domain/value-objects/SubjectRef";
export { createSubjectRef } from "./subdomains/access-control/domain/value-objects/SubjectRef";
export type { ResourceRef } from "./subdomains/access-control/domain/value-objects/ResourceRef";
export { createResourceRef } from "./subdomains/access-control/domain/value-objects/ResourceRef";
export {
  EvaluatePermissionUseCase,
  CreateAccessPolicyUseCase,
  UpdateAccessPolicyUseCase,
  DeactivateAccessPolicyUseCase,
} from "./subdomains/access-control/application/use-cases/AccessControlUseCases";

// organization
export { Organization } from "./subdomains/organization/domain/aggregates/Organization";
export type { OrganizationSnapshot } from "./subdomains/organization/domain/aggregates/Organization";
export { OrganizationTeam } from "./subdomains/organization/domain/aggregates/OrganizationTeam";
export type { OrganizationRepository } from "./subdomains/organization/domain/repositories/OrganizationRepository";
export type { MemberRole } from "./subdomains/organization/domain/value-objects/MemberRole";
export type { OrganizationStatus } from "./subdomains/organization/domain/value-objects/OrganizationStatus";
export {
  CreateOrganizationUseCase,
  CreateOrganizationWithTeamUseCase,
  UpdateOrganizationSettingsUseCase,
  DeleteOrganizationUseCase,
} from "./subdomains/organization/application/use-cases/OrganizationLifecycleUseCases";
export {
  InviteMemberUseCase,
  RecruitMemberUseCase,
  RemoveMemberUseCase,
  UpdateMemberRoleUseCase,
} from "./subdomains/organization/application/use-cases/OrganizationMemberUseCases";
export {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  AddMemberToTeamUseCase,
  RemoveMemberFromTeamUseCase,
} from "./subdomains/organization/application/use-cases/OrganizationTeamUseCases";

// authorization — permission decision helpers
export { allowDecision, denyDecision } from "./subdomains/authorization/domain/index";
export type { PermissionDecision, PermissionCheckPort } from "./subdomains/authorization/domain/index";

// tenant
export { createTenantId } from "./subdomains/tenant/domain/index";
export type { TenantId, TenantSnapshot, TenantStatus } from "./subdomains/tenant/domain/index";

// shared errors
export { IamError, IamNotFoundError, IamPermissionDeniedError } from "./shared/errors/index";
