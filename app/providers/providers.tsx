"use client";

/**
 * providers.tsx
 * Composed root providers tree.
 * Import <Providers> into app/layout.tsx to wrap the entire application.
 *
 * Provider nesting order (outermost → innermost):
 *   AuthProvider   — Firebase auth state
 *   AppProvider    — Active account + org accounts (depends on AuthProvider)
 */

import type { ReactNode } from "react";
import { AuthProvider } from "./auth-provider";
import { AppProvider } from "./app-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>{children}</AppProvider>
    </AuthProvider>
  );
}
