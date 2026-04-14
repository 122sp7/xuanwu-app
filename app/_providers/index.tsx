"use client";

/**
 * Root providers composition — app/_providers
 *
 * Assembles the full provider tree for the application:
 *   AuthProvider (platform) → AppProvider (platform accounts) → WorkspaceContextProvider (workspace)
 *
 * Lives in app/ because it composes providers from multiple bounded contexts.
 */

import type { ReactNode } from "react";
import { Toaster } from "@ui-shadcn/ui/sonner";
import { AuthProvider } from "@/modules/platform/api";
import { WorkspaceContextProvider } from "@/modules/workspace/api/ui";
import { AppProvider } from "../(shell)/_providers/AppProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        <WorkspaceContextProvider>
          {children}
        </WorkspaceContextProvider>
      </AppProvider>
      <Toaster richColors closeButton />
    </AuthProvider>
  );
}
