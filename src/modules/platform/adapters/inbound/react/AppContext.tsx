"use client";

/**
 * AppContext — platform inbound adapter (React).
 *
 * Defines app-level account state, context, and helper stubs for the src/ migration layer.
 * Replace stub implementations (subscribeToAccountsForUser, subscribeToProfile) with real
 * Firebase-backed versions when available.
 */

import { createContext, useContext, type Dispatch } from "react";

import type { AuthUser } from "../../../../iam/adapters/inbound/react/AuthContext";
export type { AuthUser } from "../../../../iam/adapters/inbound/react/AuthContext";

// ── Account types ─────────────────────────────────────────────────────────────

export type AccountType = "user" | "organization";

export interface AccountEntity {
  readonly id: string;
  readonly name: string;
  readonly accountType: AccountType;
  readonly email?: string;
  readonly photoURL?: string;
}

export type ActiveAccount = AccountEntity | AuthUser;

export type BootstrapPhase = "idle" | "seeded" | "hydrated";

// ── AccountProfile (read-model) ───────────────────────────────────────────────

export interface AccountProfile {
  readonly id: string;
  readonly displayName: string;
  readonly email?: string;
  readonly photoURL?: string;
  readonly bio?: string;
}

// ── App state & actions ───────────────────────────────────────────────────────

export interface AppState {
  readonly accounts: Record<string, AccountEntity>;
  readonly accountsHydrated: boolean;
  readonly activeAccount: ActiveAccount | null;
  readonly bootstrapPhase: BootstrapPhase;
}

export type AppAction =
  | { type: "SEED_ACTIVE_ACCOUNT"; payload: { user: AuthUser } }
  | {
      type: "SET_ACCOUNTS";
      payload: {
        accounts: Record<string, AccountEntity>;
        user: AuthUser;
        preferredActiveAccountId: string | null;
      };
    }
  | { type: "SET_ACTIVE_ACCOUNT"; payload: ActiveAccount | null }
  | { type: "RESET_STATE" };

export interface AppContextValue {
  readonly state: AppState;
  readonly dispatch: Dispatch<AppAction>;
}

export const APP_INITIAL_STATE: AppState = {
  accounts: {},
  accountsHydrated: false,
  activeAccount: null,
  bootstrapPhase: "idle",
};

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AccountScopeProvider");
  return ctx;
}

// ── Account helpers ───────────────────────────────────────────────────────────

export function isOrganizationActor(
  account: ActiveAccount | null | undefined,
): boolean {
  if (!account) return false;
  return "accountType" in account && account.accountType === "organization";
}

export function isActiveOrganizationAccount(
  account: ActiveAccount | null | undefined,
): boolean {
  return isOrganizationActor(account);
}

export function resolveOrganizationRouteFallback(
  _pathname: string,
  _account: ActiveAccount | null | undefined,
): string | null {
  return null;
}

export function resolveActiveAccount(opts: {
  currentActiveAccount: ActiveAccount | null;
  accounts: Record<string, AccountEntity>;
  personalAccount: AuthUser;
  preferredActiveAccountId: string | null;
  bootstrapPhase: BootstrapPhase;
}): ActiveAccount {
  const {
    currentActiveAccount,
    accounts,
    personalAccount,
    preferredActiveAccountId,
  } = opts;
  if (preferredActiveAccountId && accounts[preferredActiveAccountId]) {
    return accounts[preferredActiveAccountId];
  }
  if (currentActiveAccount) return currentActiveAccount;
  return personalAccount;
}

// ── Stub subscriptions ────────────────────────────────────────────────────────

/** Stub — replace with Firestore subscription when available. */
export function subscribeToAccountsForUser(
  _userId: string,
  _onUpdate: (accounts: Record<string, AccountEntity>) => void,
): () => void {
  return () => {};
}

/** Stub — replace with Firestore profile subscription when available. */
export function subscribeToProfile(
  _actorId: string,
  _onUpdate: (profile: AccountProfile | null) => void,
): () => void {
  return () => {};
}
