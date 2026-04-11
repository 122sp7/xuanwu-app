/**
 * Organization Queries — delegates to organizationQueryService via the subdomain api/ boundary.
 */

import { organizationQueryService } from "../../api";
import type { MemberReference, Team, OrgPolicy } from "../../application/dto/organization.dto";

export function getOrganizationMembers(organizationId: string): Promise<MemberReference[]> {
  return organizationQueryService.getMembers(organizationId);
}

export function getOrganizationTeams(organizationId: string): Promise<Team[]> {
  return organizationQueryService.getTeams(organizationId);
}

export function getOrgPolicies(orgId: string): Promise<OrgPolicy[]> {
  return organizationQueryService.getOrgPolicies(orgId);
}
