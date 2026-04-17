"use client";

/**
 * platform-ui-stubs — platform inbound adapter (React).
 *
 * Stub components and hooks for platform UI elements that were previously
 * sourced from @/modules/platform/api/ui. Replace with real implementations
 * when the platform UI layer is available.
 */

import type { ReactNode } from "react";

import type { AuthUser } from "../../../../iam/adapters/inbound/react/AuthContext";
import type { AccountEntity, ActiveAccount } from "./AppContext";

// ── Auth guard ────────────────────────────────────────────────────────────────

export function ShellGuard({ children }: { children: ReactNode }): React.ReactElement {
  return children as React.ReactElement;
}

// ── Account switcher ──────────────────────────────────────────────────────────

interface AccountSwitcherProps {
  personalAccount: AuthUser | null;
  organizationAccounts: AccountEntity[];
  activeAccountId: string | null;
  onSelectPersonal: () => void;
  onSelectOrganization: (account: AccountEntity) => void;
  onOrganizationCreated?: (account: AccountEntity) => void;
}

export function AccountSwitcher(_props: AccountSwitcherProps): null {
  return null;
}

// ── Shell breadcrumbs & header controls ───────────────────────────────────────

export function ShellAppBreadcrumbs(): null {
  return null;
}

export function ShellHeaderControls(): null {
  return null;
}

interface ShellUserAvatarProps {
  name: string;
  email: string;
  onSignOut: () => void;
}

export function ShellUserAvatar(_props: ShellUserAvatarProps): null {
  return null;
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
  return { open: false, setOpen: () => {} };
}

// ── Organization dialogs ──────────────────────────────────────────────────────

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthUser | null;
  onOrganizationCreated?: (account: AccountEntity) => void;
  onNavigate?: (href: string) => void;
}

export function CreateOrganizationDialog(
  _props: CreateOrganizationDialogProps,
): null {
  return null;
}

// ── Account route context ─────────────────────────────────────────────────────

export interface AccountRouteContextValue {
  readonly routeAccountId: string;
  readonly resolvedAccountId: string;
  readonly currentUserId: string | null;
  readonly accountType: "organization" | "user" | null;
  readonly accountsHydrated: boolean;
  readonly activeAccount: ActiveAccount | null;
}

export function useAccountRouteContext(): AccountRouteContextValue {
  return {
    routeAccountId: "",
    resolvedAccountId: "",
    currentUserId: null,
    accountType: null,
    accountsHydrated: false,
    activeAccount: null,
  };
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
