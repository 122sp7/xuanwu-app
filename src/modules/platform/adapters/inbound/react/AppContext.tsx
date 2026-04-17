"use client";

/**
 * AppContext — platform inbound adapter (React).
 *
 * Defines app-level account state, context, and subscription helpers.
 * Firebase-backed implementations are consumed via the iam module's
 * outbound composition to preserve boundary direction.
 */

import { createContext, useContext, type Dispatch } from "react";
import {
  subscribeToAccountsForUser as iamSubscribeToAccountsForUser,
} from "../../../../iam/adapters/outbound/firebase-composition";
import type { AccountSnapshot } from "../../../../iam/subdomains/account/domain/entities/Account";
import type { AccountProfile } from "../../../../iam/subdomains/account/domain/entities/AccountProfile";

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

export type { AccountProfile };

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

// ── Subscriptions ─────────────────────────────────────────────────────────────

/**
 * Subscribes to real-time organisation account updates for the given userId.
 * Maps iam AccountSnapshot → platform AccountEntity (view model).
 */
export function subscribeToAccountsForUser(
  userId: string,
  onUpdate: (accounts: Record<string, AccountEntity>) => void,
): () => void {
  return iamSubscribeToAccountsForUser(userId, (snapshots: Record<string, AccountSnapshot>) => {
    const entities: Record<string, AccountEntity> = {};
    for (const [id, snap] of Object.entries(snapshots)) {
      entities[id] = {
        id: snap.id,
        name: snap.name,
        accountType: snap.accountType,
        email: snap.email ?? undefined,
        photoURL: snap.photoURL ?? undefined,
      };
    }
    onUpdate(entities);
  });
}

/**
 * Stub — profile subscriptions are available via the iam AccountQueryRepository
 * when a profile panel requires them. Wire from firebase-composition if needed.
 */
export function subscribeToProfile(
  _actorId: string,
  _onUpdate: (profile: AccountProfile | null) => void,
): () => void {
  return () => {};
}
