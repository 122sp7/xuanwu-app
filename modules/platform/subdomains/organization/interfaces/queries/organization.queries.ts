/**
 * Organization Queries — direct repo reads for client-side data.
 */

import { FirebaseOrganizationRepository } from "../../infrastructure/firebase/FirebaseOrganizationRepository";
import { FirebaseOrgPolicyRepository } from "../../infrastructure/firebase/FirebaseOrgPolicyRepository";
import type { MemberReference, Team, OrgPolicy } from "../../domain/entities/Organization";

const orgRepo = new FirebaseOrganizationRepository();
const policyRepo = new FirebaseOrgPolicyRepository();

export function getOrganizationMembers(organizationId: string): Promise<MemberReference[]> {
  return orgRepo.getMembers(organizationId);
}

export function getOrganizationTeams(organizationId: string): Promise<Team[]> {
  return orgRepo.getTeams(organizationId);
}

export function getOrgPolicies(orgId: string): Promise<OrgPolicy[]> {
  return policyRepo.getPolicies(orgId);
}
