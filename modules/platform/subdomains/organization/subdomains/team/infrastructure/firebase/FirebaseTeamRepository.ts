/**
 * Module: platform/subdomains/organization/subdomains/team
 * Layer: adapters/firebase
 * Purpose: Firebase implementation of TeamRepository.
 *          Delegates to FirebaseOrganizationRepository which stores
 *          teams in the organizations/{orgId}/teams sub-collection.
 */

import { FirebaseOrganizationRepository } from "../../../../infrastructure/firebase/FirebaseOrganizationRepository";
import type { TeamRepository } from "../../domain/repositories/TeamRepository";
import type { Team, CreateTeamInput } from "../../domain/entities/Team";

export class FirebaseTeamRepository implements TeamRepository {
  private readonly orgRepo = new FirebaseOrganizationRepository();

  createTeam(input: CreateTeamInput): Promise<string> {
    return this.orgRepo.createTeam(input);
  }

  deleteTeam(organizationId: string, teamId: string): Promise<void> {
    return this.orgRepo.deleteTeam(organizationId, teamId);
  }

  addMemberToTeam(organizationId: string, teamId: string, memberId: string): Promise<void> {
    return this.orgRepo.addMemberToTeam(organizationId, teamId, memberId);
  }

  removeMemberFromTeam(organizationId: string, teamId: string, memberId: string): Promise<void> {
    return this.orgRepo.removeMemberFromTeam(organizationId, teamId, memberId);
  }

  getTeams(organizationId: string): Promise<Team[]> {
    return this.orgRepo.getTeams(organizationId);
  }
}
