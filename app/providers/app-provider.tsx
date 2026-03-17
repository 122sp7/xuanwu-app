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

const initialState: AppState = {
  accounts: {},
  accountsHydrated: false,
  bootstrapPhase: "idle",
  activeAccount: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_ACCOUNTS": {
      const { accounts, user } = action.payload;
      // Keep existing active account if it's still valid, otherwise fall back to user.
      const validIds = new Set([user.id, ...Object.keys(accounts)]);
      const active =
        state.activeAccount && validIds.has(state.activeAccount.id)
          ? state.activeAccount
          : user;
      return {
        ...state,
        accounts,
        accountsHydrated: true,
        bootstrapPhase: "hydrated",
        activeAccount: active,
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

    // Optimistically seed the personal account so the UI is immediately responsive.
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: user });
    dispatch({
      type: "SET_ACCOUNTS",
      payload: { accounts: {}, user },
    });

    const unsubscribe = subscribeToAccountsForUser(user.id, (accounts) => {
      dispatch({ type: "SET_ACCOUNTS", payload: { accounts, user } });
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user?.id]);

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
