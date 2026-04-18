/**
 * Iam Module — public API surface.
 * All cross-module consumers must import from here only.
 */

// account
// Account aggregate root for account lifecycle and wallet state.
export { Account } from "./subdomains/account/domain/entities/Account";
// Read-only account projection used across module boundaries.
export type { AccountSnapshot } from "./subdomains/account/domain/entities/Account";
// Account application use cases for profile, wallet, and role operations.
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
// UserIdentity aggregate root for actor identity state.
export { UserIdentity } from "./subdomains/identity/domain/entities/UserIdentity";
// Read-only identity projection exposed to other contexts.
export type { UserIdentitySnapshot } from "./subdomains/identity/domain/entities/UserIdentity";

// access-control
// AccessPolicy aggregate root for permission policy modeling.
export { AccessPolicy } from "./subdomains/access-control/domain/aggregates/AccessPolicy";
// Read-only access policy projection for integration boundaries.
export type { AccessPolicySnapshot } from "./subdomains/access-control/domain/aggregates/AccessPolicy";
// Repository contract for access policy persistence.
export type { AccessPolicyRepository } from "./subdomains/access-control/domain/repositories/AccessPolicyRepository";
// Policy effect value object type (allow/deny).
export type { PolicyEffect } from "./subdomains/access-control/domain/value-objects/PolicyEffect";
// Subject reference value object type for policy scope.
export type { SubjectRef } from "./subdomains/access-control/domain/value-objects/SubjectRef";
// Factory for validated subject references.
export { createSubjectRef } from "./subdomains/access-control/domain/value-objects/SubjectRef";
// Resource reference value object type for policy scope.
export type { ResourceRef } from "./subdomains/access-control/domain/value-objects/ResourceRef";
// Factory for validated resource references.
export { createResourceRef } from "./subdomains/access-control/domain/value-objects/ResourceRef";
// Access-control use cases for policy create/update/evaluate flows.
export {
  EvaluatePermissionUseCase,
  CreateAccessPolicyUseCase,
  UpdateAccessPolicyUseCase,
  DeactivateAccessPolicyUseCase,
} from "./subdomains/access-control/application/use-cases/AccessControlUseCases";

// organization
// Organization aggregate root for organization lifecycle state.
export { Organization } from "./subdomains/organization/domain/aggregates/Organization";
// Read-only organization projection for external consumers.
export type { OrganizationSnapshot } from "./subdomains/organization/domain/aggregates/Organization";
// OrganizationTeam aggregate root for team topology and membership.
export { OrganizationTeam } from "./subdomains/organization/domain/aggregates/OrganizationTeam";
// Repository contract for organization persistence.
export type { OrganizationRepository } from "./subdomains/organization/domain/repositories/OrganizationRepository";
// Member role value object type for organization members.
export type { MemberRole } from "./subdomains/organization/domain/value-objects/MemberRole";
// Organization status value object type for lifecycle governance.
export type { OrganizationStatus } from "./subdomains/organization/domain/value-objects/OrganizationStatus";
// Organization lifecycle use cases (create/update/delete).
export {
  CreateOrganizationUseCase,
  CreateOrganizationWithTeamUseCase,
  UpdateOrganizationSettingsUseCase,
  DeleteOrganizationUseCase,
} from "./subdomains/organization/application/use-cases/OrganizationLifecycleUseCases";
// Organization member use cases (invite/recruit/remove/role change).
export {
  InviteMemberUseCase,
  RecruitMemberUseCase,
  RemoveMemberUseCase,
  UpdateMemberRoleUseCase,
} from "./subdomains/organization/application/use-cases/OrganizationMemberUseCases";
// Team management use cases under organization boundary.
export {
  CreateTeamUseCase,
  DeleteTeamUseCase,
  AddMemberToTeamUseCase,
  RemoveMemberFromTeamUseCase,
} from "./subdomains/organization/application/use-cases/OrganizationTeamUseCases";

// authorization — permission decision helpers
// Pure domain helper to build an allow permission decision.
export { allowDecision, denyDecision } from "./subdomains/authorization/domain/index";
// Authorization domain contracts for permission checking.
export type { PermissionDecision, PermissionCheckPort } from "./subdomains/authorization/domain/index";
// Authorization application use cases for single/batch checks.
export {
  CheckPermissionUseCase,
  BatchCheckPermissionsUseCase,
} from "./subdomains/authorization/application/index";

// authentication
// Authentication domain contracts for credential-based sign-in/out flows.
export type {
  AuthCredential,
  AuthenticationPort,
  AuthenticationDomainEvent,
} from "./subdomains/authentication/domain/index";
// Authentication application use cases for session entry/exit and password reset.
export {
  SignInWithEmailUseCase,
  SignOutUseCase,
  SendPasswordResetEmailUseCase,
} from "./subdomains/authentication/application/index";

// federation
// Federation domain contracts for external identity provider linking.
export type {
  FederationProvider,
  FederatedIdentity,
  FederationPort,
} from "./subdomains/federation/domain/index";
// Federation application use cases for provider link lifecycle.
export {
  LinkProviderUseCase,
  UnlinkProviderUseCase,
  GetLinkedProvidersUseCase,
} from "./subdomains/federation/application/index";

// security-policy
// Security-policy domain contracts for MFA/security governance.
export type {
  MfaRequirement,
  SecurityPolicySnapshot,
  SecurityPolicyRepository,
} from "./subdomains/security-policy/domain/index";
// SecurityPolicy aggregate root for policy state changes.
export { SecurityPolicy } from "./subdomains/security-policy/domain/index";
// Security policy application use cases for read/update.
export {
  GetSecurityPolicyUseCase,
  UpdateSecurityPolicyUseCase,
} from "./subdomains/security-policy/application/index";

// session
// Session domain contracts for session snapshots and persistence.
export type {
  SessionSnapshot,
  SessionRepository,
} from "./subdomains/session/domain/index";
// Session aggregate root for authenticated session lifecycle.
export { Session } from "./subdomains/session/domain/index";
// Session application use cases for create/query/revoke operations.
export {
  CreateSessionUseCase,
  GetSessionUseCase,
  RevokeSessionUseCase,
  RevokeAllSessionsUseCase,
} from "./subdomains/session/application/index";

// tenant
// Factory for validated tenant identifiers.
export { createTenantId } from "./subdomains/tenant/domain/index";
// Tenant domain contracts for tenancy state modeling.
export type { TenantId, TenantSnapshot, TenantStatus } from "./subdomains/tenant/domain/index";
// Tenant aggregate root for tenant provisioning and status transitions.
export { Tenant } from "./subdomains/tenant/domain/index";
// Tenant application use cases for provision/suspend/query.
export {
  ProvisionTenantUseCase,
  SuspendTenantUseCase,
  GetTenantUseCase,
} from "./subdomains/tenant/application/index";

// shared errors
// Shared IAM error types for not-found and permission-denied boundaries.
export { IamError, IamNotFoundError, IamPermissionDeniedError } from "./shared/errors/index";
