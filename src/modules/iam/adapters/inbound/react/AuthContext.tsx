"use client";

/**
 * AuthContext — iam inbound adapter (React).
 *
 * Provides the AuthProvider component and useAuth hook.
 * Uses the firebase-composition outbound adapter for all Firebase operations
 * so this file remains free of direct Firebase SDK imports.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  subscribeToAuthState,
  firebaseSignOut,
  createClientAuthUseCases as buildAuthUseCases,
  createClientAccountUseCases as buildAccountUseCases,
} from "../../outbound/firebase-composition";

// ─── Auth bootstrapping timeout ───────────────────────────────────────────────
// If Firebase hasn't resolved the auth state within this window, treat the
// session as unauthenticated so the UI isn't blocked indefinitely.
const AUTH_BOOTSTRAP_TIMEOUT_MS = 6_000;

// ─── Public types ─────────────────────────────────────────────────────────────

export interface AuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

export type AuthStatus = "initializing" | "authenticated" | "unauthenticated" | "anonymous";

export interface AuthState {
  readonly user: AuthUser | null;
  readonly status: AuthStatus;
}

export interface AuthContextValue {
  readonly state: AuthState;
  readonly logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, status: "initializing" });

  useEffect(() => {
    // Bootstrap timeout: if Firebase doesn't resolve within the window,
    // fall back to unauthenticated so the UI is never permanently blocked.
    const bootstrapTimer = setTimeout(() => {
      setState((prev) =>
        prev.status === "initializing"
          ? { user: null, status: "unauthenticated" }
          : prev,
      );
    }, AUTH_BOOTSTRAP_TIMEOUT_MS);

    const unsubscribe = subscribeToAuthState((firebaseUser) => {
      clearTimeout(bootstrapTimer);
      if (firebaseUser) {
        setState({
          user: {
            id: firebaseUser.uid,
            name: firebaseUser.displayName ?? "Member",
            email: firebaseUser.email ?? "",
          },
          status: firebaseUser.isAnonymous ? "anonymous" : "authenticated",
        });
      } else {
        setState({ user: null, status: "unauthenticated" });
      }
    });

    return () => {
      clearTimeout(bootstrapTimer);
      unsubscribe();
    };
  }, []);

  async function logout() {
    await firebaseSignOut();
    // State will be updated by the onAuthStateChanged listener above.
  }

  return <AuthContext.Provider value={{ state, logout }}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ─── Use-case factories (re-exported from outbound composition) ───────────────

/**
 * Returns Firebase-backed auth use cases.
 * Calling this in a component is safe: each call shares singleton repositories.
 */
export const createClientAuthUseCases = buildAuthUseCases;

/**
 * Returns Firebase-backed account use cases.
 */
export const createClientAccountUseCases = buildAccountUseCases;
