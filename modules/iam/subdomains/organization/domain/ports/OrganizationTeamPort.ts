/**
 * OrganizationTeamPort — driven port for team operations.
 * Owned by organization domain; infrastructure implements this.
 */

import type { Team, CreateTeamInput } from "../entities/Organization";

export interface OrganizationTeamPort {
  createTeam(input: CreateTeamInput): Promise<string>;
  deleteTeam(organizationId: string, teamId: string): Promise<void>;
  addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  getTeams(organizationId: string): Promise<Team[]>;
}
