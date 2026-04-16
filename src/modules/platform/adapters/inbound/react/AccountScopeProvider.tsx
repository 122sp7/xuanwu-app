"use client";

/**
 * AccountScopeProvider — platform inbound adapter (React).
 *
 * Manages platform-owned account lifecycle: auth → accounts → activeAccount.
 * Canonical replacement for app/(shell)/_providers/AppProvider.tsx in the
 * src/ migration layer.
 *
 * Consumers use useAccountScope() to read account state.
 * Ported from: app/(shell)/_providers/AppProvider.tsx
 */

export {
  AppProvider as AccountScopeProvider,
} from "@/app/(shell)/_providers/AppProvider";
