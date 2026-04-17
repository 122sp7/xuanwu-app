export type OrganizationRole = "Owner" | "Admin" | "Member" | "Guest";
export type Presence = "active" | "away" | "offline";
export type InviteState = "pending" | "accepted" | "expired";

export interface MemberReference {
  id: string;
  name: string;
  email: string;
  role: OrganizationRole;
  presence: Presence;
  isExternal?: boolean;
  expiryDate?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  type: "internal" | "external";
  memberIds: string[];
}

export interface PartnerInvite {
  id: string;
  email: string;
  teamId: string;
  role: OrganizationRole;
  inviteState: InviteState;
  invitedAt: string;
  protocol: string;
}

export interface ThemeConfig {
  primary: string;
  background: string;
  accent: string;
}

export type OrgPolicyEffect = "allow" | "deny";
export type OrgPolicyScope = "workspace" | "member" | "global";

export interface OrgPolicyRule {
  resource: string;
  actions: string[];
  effect: OrgPolicyEffect;
  conditions?: Record<string, string>;
}

export interface OrgPolicy {
  readonly id: string;
  readonly orgId: string;
  readonly name: string;
  readonly description: string;
  readonly rules: OrgPolicyRule[];
  readonly scope: OrgPolicyScope;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateOrganizationCommand {
  readonly organizationName: string;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerEmail: string;
}

export interface UpdateOrganizationSettingsCommand {
  readonly organizationId: string;
  readonly name?: string;
  readonly description?: string;
  readonly theme?: ThemeConfig | null;
  readonly photoURL?: string;
}

export interface InviteMemberInput {
  organizationId: string;
  email: string;
  teamId: string;
  role: OrganizationRole;
  protocol: string;
}

export interface UpdateMemberRoleInput {
  organizationId: string;
  memberId: string;
  role: OrganizationRole;
}

export interface CreateTeamInput {
  organizationId: string;
  name: string;
  description: string;
  type: "internal" | "external";
}

export interface CreateOrgPolicyInput {
  orgId: string;
  name: string;
  description: string;
  rules: OrgPolicyRule[];
  scope: OrgPolicyScope;
}

export interface UpdateOrgPolicyInput {
  name?: string;
  description?: string;
  rules?: OrgPolicyRule[];
  scope?: OrgPolicyScope;
  isActive?: boolean;
}
