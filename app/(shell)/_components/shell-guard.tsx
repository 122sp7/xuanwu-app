"use client";

/**
 * shell-guard.tsx
 * Client-side auth guard for the authenticated shell.
 *
 * Responsibilities:
 *  1. Redirect to `/` (public auth page) when auth status is "unauthenticated"
 *  2. Mount useTokenRefreshListener for [S6] Claims refresh (Party 3)
 *  3. Show a loading state while auth is initializing
 */

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/providers/auth-provider";
import { useTokenRefreshListener } from "@/modules/identity/api";

interface ShellGuardProps {
  children: ReactNode;
}

export function ShellGuard({ children }: ShellGuardProps) {
  const { state } = useAuth();
  const { user, status } = state;
  const router = useRouter();

  // [S6] Party 3: force-refresh ID token when a TOKEN_REFRESH_SIGNAL is emitted
  useTokenRefreshListener(user?.id ?? null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "initializing") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
