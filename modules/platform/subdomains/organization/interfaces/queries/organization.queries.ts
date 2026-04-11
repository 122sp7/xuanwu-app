/**
 * Organization Queries — direct repo reads for client-side data.
 */

import { FirebaseOrganizationRepository } from "../../infrastructure/firebase/FirebaseOrganizationRepository";
import { FirebaseOrgPolicyRepository } from "../../infrastructure/firebase/FirebaseOrgPolicyRepository";
import type { MemberReference, Team, OrgPolicy } from "../../application/dto/organization.dto";

let _orgRepo: FirebaseOrganizationRepository | undefined;
let _policyRepo: FirebaseOrgPolicyRepository | undefined;

function getOrgRepo(): FirebaseOrganizationRepository {
  if (!_orgRepo) _orgRepo = new FirebaseOrganizationRepository();
  return _orgRepo;
}

function getPolicyRepo(): FirebaseOrgPolicyRepository {
  if (!_policyRepo) _policyRepo = new FirebaseOrgPolicyRepository();
  return _policyRepo;
}

export function getOrganizationMembers(organizationId: string): Promise<MemberReference[]> {
  return getOrgRepo().getMembers(organizationId);
}

export function getOrganizationTeams(organizationId: string): Promise<Team[]> {
  return getOrgRepo().getTeams(organizationId);
}

export function getOrgPolicies(orgId: string): Promise<OrgPolicy[]> {
  return getPolicyRepo().getPolicies(orgId);
}
