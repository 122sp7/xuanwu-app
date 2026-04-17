"use client";

/**
 * ShellGuard — platform inbound adapter (React).
 *
 * Auth guard for the authenticated shell layout.
 * Renders nothing (redirects) while auth is initialising or when the user is
 * unauthenticated; renders children only for authenticated sessions.
 *
 * Redirect behaviour:
 *  - initializing → show full-screen spinner (do not redirect — avoids flash
 *    for returning users whose Firebase token is resolving)
 *  - unauthenticated | anonymous without explicit access → redirect to "/"
 *  - authenticated → render children
 *
 * Anonymous sessions (Continue as Guest) are currently treated as
 * authenticated at the shell level; individual routes may restrict further.
 */

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "../../../../../iam/adapters/inbound/react/AuthContext";

interface ShellGuardProps {
  children: ReactNode;
}

export function ShellGuard({ children }: ShellGuardProps): React.ReactElement {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.status === "unauthenticated") {
      router.replace("/");
    }
  }, [state.status, router]);

  if (state.status === "initializing") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
      </div>
    ) as React.ReactElement;
  }

  if (state.status === "unauthenticated") {
    // Redirect is in-flight — render spinner to prevent content flash.
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
      </div>
    ) as React.ReactElement;
  }

  return children as React.ReactElement;
}
