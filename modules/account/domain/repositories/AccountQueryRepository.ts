/**
 * AccountQueryRepository — Port for account read operations.
 * Separated from the write-side AccountRepository for CQRS clarity.
 */

import type { AccountEntity } from "../entities/Account";
import type { WalletTransaction } from "../entities/Account";
import type { AccountRoleRecord } from "../entities/Account";

export interface WalletBalanceSnapshot {
  balance: number;
}

export type Unsubscribe = () => void;

export interface AccountQueryRepository {
  /** Fetch the user profile/account document. */
  getUserProfile(userId: string): Promise<AccountEntity | null>;

  /** Real-time subscription to user profile. */
  subscribeToUserProfile(userId: string, onUpdate: (profile: AccountEntity | null) => void): Unsubscribe;

  /** Fetch wallet balance. */
  getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot>;

  /** Real-time subscription to wallet balance. */
  subscribeToWalletBalance(accountId: string, onUpdate: (snapshot: WalletBalanceSnapshot) => void): Unsubscribe;

  /** Real-time subscription to wallet transaction history. */
  subscribeToWalletTransactions(
    accountId: string,
    maxCount: number,
    onUpdate: (txs: WalletTransaction[]) => void,
  ): Unsubscribe;

  /** Fetch the current role record for an account. */
  getAccountRole(accountId: string): Promise<AccountRoleRecord | null>;

  /** Real-time subscription to account roles. */
  subscribeToAccountRoles(accountId: string, onUpdate: (record: AccountRoleRecord | null) => void): Unsubscribe;

  /**
   * Real-time subscription to ALL accounts visible to a user:
   * — organization accounts where ownerId === userId
   * — organization accounts where memberIds contains userId
   * Returns a merged Record<accountId, AccountEntity> suitable for populating
   * the app-level account switcher.
   */
  subscribeToAccountsForUser(
    userId: string,
    onUpdate: (accounts: Record<string, AccountEntity>) => void,
  ): Unsubscribe;
}
