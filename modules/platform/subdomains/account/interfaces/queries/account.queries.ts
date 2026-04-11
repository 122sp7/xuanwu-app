/**
 * Account Read Queries — thin wrappers over the AccountQueryRepository port.
 * NOT Server Actions — callable from React components/hooks directly.
 */

import { FirebaseAccountQueryRepository } from "../../infrastructure/firebase/FirebaseAccountQueryRepository";
import type { AccountEntity, WalletTransaction, AccountRoleRecord } from "../../domain/entities/Account";
import type { WalletBalanceSnapshot, Unsubscribe } from "../../domain/repositories/AccountQueryRepository";
import type { AccountPolicy } from "../../domain/entities/AccountPolicy";

let _accountQueryRepo: FirebaseAccountQueryRepository | undefined;

function getAccountQueryRepo(): FirebaseAccountQueryRepository {
  if (!_accountQueryRepo) _accountQueryRepo = new FirebaseAccountQueryRepository();
  return _accountQueryRepo;
}

export async function getUserProfile(userId: string): Promise<AccountEntity | null> {
  return getAccountQueryRepo().getUserProfile(userId);
}

export function subscribeToUserProfile(
  userId: string,
  onUpdate: (profile: AccountEntity | null) => void,
): Unsubscribe {
  return getAccountQueryRepo().subscribeToUserProfile(userId, onUpdate);
}

export async function getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot> {
  return getAccountQueryRepo().getWalletBalance(accountId);
}

export function subscribeToWalletBalance(
  accountId: string,
  onUpdate: (snapshot: WalletBalanceSnapshot) => void,
): Unsubscribe {
  return getAccountQueryRepo().subscribeToWalletBalance(accountId, onUpdate);
}

export function subscribeToWalletTransactions(
  accountId: string,
  maxCount: number,
  onUpdate: (txs: WalletTransaction[]) => void,
): Unsubscribe {
  return getAccountQueryRepo().subscribeToWalletTransactions(accountId, maxCount, onUpdate);
}

export async function getAccountRole(accountId: string): Promise<AccountRoleRecord | null> {
  return getAccountQueryRepo().getAccountRole(accountId);
}

export function subscribeToAccountRoles(
  accountId: string,
  onUpdate: (record: AccountRoleRecord | null) => void,
): Unsubscribe {
  return getAccountQueryRepo().subscribeToAccountRoles(accountId, onUpdate);
}

export function subscribeToAccountsForUser(
  userId: string,
  onUpdate: (accounts: Record<string, AccountEntity>) => void,
): Unsubscribe {
  return getAccountQueryRepo().subscribeToAccountsForUser(userId, onUpdate);
}

export async function getAccountPolicies(_accountId: string): Promise<AccountPolicy[]> {
  // Policy reads are server-side only; keep client bundles free of policy repo deps.
  return [];
}

export async function getActiveAccountPolicies(_accountId: string): Promise<AccountPolicy[]> {
  return [];
}
