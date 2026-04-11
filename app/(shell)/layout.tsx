"use client";

/**
 * app/(shell)/layout.tsx — Next.js route layout shim.
 * Canonical implementation: modules/platform/interfaces/web/components/ShellRootLayout.tsx
 */

import { ShellLayout } from "@/modules/platform/api";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ShellLayout>{children}</ShellLayout>;
}
