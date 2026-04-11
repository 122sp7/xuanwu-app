"use client";

/**
 * app-context.ts — platform/interfaces/web layer
 * Defines the AppContext contract: the cross-cutting "active account" state.
 *
 * Holds the set of accounts visible to the current user plus the currently
 * active account selection. Consumed by feature pages and sidebar nav.
 */

import { createContext, type Dispatch } from "react";

import type { AuthUser } from "@/modules/platform/api/contracts";
import type { AccountEntity } from "../../../subdomains/account/api";
import type { WorkspaceEntity } from "@/modules/workspace/api";
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
