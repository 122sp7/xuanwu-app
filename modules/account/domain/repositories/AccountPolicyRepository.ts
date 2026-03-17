/**
 * AccountPolicyRepository — Port for account policy persistence.
 * Domain defines the interface; Infrastructure implements it.
 */

import type { AccountPolicy, CreatePolicyInput, UpdatePolicyInput } from "../entities/AccountPolicy";

export interface AccountPolicyRepository {
  findById(id: string): Promise<AccountPolicy | null>;
  findAllByAccountId(accountId: string): Promise<AccountPolicy[]>;
  findActiveByAccountId(accountId: string): Promise<AccountPolicy[]>;
  create(input: CreatePolicyInput): Promise<AccountPolicy>;
  update(id: string, data: UpdatePolicyInput): Promise<void>;
  delete(id: string): Promise<void>;
}
