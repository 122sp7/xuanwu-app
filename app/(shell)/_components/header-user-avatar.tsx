"use client";

/**
 * Module: header-user-avatar.tsx
 * Purpose: render top-right signed-in user identity as avatar with quick actions.
 * Responsibilities: display user identity and expose sign-out action.
 * Constraints: keep header interaction lightweight and presentation-oriented.
 */

import Link from "next/link";
import { LogOut, Settings, SlidersHorizontal } from "lucide-react";

import { Avatar, AvatarFallback } from "@ui-shadcn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn";

interface HeaderUserAvatarProps {
  readonly name: string;
  readonly email: string;
  readonly onSignOut: () => void;
}

function toInitial(name: string, email: string) {
  const source = name.trim() || email.trim();
  return source.charAt(0).toUpperCase() || "U";
}

export function HeaderUserAvatar({ name, email, onSignOut }: HeaderUserAvatarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className="rounded-full ring-offset-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {toInitial(name, email)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {/* Profile header */}
        <div className="flex flex-col items-center gap-2 px-4 py-4">
          <Avatar size="lg">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {toInitial(name, email)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2">
            <Settings className="size-4 shrink-0" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings?tab=preferences" className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 shrink-0" />
            <span>Preferences</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={onSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="size-4 shrink-0" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
