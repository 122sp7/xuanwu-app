"use client";

/**
 * auth-context.ts
 * Defines the AuthContext contract: state shape, actions, and React context.
 * Consumed by AuthProvider and useAuth().
 *
 * AuthUser is now owned by the Platform/Identity bounded context.
 * Re-exported here for backward compatibility with existing app-layer callers.
 */

import { createContext, type Dispatch } from "react";

// AuthUser is the canonical source in Platform BC — import and re-export for app-layer consumers.
import type { AuthUser } from "@/modules/platform/api";
export type { AuthUser };

export type AuthStatus = "initializing" | "authenticated" | "unauthenticated";

export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
}

export type AuthAction =
  | { type: "SET_AUTH_STATE"; payload: { user: AuthUser | null; status: AuthStatus } }
  | { type: "UPDATE_DISPLAY_NAME"; payload: { name: string } };

export interface AuthContextValue {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
