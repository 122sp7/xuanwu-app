/**
 * AccountRepository — Write-side persistence port (CQRS).
 * Domain owns the contract; Infrastructure implements it.
 */

import type {
  AccountEntity,
  UpdateProfileInput,
  WalletTransaction,
  AccountRoleRecord,
  OrganizationRole,
} from "../entities/Account";
import type { UpdateAccountProfileInput } from "../entities/AccountProfile";

export interface AccountRepository {
  findById(id: string): Promise<AccountEntity | null>;
  save(account: AccountEntity): Promise<void>;
  updateProfile(userId: string, data: UpdateProfileInput): Promise<void>;
  /** Profile-scoped mutation (displayName / bio / photoURL / theme). */
  updateAccountProfile(userId: string, input: UpdateAccountProfileInput): Promise<void>;
  getWalletBalance(accountId: string): Promise<number>;
  creditWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
  debitWallet(accountId: string, amount: number, description: string): Promise<WalletTransaction>;
  assignRole(accountId: string, role: OrganizationRole, grantedBy: string): Promise<AccountRoleRecord>;
  revokeRole(accountId: string): Promise<void>;
  getRole(accountId: string): Promise<AccountRoleRecord | null>;
}
