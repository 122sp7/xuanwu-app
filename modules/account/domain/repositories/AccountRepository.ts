/**
 * AccountRepository — Port for account persistence.
 * Domain defines the interface; Infrastructure implements it.
 */

import type { AccountEntity, UpdateProfileInput, WalletTransaction, AccountRoleRecord, OrganizationRole } from "../entities/Account";

export interface AccountRepository {
  findById(id: string): Promise<AccountEntity | null>;
  save(account: AccountEntity): Promise<void>;
  updateProfile(userId: string, data: UpdateProfileInput): Promise<void>;

  // Wallet
  getWalletBalance(accountId: string): Promise<number>;
  creditWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
  debitWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;

  // Role
  assignRole(accountId: string, role: OrganizationRole, grantedBy: string): Promise<AccountRoleRecord>;
  revokeRole(accountId: string): Promise<void>;
  getRole(accountId: string): Promise<AccountRoleRecord | null>;
}
