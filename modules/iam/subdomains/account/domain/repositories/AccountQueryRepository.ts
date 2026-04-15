/**
 * AccountQueryRepository — Read-side persistence port (CQRS).
 * Separated from AccountRepository for CQRS clarity.
 */

import type { AccountEntity, WalletTransaction, AccountRoleRecord } from "../entities/Account";
import type { AccountProfile } from "../entities/AccountProfile";

export interface WalletBalanceSnapshot {
  balance: number;
}

export type Unsubscribe = () => void;

export interface AccountQueryRepository {
  getUserProfile(userId: string): Promise<AccountEntity | null>;
  subscribeToUserProfile(userId: string, onUpdate: (profile: AccountEntity | null) => void): Unsubscribe;
  /** Returns the focused profile read-model for UI / profile screens. */
  getAccountProfile(actorId: string): Promise<AccountProfile | null>;
  /** Reactive profile view for real-time profile screens. */
  subscribeToAccountProfile(actorId: string, onUpdate: (profile: AccountProfile | null) => void): Unsubscribe;
  getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot>;
  subscribeToWalletBalance(accountId: string, onUpdate: (snapshot: WalletBalanceSnapshot) => void): Unsubscribe;
  subscribeToWalletTransactions(accountId: string, maxCount: number, onUpdate: (txs: WalletTransaction[]) => void): Unsubscribe;
  getAccountRole(accountId: string): Promise<AccountRoleRecord | null>;
  subscribeToAccountRoles(accountId: string, onUpdate: (record: AccountRoleRecord | null) => void): Unsubscribe;
  subscribeToAccountsForUser(userId: string, onUpdate: (accounts: Record<string, AccountEntity>) => void): Unsubscribe;
}
