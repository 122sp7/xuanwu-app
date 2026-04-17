import { ShellFrame } from "@/src/modules/platform/adapters/inbound/react";

export default function ShellLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ShellFrame>{children}</ShellFrame>;
}
