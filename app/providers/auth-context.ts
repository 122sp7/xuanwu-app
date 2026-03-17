"use client";

/**
 * auth-context.ts
 * Defines the AuthContext contract: state shape, actions, and React context.
 * Consumed by AuthProvider and useAuth().
 */

import { createContext, type Dispatch } from "react";

export type AuthStatus = "initializing" | "authenticated" | "unauthenticated";

/** Minimal user record surfaced from Firebase auth state. */
export interface AuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

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
