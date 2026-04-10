"use client";

/**
 * providers.tsx — platform/interfaces/web layer
 * Composed root providers tree.
 * Import <Providers> into app/layout.tsx to wrap the entire application.
 *
 * Provider nesting order (outermost → innermost):
 *   AuthProvider   — Firebase auth state
 *   AppProvider    — Active account + org accounts (depends on AuthProvider)
 */

import type { ReactNode } from "react";
import { Toaster } from "@ui-shadcn/ui/sonner";
import { AuthProvider } from "../../../subdomains/identity/interfaces/providers/auth-provider";
import { AppProvider } from "./app-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>{children}</AppProvider>
      <Toaster richColors closeButton />
    </AuthProvider>
  );
}
