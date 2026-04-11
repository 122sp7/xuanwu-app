"use client";

/**
 * shell-app-provider.tsx — platform/interfaces/web layer
 * Hosts the app-level active-account lifecycle and exposes useApp().
 *
 * Responsibilities:
 *  1. Watch AuthProvider state for sign-in / sign-out events
 *  2. Subscribe to the user's visible accounts (orgs) via account module queries
 *  3. Maintain activeAccount selection (default: personal user account from auth)
 *  4. Expose state + dispatch via AppContext
 */

import {
  createContext,
  useReducer,
  useEffect,
  useContext,
  type Dispatch,
  type ReactNode,
} from "react";

import {
  resolveActiveAccount,
  subscribeToAccountsForUser,
  type AccountEntity,
} from "../../../subdomains/account/api";
import { type AuthUser, useAuth } from "../../../subdomains/identity/api";
import {
  subscribeToWorkspacesForAccount,
  getWorkspaceStorageKey,
  toWorkspaceMap,
  type WorkspaceEntity,
} from "@/modules/workspace/api";
import type { ActiveAccount } from "@/modules/platform/api/contracts";
export type { ActiveAccount };

export interface AppState {
  /** All organization accounts visible to the signed-in user. */
  accounts: Record<string, AccountEntity>;
  /** True once the first Firestore snapshot has been received. */
  accountsHydrated: boolean;
  /** Bootstrap phase for optimistic seeding. */
  bootstrapPhase: "idle" | "seeded" | "hydrated";
  /** Currently selected account (personal user account or an organization). */
  activeAccount: ActiveAccount | null;
  /** Currently selected workspace context under the active account. */
  activeWorkspaceId: string | null;
  /** Workspaces visible under the active account (single source for shell UI). */
  workspaces: Record<string, WorkspaceEntity>;
  /** True once the first active-account workspace snapshot has been received. */
  workspacesHydrated: boolean;
}

export type AppAction =
  | {
      type: "SEED_ACTIVE_ACCOUNT";
      payload: { user: AuthUser };
    }
  | {
      type: "SET_ACCOUNTS";
      payload: {
        accounts: Record<string, AccountEntity>;
        user: AuthUser;
        preferredActiveAccountId?: string | null;
      };
    }
  | {
      type: "SET_WORKSPACES";
      payload: {
        workspaces: Record<string, WorkspaceEntity>;
        hydrated: boolean;
      };
    }
  | { type: "SET_ACTIVE_ACCOUNT"; payload: ActiveAccount | null }
  | { type: "SET_ACTIVE_WORKSPACE"; payload: string | null }
  | { type: "RESET_STATE" };

export interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextValue | null>(null);

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
        activeAccount: resolveActiveAccount({
          currentActiveAccount: state.activeAccount,
          accounts,
          personalAccount: user,
          preferredActiveAccountId,
          bootstrapPhase: state.bootstrapPhase,
        }),
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
