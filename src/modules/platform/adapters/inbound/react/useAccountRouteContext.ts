"use client";

/**
 * useAccountRouteContext — platform inbound adapter (React).
 *
 * Derives route-level account context by combining:
 *  - URL params (`accountId` segment from Next.js routing)
 *  - Auth state (current authenticated user)
 *  - App state (loaded organisation accounts + activeAccount)
 *
 * Consumed by AccountRouteDispatcher (workspace) and any route component that
 * needs to know whether the active route is a personal or organisation scope.
 *
 * Design invariants:
 *  - routeAccountId  : raw value from the URL, never derived
 *  - resolvedAccountId: equals routeAccountId; exists for explicit intent
 *  - accountType     : null while accounts are still loading (hydration guard)
 *  - No mutations — read-only derived state
 */

import { useParams } from "next/navigation";
import { useApp, type ActiveAccount } from "./AppContext";
import { useAuth } from "../../../../iam/adapters/inbound/react/AuthContext";

// ── Public contract ───────────────────────────────────────────────────────────

export interface AccountRouteContextValue {
  /** Raw accountId segment from the URL (e.g. `/[accountId]/...`). */
  readonly routeAccountId: string;
  /**
   * Resolved account ID — currently mirrors routeAccountId.
   * Reserved for future alias / slug resolution without breaking callers.
   */
  readonly resolvedAccountId: string;
  /** UID of the currently authenticated user; null when unauthenticated. */
  readonly currentUserId: string | null;
  /**
   * Whether the route account is an organisation or personal account.
   * null while the account list has not yet been hydrated from Firestore.
   */
  readonly accountType: "organization" | "user" | null;
  /** True once the organisation account list has been loaded from Firestore. */
  readonly accountsHydrated: boolean;
  /** Currently active account (personal AuthUser or AccountEntity). */
  readonly activeAccount: ActiveAccount | null;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAccountRouteContext(): AccountRouteContextValue {
  const params = useParams();
  const { state: appState } = useApp();
  const { state: authState } = useAuth();

  const routeAccountId = (params?.accountId as string) ?? "";
  const currentUserId = authState.user?.id ?? null;

  // Determine account type from available state.
  // We only commit to a type once data is available to avoid transient
  // misrouting while accounts are still loading.
  let accountType: "organization" | "user" | null = null;

  if (routeAccountId) {
    if (appState.accounts[routeAccountId]) {
      // The URL account is a known organisation — use the stored accountType
      // (could be "user" personal account stored in Firestore or "organization").
      accountType = appState.accounts[routeAccountId].accountType;
    } else if (currentUserId && routeAccountId === currentUserId) {
      // The URL account is the authenticated user's personal (Firebase Auth) account.
      accountType = "user";
    }
    // else: either accounts not yet hydrated or an unknown ID — stay null
  }

  return {
    routeAccountId,
    resolvedAccountId: routeAccountId,
    currentUserId,
    accountType,
    accountsHydrated: appState.accountsHydrated,
    activeAccount: appState.activeAccount,
  };
}
