"use client";

/**
 * app-provider.tsx — platform/interfaces/web layer
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

import {
  subscribeToAccountsForUser,
  type AccountEntity,
} from "../../../subdomains/account";
import { type AuthUser, useAuth } from "../../../subdomains/identity";
import {
  subscribeToWorkspacesForAccount,
  getWorkspaceStorageKey,
  toWorkspaceMap,
} from "@/modules/workspace/api";

import { AppContext, type AppState, type AppAction } from "./app-context";

// -- Initial State -----------------------------------------------------------

const LAST_ACTIVE_ACCOUNT_STORAGE_KEY = "xuanwu_last_active_account";

const initialState: AppState = {
  accounts: {},
  accountsHydrated: false,
  bootstrapPhase: "idle",
  activeAccount: null,
  activeWorkspaceId: null,
  workspaces: {},
  workspacesHydrated: false,
};

// -- Reducer -----------------------------------------------------------------

function resolveActiveAccount(
  state: AppState,
  accounts: Record<string, AccountEntity>,
  user: AuthUser,
  preferredActiveAccountId?: string | null,
) {
  const validIds = new Set([user.id, ...Object.keys(accounts)]);
  const currentActiveId = state.activeAccount?.id;
  let currentActive = null;

  if (currentActiveId && validIds.has(currentActiveId)) {
    currentActive = currentActiveId === user.id ? user : accounts[currentActiveId] ?? null;
  }

  let preferredActive = null;
  if (preferredActiveAccountId && validIds.has(preferredActiveAccountId)) {
    preferredActive =
      preferredActiveAccountId === user.id
        ? user
        : accounts[preferredActiveAccountId] ?? null;
  }

  // During the initial seeded phase we only know about the personal account.
  // Once the real organization snapshot arrives, prefer the last persisted
  // account so re-login restores the user's previous working context instead of
  // leaving them in the optimistic personal fallback.
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
        activeWorkspaceId: null,
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
    case "SET_WORKSPACES":
      return {
        ...state,
        workspaces: action.payload.workspaces,
        workspacesHydrated: action.payload.hydrated,
      };
    case "SET_ACTIVE_ACCOUNT":
      if (state.activeAccount?.id === action.payload?.id) return state;
      return {
        ...state,
        activeAccount: action.payload,
        activeWorkspaceId: null,
        workspaces: {},
        workspacesHydrated: false,
      };
    case "SET_ACTIVE_WORKSPACE":
      if (state.activeWorkspaceId === action.payload) return state;
      return { ...state, activeWorkspaceId: action.payload };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}

// -- Provider ----------------------------------------------------------------

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const activeAccountId = state.activeAccount?.id;
    if (!activeAccountId) {
      dispatch({ type: "SET_ACTIVE_WORKSPACE", payload: null });
      return;
    }

    const storedWorkspaceId = window.localStorage.getItem(getWorkspaceStorageKey(activeAccountId));
    dispatch({ type: "SET_ACTIVE_WORKSPACE", payload: storedWorkspaceId || null });
  }, [state.activeAccount?.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const activeAccountId = state.activeAccount?.id;
    if (!activeAccountId) return;

    const storageKey = getWorkspaceStorageKey(activeAccountId);
    if (!state.activeWorkspaceId) {
      window.localStorage.removeItem(storageKey);
      return;
    }

    window.localStorage.setItem(storageKey, state.activeWorkspaceId);
  }, [state.activeAccount?.id, state.activeWorkspaceId]);

  useEffect(() => {
    const activeAccountId = state.activeAccount?.id;
    if (!activeAccountId) {
      dispatch({
        type: "SET_WORKSPACES",
        payload: { workspaces: {}, hydrated: true },
      });
      return;
    }

    dispatch({
      type: "SET_WORKSPACES",
      payload: { workspaces: {}, hydrated: false },
    });

    const unsubscribe = subscribeToWorkspacesForAccount(activeAccountId, (workspaces) => {
      dispatch({
        type: "SET_WORKSPACES",
        payload: {
          workspaces: toWorkspaceMap(workspaces),
          hydrated: true,
        },
      });
    });

    return () => unsubscribe();
  }, [state.activeAccount?.id]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// -- Hook --------------------------------------------------------------------

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
