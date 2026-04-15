"use client";

import { HeaderUserAvatar } from "@/modules/iam/api";

interface ShellUserAvatarProps {
  readonly name: string;
  readonly email: string;
  readonly onSignOut: () => void;
}

export function ShellUserAvatar({ name, email, onSignOut }: ShellUserAvatarProps) {
  return <HeaderUserAvatar name={name} email={email} onSignOut={onSignOut} />;
}
