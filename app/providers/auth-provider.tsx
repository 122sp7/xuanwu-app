"use client";

/**
 * auth-provider.tsx
 * Hosts the Firebase auth state lifecycle and exposes useAuth().
 * Syncs onAuthStateChanged → AuthContext → consumed by AppProvider and shell guard.
 *
 * [S6] Token refresh is handled separately by useTokenRefreshListener (Party 3).
 */

import { useReducer, useContext, useEffect, type ReactNode } from "react";
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";

import { firebaseClientApp } from "@/infrastructure/firebase/client";
import {
  AuthContext,
  type AuthAction,
  type AuthState,
  type AuthUser,
} from "./auth-context";

// ─── Constants ────────────────────────────────────────────────────────────────

const AUTH_BOOTSTRAP_TIMEOUT_MS = 6000;

// ─── Mapper ───────────────────────────────────────────────────────────────────

function toAuthUser(user: User): AuthUser {
  return {
    id: user.uid,
    name: user.displayName ?? "Dimension Member",
    email: user.email ?? "",
  };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_AUTH_STATE":
      return {
        ...state,
        user: action.payload.user,
        status: action.payload.status,
      };
    case "UPDATE_DISPLAY_NAME":
      if (!state.user) return state;
      return { ...state, user: { ...state.user, name: action.payload.name } };
    default:
      return state;
  }
};

const initialState: AuthState = { user: null, status: "initializing" };

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let resolved = false;
    const auth = getAuth(firebaseClientApp);

    const timeoutId = window.setTimeout(() => {
      if (resolved) return;
      dispatch({
        type: "SET_AUTH_STATE",
        payload: { user: null, status: "unauthenticated" },
      });
    }, AUTH_BOOTSTRAP_TIMEOUT_MS);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      resolved = true;
      window.clearTimeout(timeoutId);

      if (firebaseUser) {
        dispatch({
          type: "SET_AUTH_STATE",
          payload: { user: toAuthUser(firebaseUser), status: "authenticated" },
        });
      } else {
        dispatch({
          type: "SET_AUTH_STATE",
          payload: { user: null, status: "unauthenticated" },
        });
      }
    });

    return () => {
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    await signOut(getAuth(firebaseClientApp));
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
