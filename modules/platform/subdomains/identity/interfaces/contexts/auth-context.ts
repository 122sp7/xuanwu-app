"use client";

/**
 * auth-context.ts — platform/identity interfaces layer
 * Defines the AuthContext contract: state shape, actions, and React context.
 * Consumed by AuthProvider and useAuth().
 *
 * AuthUser is owned by the Platform/Identity bounded context.
 */

import { createContext, type Dispatch } from "react";

import type { AuthUser } from "@/modules/platform/api/contracts";
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
