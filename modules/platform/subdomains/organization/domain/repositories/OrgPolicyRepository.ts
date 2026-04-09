/**
 * OrgPolicyRepository — Port for org-policy persistence.
 */

import type { OrgPolicy, CreateOrgPolicyInput, UpdateOrgPolicyInput } from "../entities/Organization";

export interface OrgPolicyRepository {
  createPolicy(input: CreateOrgPolicyInput): Promise<OrgPolicy>;
  updatePolicy(policyId: string, data: UpdateOrgPolicyInput): Promise<void>;
  deletePolicy(policyId: string): Promise<void>;
  getPolicies(orgId: string): Promise<OrgPolicy[]>;
}
