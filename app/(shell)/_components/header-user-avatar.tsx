"use client";

/**
 * Module: header-user-avatar.tsx
 * Purpose: render top-right signed-in user identity as avatar with quick actions.
 * Responsibilities: display user identity and expose sign-out action.
 * Constraints: keep header interaction lightweight and presentation-oriented.
 */

import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@ui-shadcn/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";

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
          aria-label="開啟使用者選單"
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
        <DropdownMenuItem
          variant="destructive"
          onClick={onSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="size-4 shrink-0" />
          <span>登出</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
