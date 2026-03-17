"use client";

/**
 * app-provider.tsx
 * Hosts the app-level active-account lifecycle and exposes useApp().
 *
 * Responsibilities:
 *  1. Watch AuthProvider state for sign-in / sign-out events
 *  2. Subscribe to the user's visible accounts (orgs) via account module queries
 *  3. Maintain activeAccount selection (default: personal user account from auth)
 *  4. Expose state + dispatch via AppContext
 */

import {
  useReducer,
  useEffect,
  useContext,
  type ReactNode,
} from "react";

import { subscribeToAccountsForUser } from "@/modules/account/interfaces/queries/account.queries";

import { AppContext, type AppState, type AppAction } from "./app-context";
import { useAuth } from "./auth-provider";

// ─── Initial State ────────────────────────────────────────────────────────────

const LAST_ACTIVE_ACCOUNT_STORAGE_KEY = "xuanwu_last_active_account";

const initialState: AppState = {
  accounts: {},
  accountsHydrated: false,
  bootstrapPhase: "idle",
  activeAccount: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function resolveActiveAccount(
  state: AppState,
  accounts: Record<string, import("@/modules/account/domain/entities/Account").AccountEntity>,
  user: import("./auth-context").AuthUser,
  preferredActiveAccountId?: string | null,
) {
  const validIds = new Set([user.id, ...Object.keys(accounts)]);
  const currentActiveId = state.activeAccount?.id;
  const currentActive =
    currentActiveId && validIds.has(currentActiveId)
      ? currentActiveId === user.id
        ? user
        : accounts[currentActiveId] ?? state.activeAccount
      : null;

  const preferredActive =
    preferredActiveAccountId && validIds.has(preferredActiveAccountId)
      ? preferredActiveAccountId === user.id
        ? user
        : accounts[preferredActiveAccountId] ?? null
      : null;

  if (
    preferredActive &&
    (!currentActive || state.bootstrapPhase === "seeded" || currentActive.id === user.id)
  ) {
    return preferredActive;
  }

  return currentActive ?? user;
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SEED_ACTIVE_ACCOUNT":
      return {
        ...state,
        accounts: {},
        accountsHydrated: false,
        bootstrapPhase: "seeded",
        activeAccount: action.payload.user,
      };
    case "SET_ACCOUNTS": {
      const { accounts, user, preferredActiveAccountId } = action.payload;
      return {
        ...state,
        accounts,
        accountsHydrated: true,
        bootstrapPhase: "hydrated",
        activeAccount: resolveActiveAccount(state, accounts, user, preferredActiveAccountId),
      };
    }
    case "SET_ACTIVE_ACCOUNT":
      if (state.activeAccount?.id === action.payload?.id) return state;
      return { ...state, activeAccount: action.payload };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const { state: authState } = useAuth();
  const { user, status } = authState;
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    if (status === "initializing") return;

    if (!user) {
      dispatch({ type: "RESET_STATE" });
      return;
    }

    dispatch({ type: "SEED_ACTIVE_ACCOUNT", payload: { user } });

    const unsubscribe = subscribeToAccountsForUser(user.id, (accounts) => {
      const preferredActiveAccountId =
        typeof window === "undefined"
          ? null
          : window.localStorage.getItem(LAST_ACTIVE_ACCOUNT_STORAGE_KEY);
      dispatch({
        type: "SET_ACCOUNTS",
        payload: { accounts, user, preferredActiveAccountId },
      });
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user?.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!user || !state.activeAccount?.id) {
      window.localStorage.removeItem(LAST_ACTIVE_ACCOUNT_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(LAST_ACTIVE_ACCOUNT_STORAGE_KEY, state.activeAccount.id);
  }, [state.activeAccount?.id, user]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
