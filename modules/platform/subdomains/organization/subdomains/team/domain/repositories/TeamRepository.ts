/**
 * Module: platform/subdomains/organization/subdomains/team
 * Layer: domain/repositories
 * Purpose: TeamRepository port — team-scoped operations only.
 *          Implemented in the firebase adapter.
 */

import type { Team, CreateTeamInput } from "../entities/Team";

export interface TeamRepository {
  createTeam(input: CreateTeamInput): Promise<string>;
  deleteTeam(organizationId: string, teamId: string): Promise<void>;
  addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  getTeams(organizationId: string): Promise<Team[]>;
}
