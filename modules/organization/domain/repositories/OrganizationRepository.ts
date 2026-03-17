/**
 * OrganizationRepository — Port for organization persistence.
 */

import type { OrganizationEntity, InviteMemberInput, UpdateMemberRoleInput, CreateTeamInput } from "../entities/Organization";
import type { MemberReference, Team } from "../entities/Organization";

export interface OrganizationRepository {
  findById(id: string): Promise<OrganizationEntity | null>;
  save(org: OrganizationEntity): Promise<void>;

  // Members
  inviteMember(input: InviteMemberInput): Promise<string>;
  removeMember(organizationId: string, memberId: string): Promise<void>;
  updateMemberRole(input: UpdateMemberRoleInput): Promise<void>;
  getMembers(organizationId: string): Promise<MemberReference[]>;

  // Teams
  createTeam(input: CreateTeamInput): Promise<string>;
  deleteTeam(organizationId: string, teamId: string): Promise<void>;
  addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  getTeams(organizationId: string): Promise<Team[]>;
}
