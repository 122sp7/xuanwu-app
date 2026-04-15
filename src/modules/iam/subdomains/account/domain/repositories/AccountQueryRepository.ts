import type { AccountProfile } from "../entities/AccountProfile";
import type { AccountSnapshot } from "../entities/Account";
import type { WalletTransaction, AccountRoleRecord } from "./AccountRepository";

export interface WalletBalanceSnapshot {
  balance: number;
}

export type Unsubscribe = () => void;

export interface AccountQueryRepository {
  getUserProfile(userId: string): Promise<AccountSnapshot | null>;
  subscribeToUserProfile(
    userId: string,
    onUpdate: (profile: AccountSnapshot | null) => void,
  ): Unsubscribe;
  getAccountProfile(actorId: string): Promise<AccountProfile | null>;
  subscribeToAccountProfile(
    actorId: string,
    onUpdate: (profile: AccountProfile | null) => void,
  ): Unsubscribe;
  getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot>;
  subscribeToWalletBalance(
    accountId: string,
    onUpdate: (snapshot: WalletBalanceSnapshot) => void,
  ): Unsubscribe;
  subscribeToWalletTransactions(
    accountId: string,
    maxCount: number,
    onUpdate: (txs: WalletTransaction[]) => void,
  ): Unsubscribe;
  getAccountRole(accountId: string): Promise<AccountRoleRecord | null>;
  subscribeToAccountRoles(
    accountId: string,
    onUpdate: (record: AccountRoleRecord | null) => void,
  ): Unsubscribe;
  subscribeToAccountsForUser(
    userId: string,
    onUpdate: (accounts: Record<string, AccountSnapshot>) => void,
  ): Unsubscribe;
}
