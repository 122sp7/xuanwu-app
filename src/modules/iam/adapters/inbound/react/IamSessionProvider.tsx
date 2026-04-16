"use client";

/**
 * IamSessionProvider — iam inbound adapter (React).
 *
 * Canonical mount point for IAM authentication session state.
 * Wraps the identity-layer AuthProvider and exposes the useIamSession() hook
 * so the rest of the src/ tree never imports directly from the old interfaces/.
 *
 * Internal source: modules/iam/subdomains/identity/interfaces/providers/auth-provider.tsx
 */

export {
  AuthProvider as IamSessionProvider,
  useAuth as useIamSession,
} from "@/modules/platform/api";

export type { AuthState, AuthUser, AuthStatus } from "@/modules/platform/api";
