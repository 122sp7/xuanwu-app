"use client";

/**
 * shell-providers.tsx — platform/interfaces/web layer
 * Composed root providers tree.
 * Import <Providers> into app/layout.tsx to wrap the entire application.
 *
 * Provider nesting order (outermost → innermost):
 *   AuthProvider   — Firebase auth state
 *   AppProvider    — Active account + org accounts (depends on AuthProvider)
 */

import type { ReactNode } from "react";
import { Toaster } from "@ui-shadcn/ui/sonner";
import { AuthProvider } from "../../../subdomains/identity/api";
import { AppProvider } from "./ShellAppProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>{children}</AppProvider>
      <Toaster richColors closeButton />
    </AuthProvider>
  );
}
