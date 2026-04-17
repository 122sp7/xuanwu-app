"use client";

/**
 * AccountScopeProvider — platform inbound adapter (React).
 *
 * Manages platform-owned account lifecycle: auth → accounts → activeAccount.
 * Ported from: app/(shell)/_providers/AppProvider.tsx
 *
 * Consumers use useAccountScope() to read account state.
 */

import { useReducer, useEffect, type ReactNode } from "react";

import {
  AppContext,
  APP_INITIAL_STATE,
  type AppState,
  type AppAction,
} from "@/modules/platform/api/ui";
import {
  resolveActiveAccount,
  subscribeToAccountsForUser,
} from "@/modules/platform/api";
import { useAuth } from "@/modules/iam/api";

const LAST_ACTIVE_ACCOUNT_STORAGE_KEY = "xuanwu_last_active_account";

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
        activeAccount: resolveActiveAccount({
          currentActiveAccount: state.activeAccount,
          accounts,
          personalAccount: user,
          preferredActiveAccountId,
          bootstrapPhase: state.bootstrapPhase,
        }),
      };
    }
    case "SET_ACTIVE_ACCOUNT":
      if (state.activeAccount?.id === action.payload?.id) return state;
      return {
        ...state,
        activeAccount: action.payload,
      };
    case "RESET_STATE":
      return APP_INITIAL_STATE;
    default:
      return state;
  }
}

export function AccountScopeProvider({ children }: { children: ReactNode }) {
  const { state: authState } = useAuth();
  const { user, status } = authState;
  const [state, dispatch] = useReducer(appReducer, APP_INITIAL_STATE);

  useEffect(() => {
    if (status === "initializing") return;

    if (!user) {
      dispatch({ type: "RESET_STATE" });
      return;
    }

    dispatch({ type: "SEED_ACTIVE_ACCOUNT", payload: { user } });
    const preferredActiveAccountId =
      typeof window === "undefined"
        ? null
        : window.localStorage.getItem(LAST_ACTIVE_ACCOUNT_STORAGE_KEY);

    const unsubscribe = subscribeToAccountsForUser(user.id, (accounts) => {
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
    const activeAccountId = state.activeAccount?.id;

    if (!user || !activeAccountId) {
      window.localStorage.removeItem(LAST_ACTIVE_ACCOUNT_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(LAST_ACTIVE_ACCOUNT_STORAGE_KEY, activeAccountId);
  }, [state.activeAccount?.id, user]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
