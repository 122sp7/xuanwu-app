"use client";

/**
 * AuthContext — iam inbound adapter (React).
 *
 * Defines auth types and a minimal stub AuthProvider for the src/ migration layer.
 * Replace the stub body with a real Firebase auth implementation when available.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

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

const AuthContext = createContext<AuthContextValue | null>(null);


/** Stub auth provider — replace with Firebase auth when available. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, status: "unauthenticated" });

  useEffect(() => {
    // Reserved for Firebase auth subscription wiring
  }, []);

  async function logout() {
    setState({ user: null, status: "unauthenticated" });
  }

  return <AuthContext.Provider value={{ state, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Stub — replace with real Firebase auth use-cases when available. */
export function createClientAuthUseCases() {
  return {
    signInUseCase: {
      execute: async (_input: { email: string; password: string }): Promise<{ success: true; aggregateId: string } | { success: false; error: { message: string } }> =>
        ({ success: false as const, error: { message: "Not implemented" } }),
    },
    signInAnonymouslyUseCase: {
      execute: async (): Promise<{ success: true; aggregateId: string } | { success: false; error: { message: string } }> =>
        ({ success: false as const, error: { message: "Not implemented" } }),
    },
    registerUseCase: {
      execute: async (_input: { email: string; password: string; name: string }): Promise<{ success: true; aggregateId: string } | { success: false; error: { message: string } }> =>
        ({ success: false as const, error: { message: "Not implemented" } }),
    },
    sendPasswordResetEmailUseCase: {
      execute: async (_email: string): Promise<{ success: true; aggregateId: string } | { success: false; error: { message: string } }> =>
        ({ success: false as const, error: { message: "Not implemented" } }),
    },
  };
}

/** Stub — replace with real account use-cases when available. */
export function createClientAccountUseCases() {
  return {
    createUserAccountUseCase: {
      execute: async (_aggregateId: string, _name: string, _email: string) =>
        ({ success: false as const, error: { message: "Not implemented" } }),
    },
  };
}
