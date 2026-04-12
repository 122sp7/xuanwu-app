"use client";

/**
 * NotificationBell — Reusable notification bell for shell header.
 * Lives in platform/subdomains/notification/interfaces.
 */

import Link from "next/link";
import { Bell } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  markNotificationRead,
  markAllNotificationsRead,
} from "../_actions/notification.actions";
import { getNotificationsForRecipient } from "../queries/notification.queries";
import type { NotificationEntity } from "../../application/dtos/notification.dto";
import { Button } from "@ui-shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";

const NOTIFICATION_LIMIT = 20;

function formatNotificationTime(timestamp: number) {
  return new Intl.DateTimeFormat("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

interface NotificationBellProps {
  readonly recipientId: string;
}

export function NotificationBell({ recipientId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);

  const unreadCount = useMemo(
    () => notifications.reduce((count, n) => count + (n.read ? 0 : 1), 0),
    [notifications],
  );

  const loadNotifications = useCallback(async () => {
    if (!recipientId) {
      setNotifications([]);
      return;
    }
    setIsLoading(true);
    try {
      const next = await getNotificationsForRecipient(recipientId, NOTIFICATION_LIMIT);
      setNotifications(next);
    } finally {
      setIsLoading(false);
    }
  }, [recipientId]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  async function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    if (nextOpen) {
      await loadNotifications();
    }
  }

  async function handleMarkOneRead(notificationId: string) {
    if (!recipientId) return;
    setIsMutating(true);
    const previous = notifications;
    setNotifications((current) =>
      current.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
    try {
      const result = await markNotificationRead(notificationId, recipientId);
      if (!result.success) setNotifications(previous);
    } finally {
      setIsMutating(false);
    }
  }

  async function handleMarkAllRead() {
    if (!recipientId || unreadCount === 0) return;
    setIsMutating(true);
    const previous = notifications;
    setNotifications((current) => current.map((n) => ({ ...n, read: true })));
    try {
      const result = await markAllNotificationsRead(recipientId);
      if (!result.success) setNotifications(previous);
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Open notifications"
          className="relative text-muted-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] font-semibold leading-4 text-primary-foreground">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2">
          <p className="text-sm font-semibold">Notifications</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={isMutating || unreadCount === 0}
            onClick={handleMarkAllRead}
          >
            Mark all read
          </Button>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No notifications</p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => void handleMarkOneRead(notification.id)}
                disabled={isMutating}
                className="block w-full border-b border-border/60 px-3 py-2 text-left transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.read ? (
                    <span
                      className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {notification.message}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {formatNotificationTime(notification.timestamp)}
                </p>
              </button>
            ))
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="py-1 text-center">
          <Link
            href={`/${encodeURIComponent(recipientId)}/settings/notifications`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            查看全部通知
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
