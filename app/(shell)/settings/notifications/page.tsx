"use client";

import { useAuth, NotificationsPage } from "@/modules/platform/api"

export default function NotificationCenterPage() {
  const { state: authState } = useAuth();
  const recipientId = authState.user?.id ?? "";
  return <NotificationsPage recipientId={recipientId} />;
}
