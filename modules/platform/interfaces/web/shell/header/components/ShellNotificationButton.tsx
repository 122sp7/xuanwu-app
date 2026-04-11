"use client";

import { NotificationBell } from "../../../../../subdomains/notification/api";

interface ShellNotificationButtonProps {
  readonly recipientId: string;
}

export function ShellNotificationButton({ recipientId }: ShellNotificationButtonProps) {
  return <NotificationBell recipientId={recipientId} />;
}
