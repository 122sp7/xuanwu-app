"use client";

/**
 * ShellUserAvatar — platform inbound adapter (React).
 *
 * Displays the authenticated user's avatar or initials in the shell header.
 * Opens a dropdown menu with the user's name, email, and a sign-out action.
 *
 * Design:
 *  - Avatar shows initials (up to 2 characters) derived from the display name.
 *  - Dropdown follows shadcn/ui DropdownMenu conventions.
 *  - Sign-out delegates to the onSignOut prop (ShellRootLayout handles the
 *    async logout and error state; this component stays presentation-only).
 */

import { LogOut, UserRound } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ShellUserAvatarProps {
  name: string;
  email: string;
  onSignOut: () => void;
}

export function ShellUserAvatar({
  name,
  email,
  onSignOut,
}: ShellUserAvatarProps): React.ReactElement {
  const initials = getInitials(name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        aria-label={`使用者選單：${name}`}
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary ring-1 ring-primary/20 transition hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {initials}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 font-normal">
            <div className="flex items-center gap-2">
              <UserRound className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate text-sm font-semibold">{name}</span>
            </div>
            <span className="truncate pl-[22px] text-xs text-muted-foreground">
              {email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 size-4" />
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) as React.ReactElement;
}
