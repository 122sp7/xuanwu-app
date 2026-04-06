/**
 * OrgPolicyRepository — Port for org-policy persistence.
 *
 * OrgPolicy lives in a top-level Firestore collection (`orgPolicies`) that is
 * independent of the `organizations` collection.  Per IDDD, each aggregate root
 * owns its own repository port.  Policy is therefore separated here from
 * {@link OrganizationRepository}.
 */

import type {
  OrgPolicy,
  CreateOrgPolicyInput,
  UpdateOrgPolicyInput,
} from "../entities/Organization";

export interface OrgPolicyRepository {
  createPolicy(input: CreateOrgPolicyInput): Promise<OrgPolicy>;
  updatePolicy(policyId: string, data: UpdateOrgPolicyInput): Promise<void>;
  deletePolicy(policyId: string): Promise<void>;
  getPolicies(orgId: string): Promise<OrgPolicy[]>;
}
