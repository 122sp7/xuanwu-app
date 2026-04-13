/**
 * app/(shell)/layout.tsx — Next.js route layout shim.
 * Canonical implementation: app/(shell)/_shell/ShellRootLayout.tsx
 */

import { ShellLayout } from "./_shell/ShellRootLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ShellLayout>{children}</ShellLayout>;
}
