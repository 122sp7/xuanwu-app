/**
 * platform public API boundary.
 *
 * account is listed before organization to establish canonical definitions for
 * shared type names (OrganizationRole, PolicyEffect, ThemeConfig, Unsubscribe).
 * Organization re-exports are explicit to avoid TS2308 ambiguity errors.
 */

export * from "./contracts";
export * from "./facade";
export { createPlatformService } from "./platform-service";
export * from "../subdomains/identity/api";
export * from "../subdomains/account/api";
export * from "../subdomains/notification/api";

export {
  getProfile,
  subscribeToProfile,
  updateProfile,
  SettingsProfileRouteScreen,
  getAccountProfile,
  subscribeToAccountProfile,
  updateAccountProfile,
} from "../subdomains/account-profile/api";

export type {
  AccountProfile,
  UpdateAccountProfileInput,
} from "../subdomains/account-profile/api";

// organization — explicit to avoid re-export conflicts with account subdomain
export type {
  OrganizationEntity,
  Presence,
  InviteState,
  MemberReference,
  Team,
  PartnerInvite,
  OrgPolicy,
  OrgPolicyRule,
  OrgPolicyScope,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
  OrganizationRepository,
  OrgPolicyRepository,
} from "../subdomains/organization/api";
export {
  organizationService,
  getOrganizationMembers,
  getOrganizationTeams,
  getOrgPolicies,
  createOrganization,
  createOrganizationWithTeam,
  updateOrganizationSettings,
  deleteOrganization,
  inviteMember,
  recruitMember,
  dismissMember,
  updateMemberRole,
  createTeam,
  deleteTeam,
  updateTeamMembers,
  createPartnerGroup,
  sendPartnerInvite,
  dismissPartnerMember,
  createOrgPolicy,
  updateOrgPolicy,
  deleteOrgPolicy,
  CreateOrganizationUseCase,
  CreateOrganizationWithTeamUseCase,
  UpdateOrganizationSettingsUseCase,
  DeleteOrganizationUseCase,
  InviteMemberUseCase,
  RecruitMemberUseCase,
  RemoveMemberUseCase,
  UpdateMemberRoleUseCase,
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
  CreatePartnerGroupUseCase,
  SendPartnerInviteUseCase,
  DismissPartnerMemberUseCase,
  CreateOrgPolicyUseCase,
  UpdateOrgPolicyUseCase,
  DeleteOrgPolicyUseCase,
  // UI components
  AccountSwitcher,
  CreateOrganizationDialog,
  MembersPage,
  TeamsPage,
  PermissionsPage,
} from "../subdomains/organization/api";
export type { MembersPageProps, TeamsPageProps, PermissionsPageProps } from "../subdomains/organization/api";

// background-job — knowledge ingestion pipeline management
export * from "../subdomains/background-job/api";

// Cross-module and app-composition hooks from interfaces layer.
// Only selective exports — do NOT wildcard re-export "../interfaces".
export {
  useApp,
  type AppState,
  type AppAction,
  type AppContextValue,
  AppContext,
  APP_INITIAL_STATE,
  type ActiveAccount,
  // Shell UI components (pure platform — no downstream deps)
  ShellHeaderControls,
  ShellThemeToggle,
  ShellNotificationButton,
  ShellUserAvatar,
  ShellTranslationSwitcher,
  ShellAppBreadcrumbs,
  ShellGlobalSearchDialog,
  useShellGlobalSearch,
} from "../interfaces";

// access-control — account type guards and route fallback
export {
  isOrganizationActor,
  isActiveOrganizationAccount,
  resolveOrganizationRouteFallback,
  type ShellAccountActor,
} from "../subdomains/access-control/api";