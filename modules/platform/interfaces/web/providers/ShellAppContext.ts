"use client";

/**
 * ShellAppContext — platform/interfaces/web layer
 *
 * Context definition, types, and the useApp() hook.
 * Owns NO workspace-module dependencies — workspace state is managed by
 * WorkspaceContextProvider in the workspace bounded context.
 *
 * The AppProvider that creates this context lives in app/(shell)/ where
 * cross-module composition is allowed.
 */

import {
  createContext,
  useContext,
  type Dispatch,
} from "react";

import type { AccountEntity } from "@/modules/iam/api";
import type { ActiveAccount } from "../../../api/contracts";

// ── State ────────────────────────────────────────────────────────────────────

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
      type: "SEED_ACTIVE_ACCOUNT";
      payload: { user: { id: string; name: string; email: string } };
    }
  | {
      type: "SET_ACCOUNTS";
      payload: {
        accounts: Record<string, AccountEntity>;
        user: { id: string; name: string; email: string };
        preferredActiveAccountId?: string | null;
      };
    }
  | { type: "SET_ACTIVE_ACCOUNT"; payload: ActiveAccount | null }
  | { type: "RESET_STATE" };

export interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextValue | null>(null);

// ── Initial State ────────────────────────────────────────────────────────────

export const APP_INITIAL_STATE: AppState = {
  accounts: {},
  accountsHydrated: false,
  bootstrapPhase: "idle",
  activeAccount: null,
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
