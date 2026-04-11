"use client";

/**
 * HeaderControls – platform interfaces/web component.
 * Composes shell header utility controls: language switch, theme toggle, notification bell.
 */

import { useAuth } from "../../../subdomains/identity/api";
import { ShellNotificationButton } from "./ShellNotificationButton";
import { ShellThemeToggle } from "./ShellThemeToggle";
import { ShellTranslationSwitcher } from "./ShellTranslationSwitcher";

export function HeaderControls() {
  const { state: authState } = useAuth();

  const recipientId = authState.user?.id ?? "";

  return (
    <div className="flex items-center gap-2">
      <ShellTranslationSwitcher />
      <ShellThemeToggle />
      <ShellNotificationButton recipientId={recipientId} />
    </div>
  );
}
