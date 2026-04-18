"use client";

/**
 * platform-ui-stubs — platform inbound adapter (React).
 *
 * Remaining stubs for platform UI elements not yet implemented as real
 * components.  Items that have been promoted to real implementations are
 * re-exported from their canonical files below.
 *
 * Account / organization route screens are owned here because they belong to
 * the platform bounded context (account lifecycle, org management) rather than
 * to the workspace bounded context.
 */

import { useState } from "react";
import { CalendarDays } from "lucide-react";

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

// ── Account / organization route screens ──────────────────────────────────────
// These screens belong to the platform bounded context (account lifecycle and
// organization management) and were previously misplaced in workspace-ui-stubs.

export function AccountDashboardRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Account Dashboard (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationWorkspacesRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Organization Workspaces (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationTeamsRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Teams (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationScheduleRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      <div className="mb-2 flex items-center gap-2 text-foreground">
        <CalendarDays className="size-4" />
        <span className="font-medium">Schedule</span>
      </div>
      Schedule (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationDailyRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Daily (stub)
    </div>
  ) as React.ReactElement;
}

export function OrganizationAuditRouteScreen(): React.ReactElement {
  return (
    <div className="px-4 py-6 text-sm text-muted-foreground">
      Audit (stub)
    </div>
  ) as React.ReactElement;
}
