"use client";

/**
 * PlatformBootstrap — platform inbound adapter (React).
 *
 * Self-contained provider tree for the src/ migration layer.
 * Assembles: IamSessionProvider → AccountScopeProvider → WorkspaceScopeProvider + Toaster.
 *
 * src/app/layout.tsx mounts this as the single composition root.
 * After this point, the rest of the tree can use:
 *   - useIamSession()     (iam)
 *   - useAccountScope()   (platform)
 *   - useWorkspaceScope() (workspace)
 */

import type { ReactNode } from "react";
import { Toaster } from "@/packages/ui-shadcn/ui/sonner";

import { IamSessionProvider } from "@/src/modules/iam/adapters/inbound/react";
import { AccountScopeProvider } from "./AccountScopeProvider";
import { WorkspaceScopeProvider } from "@/src/modules/workspace/adapters/inbound/react";

export function PlatformBootstrap({ children }: { children: ReactNode }) {
  return (
    <IamSessionProvider>
      <AccountScopeProvider>
        <WorkspaceScopeProvider>
          {children}
        </WorkspaceScopeProvider>
      </AccountScopeProvider>
      <Toaster richColors closeButton />
    </IamSessionProvider>
  );
}
