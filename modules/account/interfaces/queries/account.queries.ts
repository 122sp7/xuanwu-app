/**
 * Account Read Queries — thin wrappers exposing read operations via the AccountQueryRepository port.
 * These are NOT Server Actions — they are callable from React components/hooks.
 */

import { FirebaseAccountQueryRepository } from "../../infrastructure/firebase/FirebaseAccountQueryRepository";
import type { AccountEntity, WalletTransaction, AccountRoleRecord } from "../../domain/entities/Account";
import type { WalletBalanceSnapshot, Unsubscribe } from "../../domain/repositories/AccountQueryRepository";
import type { AccountPolicy } from "../../domain/entities/AccountPolicy";

const accountQueryRepo = new FirebaseAccountQueryRepository();

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<AccountEntity | null> {
  return accountQueryRepo.getUserProfile(userId);
}

export function subscribeToUserProfile(
  userId: string,
  onUpdate: (profile: AccountEntity | null) => void,
): Unsubscribe {
  return accountQueryRepo.subscribeToUserProfile(userId, onUpdate);
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export async function getWalletBalance(accountId: string): Promise<WalletBalanceSnapshot> {
  return accountQueryRepo.getWalletBalance(accountId);
}

export function subscribeToWalletBalance(
  accountId: string,
  onUpdate: (snapshot: WalletBalanceSnapshot) => void,
): Unsubscribe {
  return accountQueryRepo.subscribeToWalletBalance(accountId, onUpdate);
}

export function subscribeToWalletTransactions(
  accountId: string,
  maxCount: number,
  onUpdate: (txs: WalletTransaction[]) => void,
): Unsubscribe {
  return accountQueryRepo.subscribeToWalletTransactions(accountId, maxCount, onUpdate);
}

// ─── Role ─────────────────────────────────────────────────────────────────────

export async function getAccountRole(accountId: string): Promise<AccountRoleRecord | null> {
  return accountQueryRepo.getAccountRole(accountId);
}

export function subscribeToAccountRoles(
  accountId: string,
  onUpdate: (record: AccountRoleRecord | null) => void,
): Unsubscribe {
  return accountQueryRepo.subscribeToAccountRoles(accountId, onUpdate);
}

// ─── Account Policy ───────────────────────────────────────────────────────────

export async function getAccountPolicies(accountId: string): Promise<AccountPolicy[]> {
  void accountId;
  // Keep client bundles free of server-only policy repository dependencies.
  return [];
}

export async function getActiveAccountPolicies(accountId: string): Promise<AccountPolicy[]> {
  void accountId;
  // Keep client bundles free of server-only policy repository dependencies.
  return [];
}

// ─── Multi-Account (App-Level) ────────────────────────────────────────────────

export function subscribeToAccountsForUser(
  userId: string,
  onUpdate: (accounts: Record<string, AccountEntity>) => void,
): Unsubscribe {
  return accountQueryRepo.subscribeToAccountsForUser(userId, onUpdate);
}
