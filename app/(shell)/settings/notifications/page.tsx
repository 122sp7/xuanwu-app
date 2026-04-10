"use client";

import { useAuth } from "@/app/providers/auth-provider";
import { NotificationsPage } from "@/modules/platform/api";

export default function NotificationCenterPage() {
  const { state: authState } = useAuth();
  const recipientId = authState.user?.id ?? "";
  return <NotificationsPage recipientId={recipientId} />;
}
