import type { Organization, Team } from "../entities/References";

export interface ScheduleMdddOrganizationStructureRepository {
  findOrganizationById(organizationId: string): Promise<Organization | null>;
  listTeamsByOrganizationId(organizationId: string): Promise<readonly Team[]>;
}
