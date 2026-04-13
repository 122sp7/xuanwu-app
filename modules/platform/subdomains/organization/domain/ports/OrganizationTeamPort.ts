/**
 * OrganizationTeamPort — driven port for organization-scoped team operations.
 *
 * Defined in organization's domain layer so the application layer can depend on
 * this interface without importing from a peer subdomain (team).
 * The infrastructure composition root (organization-service.ts) wires the
 * concrete team subdomain adapter as the implementation.
 */

import type { Team, CreateTeamInput } from "../entities/Organization";

export interface OrganizationTeamPort {
  createTeam(input: CreateTeamInput): Promise<string>;
  deleteTeam(organizationId: string, teamId: string): Promise<void>;
  addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void>;
  getTeams(organizationId: string): Promise<Team[]>;
}
