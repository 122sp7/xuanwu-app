"use client";

/**
 * AccountSwitcher — platform inbound adapter (React).
 *
 * Renders an account switcher control that lets the user toggle between their
 * personal (Firebase Auth) account and any organisation accounts they belong to.
 *
 * Design:
 *  - Current active account is shown as the trigger label.
 *  - Dropdown lists personal account first, then organisation accounts.
 *  - Active item is visually highlighted (check mark).
 *  - "Create organisation" entry at the bottom opens CreateOrganizationDialog.
 *
 * Props follow the same interface established in the stubs so callers
 * (ShellRootLayout, ShellAppRail) need no changes.
 */

import { useState } from "react";
import { Building2, Check, ChevronsUpDown, Plus, UserRound } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";

import type { AuthUser } from "../../../../../iam/adapters/inbound/react/AuthContext";
import type { AccountEntity } from "../AppContext";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AccountSwitcherProps {
  personalAccount: AuthUser | null;
  organizationAccounts: AccountEntity[];
  activeAccountId: string | null;
  onSelectPersonal: () => void;
  onSelectOrganization: (account: AccountEntity) => void;
  onOrganizationCreated?: (account: AccountEntity) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getActiveLabel(
  activeAccountId: string | null,
  personalAccount: AuthUser | null,
  organizationAccounts: AccountEntity[],
): string {
  if (!activeAccountId) return "アカウント";
  if (personalAccount && activeAccountId === personalAccount.id) {
    return personalAccount.name || "個人帳號";
  }
  const org = organizationAccounts.find((a) => a.id === activeAccountId);
  return org?.name ?? "未知帳號";
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AccountSwitcher({
  personalAccount,
  organizationAccounts,
  activeAccountId,
  onSelectPersonal,
  onSelectOrganization,
  onOrganizationCreated,
}: AccountSwitcherProps): React.ReactElement | null {
  const [createOrgOpen, setCreateOrgOpen] = useState(false);

  if (!personalAccount) return null;

  const activeLabel = getActiveLabel(
    activeAccountId,
    personalAccount,
    organizationAccounts,
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/70 px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="max-w-[120px] truncate">{activeLabel}</span>
            <ChevronsUpDown className="size-3 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-52">
          {/* Personal account */}
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            個人
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={onSelectPersonal}
            className="cursor-pointer"
          >
            <UserRound className="mr-2 size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{personalAccount.name || "個人帳號"}</span>
            {activeAccountId === personalAccount.id && (
              <Check className="ml-auto size-4 shrink-0 text-primary" />
            )}
          </DropdownMenuItem>

          {/* Organisation accounts */}
          {organizationAccounts.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                組織
              </DropdownMenuLabel>
              {organizationAccounts.map((account) => (
                <DropdownMenuItem
                  key={account.id}
                  onClick={() => onSelectOrganization(account)}
                  className="cursor-pointer"
                >
                  <Building2 className="mr-2 size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{account.name}</span>
                  {activeAccountId === account.id && (
                    <Check className="ml-auto size-4 shrink-0 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setCreateOrgOpen(true)}
            className="cursor-pointer text-muted-foreground"
          >
            <Plus className="mr-2 size-4 shrink-0" />
            新增組織
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateOrganizationDialog
        open={createOrgOpen}
        onOpenChange={setCreateOrgOpen}
        user={personalAccount}
        onOrganizationCreated={(account) => {
          setCreateOrgOpen(false);
          onOrganizationCreated?.(account);
        }}
      />
    </>
  ) as React.ReactElement;
}
