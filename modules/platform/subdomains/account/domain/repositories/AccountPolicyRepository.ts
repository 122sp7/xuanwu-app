/**
 * AccountPolicyRepository — Policy CRUD persistence port.
 */

import type { AccountPolicy, CreatePolicyInput, UpdatePolicyInput } from "../entities/AccountPolicy";

export interface AccountPolicyRepository {
  findById(id: string): Promise<AccountPolicy | null>;
  findAllByAccountId(accountId: string): Promise<AccountPolicy[]>;
  findActiveByAccountId(accountId: string): Promise<AccountPolicy[]>;
  create(input: CreatePolicyInput): Promise<AccountPolicy>;
  update(policyId: string, data: UpdatePolicyInput): Promise<void>;
  delete(policyId: string): Promise<void>;
}
