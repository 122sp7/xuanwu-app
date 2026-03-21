"use client";

/**
 * Module: header-controls.tsx
 * Purpose: compose shell header utility controls.
 * Responsibilities: language switch, theme toggle, and notification entry.
 * Constraints: presentation-only, no domain orchestration.
 */

import { Bell, Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/app/providers/auth-provider";
import type { NotificationEntity } from "@/modules/notification";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/modules/notification/interfaces/_actions/notification.actions";
import { getNotificationsForRecipient } from "@/modules/notification/interfaces/queries/notification.queries";
import { Button } from "@ui-shadcn/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@ui-shadcn/ui/dropdown-menu";
import { TranslationSwitcher } from "./translation-switcher";

const THEME_KEY = "xuanwu_theme";
const NOTIFICATION_LIMIT = 20;

function formatNotificationTime(timestamp: number) {
  return new Intl.DateTimeFormat("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function HeaderControls() {
  const { state: authState } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [isNotificationMutating, setIsNotificationMutating] = useState(false);
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);

  const recipientId = authState.user?.id ?? "";
  const unreadCount = useMemo(
    () => notifications.reduce((count, notification) => count + (notification.read ? 0 : 1), 0),
    [notifications],
  );

  const loadNotifications = useCallback(async () => {
    if (!recipientId) {
      setNotifications([]);
      return;
    }
    setIsNotificationLoading(true);
    try {
      const nextNotifications = await getNotificationsForRecipient(recipientId, NOTIFICATION_LIMIT);
      setNotifications(nextNotifications);
    } finally {
      setIsNotificationLoading(false);
    }
  }, [recipientId]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  async function handleNotificationOpenChange(nextOpen: boolean) {
    setIsNotificationOpen(nextOpen);
    if (nextOpen) {
      await loadNotifications();
    }
  }

  async function handleMarkOneRead(notificationId: string) {
    if (!recipientId) return;
    setIsNotificationMutating(true);
    const previous = notifications;
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      ),
    );
    try {
      const result = await markNotificationRead(notificationId, recipientId);
      if (!result.success) {
        setNotifications(previous);
      }
    } finally {
      setIsNotificationMutating(false);
    }
  }

  async function handleMarkAllRead() {
    if (!recipientId || unreadCount === 0) return;
    setIsNotificationMutating(true);
    const previous = notifications;
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
    try {
      const result = await markAllNotificationsRead(recipientId);
      if (!result.success) {
        setNotifications(previous);
      }
    } finally {
      setIsNotificationMutating(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <TranslationSwitcher />

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="text-muted-foreground"
      >
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>

      <DropdownMenu open={isNotificationOpen} onOpenChange={handleNotificationOpenChange}>
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
              disabled={isNotificationMutating || unreadCount === 0}
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-y-auto">
            {isNotificationLoading ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => void handleMarkOneRead(notification.id)}
                  disabled={isNotificationMutating}
                  className="block w-full border-b border-border/60 px-3 py-2 text-left transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {!notification.read ? (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
