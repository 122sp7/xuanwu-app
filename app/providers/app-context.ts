"use client";

/**
 * app-context.ts
 * Defines the AppContext contract: the cross-cutting "active account" state.
 *
 * Holds the set of accounts visible to the current user plus the currently
 * active account selection. Consumed by feature pages and sidebar nav.
 */

import { createContext, type Dispatch } from "react";

import type { AccountEntity } from "@/modules/account/domain/entities/Account";
import type { AuthUser } from "./auth-context";

export type ActiveAccount = AccountEntity | AuthUser;

export interface AppState {
  /** All organization accounts visible to the signed-in user. */
  accounts: Record<string, AccountEntity>;
  /** True once the first Firestore snapshot has been received. */
  accountsHydrated: boolean;
  /** Bootstrap phase for optimistic seeding. */
  bootstrapPhase: "idle" | "seeded" | "hydrated";
  /** Currently selected account (personal user account or an organization). */
  activeAccount: ActiveAccount | null;
}

export type AppAction =
  | {
      type: "SET_ACCOUNTS";
      payload: { accounts: Record<string, AccountEntity>; user: AuthUser };
    }
  | { type: "SET_ACTIVE_ACCOUNT"; payload: ActiveAccount | null }
  | { type: "RESET_STATE" };

export interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextValue | null>(null);
