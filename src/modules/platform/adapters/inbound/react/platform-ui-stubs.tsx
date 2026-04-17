"use client";

/**
 * platform-ui-stubs — platform inbound adapter (React).
 *
 * Remaining stubs for platform UI elements not yet implemented as real
 * components.  Items that have been promoted to real implementations are
 * re-exported from their canonical files below.
 */

import { useState } from "react";

// ── Shell theme toggle + language switcher ────────────────────────────────────
// Imported locally so they can be composed in ShellHeaderControls below,
// then re-exported so callers that want direct access can import from here.

import { ShellThemeToggle } from "./shell/ShellThemeToggle";
import { ShellLanguageSwitcher } from "./shell/ShellLanguageSwitcher";

// ── Real implementations (promoted from stubs) ────────────────────────────────

export { ShellGuard } from "./shell/ShellGuard";
export { ShellUserAvatar } from "./shell/ShellUserAvatar";
export { AccountSwitcher } from "./shell/AccountSwitcher";
export { CreateOrganizationDialog } from "./shell/CreateOrganizationDialog";
export { ShellThemeToggle, ShellLanguageSwitcher };

// ── Account route context ─────────────────────────────────────────────────────

export {
  useAccountRouteContext,
  type AccountRouteContextValue,
} from "./useAccountRouteContext";

// ── Shell breadcrumbs ─────────────────────────────────────────────────────────

export function ShellAppBreadcrumbs(): null {
  return null;
}

// ── Shell header controls (theme toggle + language switcher) ──────────────────

export function ShellHeaderControls(): React.ReactElement {
  return (
    <div className="flex items-center gap-1">
      <ShellLanguageSwitcher />
      <ShellThemeToggle />
    </div>
  ) as React.ReactElement;
}

// ── Global search ─────────────────────────────────────────────────────────────

interface ShellGlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShellGlobalSearchDialog(
  _props: ShellGlobalSearchDialogProps,
): null {
  return null;
}

export function useShellGlobalSearch(): {
  open: boolean;
  setOpen: (open: boolean) => void;
} {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}

// ── Stub route screens ────────────────────────────────────────────────────────

export function OrganizationMembersRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Members (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationOverviewRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Overview (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationPermissionsRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Permissions (stub)
    </div>
  ) as React.ReactElement;
}

export function SettingsNotificationsRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Notifications Settings (stub)
    </div>
  ) as React.ReactElement;
}
