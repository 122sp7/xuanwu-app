/**
 * Route: /settings/notifications
 * Purpose: Full-page notification center showing all notifications for the
 *          authenticated user with read/unread filtering and bulk actions.
 */
"use client";

import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import { useAuth } from "@/app/providers/auth-provider";
import {
  markAllNotificationsRead,
  markNotificationRead,
  getNotificationsForRecipient,
  type NotificationEntity,
} from "@/modules/platform/api";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Skeleton } from "@ui-shadcn/ui/skeleton";

type Filter = "all" | "unread";

const TYPE_BADGE: Record<string, string> = {
  info: "bg-blue-100 text-blue-800",
  alert: "bg-red-100 text-red-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
};

function formatTime(ts: number) {
  return new Intl.DateTimeFormat("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export default function NotificationCenterPage() {
  const { state: authState } = useAuth();
  const recipientId = authState.user?.id ?? "";

  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    if (!recipientId) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const data = await getNotificationsForRecipient(recipientId, 100);
      setNotifications(data);
    } finally {
      setIsLoading(false);
    }
  }, [recipientId]);

  useEffect(() => { void load(); }, [load]);

  const displayed = useMemo(
    () => filter === "unread" ? notifications.filter((n) => !n.read) : notifications,
    [notifications, filter],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  function handleMarkOne(id: string) {
    startTransition(async () => {
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
      await markNotificationRead(id, recipientId);
    });
  }

  function handleMarkAll() {
    startTransition(async () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      await markAllNotificationsRead(recipientId);
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold">?銝剖?</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-1">{unreadCount} ?芾?</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter((f) => f === "all" ? "unread" : "all")}
            className="text-xs"
          >
            {filter === "all" ? "?芰??芾?" : "憿舐內?券"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isPending || unreadCount === 0}
            onClick={handleMarkAll}
            className="text-xs gap-1"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            ?券璅撌脰?
          </Button>
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
          <Bell className="h-10 w-10 opacity-30" />
          <p className="text-sm">{filter === "unread" ? "瘝??芾??" : "?桀?瘝??"}</p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border">
          {displayed.map((n) => (
            <li
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40 ${n.read ? "opacity-60" : ""}`}
            >
              {!n.read && (
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
              )}
              {n.read && <span className="mt-2 h-2 w-2 shrink-0" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{n.title}</p>
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${TYPE_BADGE[n.type] ?? ""}`}>
                    {n.type}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{formatTime(n.timestamp)}</p>
              </div>
              {!n.read && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending}
                  onClick={() => handleMarkOne(n.id)}
                  title="璅撌脰?"
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

