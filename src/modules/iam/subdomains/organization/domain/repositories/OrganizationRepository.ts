import type {
  MemberReference,
  Team,
  PartnerInvite,
  CreateOrganizationCommand,
  UpdateOrganizationSettingsCommand,
  InviteMemberInput,
  UpdateMemberRoleInput,
  CreateTeamInput,
} from "../entities/Organization";
import type { OrganizationSnapshot } from "../aggregates/Organization";

export type Unsubscribe = () => void;

export interface OrganizationRepository {
  create(command: CreateOrganizationCommand): Promise<string>;
  findById(id: string): Promise<OrganizationSnapshot | null>;
  save(snapshot: OrganizationSnapshot): Promise<void>;
  updateSettings(command: UpdateOrganizationSettingsCommand): Promise<void>;
  delete(organizationId: string): Promise<void>;
  inviteMember(input: InviteMemberInput): Promise<string>;
  recruitMember(organizationId: string, memberId: string, name: string, email: string): Promise<void>;
  removeMember(organizationId: string, memberId: string): Promise<void>;
  updateMemberRole(input: UpdateMemberRoleInput): Promise<void>;
  getMembers(organizationId: string): Promise<MemberReference[]>;
  subscribeToMembers(organizationId: string, onUpdate: (members: MemberReference[]) => void): Unsubscribe;
  createTeam(input: CreateTeamInput): Promise<string>;
  deleteTeam(organizationId: string, teamId: string): Promise<void>;
  addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  getTeams(organizationId: string): Promise<Team[]>;
  subscribeToTeams(organizationId: string, onUpdate: (teams: Team[]) => void): Unsubscribe;
  sendPartnerInvite(organizationId: string, teamId: string, email: string): Promise<string>;
  dismissPartnerMember(organizationId: string, teamId: string, memberId: string): Promise<void>;
  getPartnerInvites(organizationId: string): Promise<PartnerInvite[]>;
}
