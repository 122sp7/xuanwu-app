"use client";

/**
 * auth-context.ts — backward-compat re-export shim.
 * Canonical source: modules/platform/subdomains/identity/interfaces/contexts/auth-context.ts
 */

export type {
  AuthUser,
  AuthStatus,
  AuthState,
  AuthAction,
  AuthContextValue,
} from "@/modules/platform/api";
export { AuthContext } from "@/modules/platform/api";
