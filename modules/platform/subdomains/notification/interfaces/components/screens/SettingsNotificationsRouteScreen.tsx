"use client";

import { useAuth } from "@/modules/iam/api";

import { NotificationsPage } from "../NotificationsPage";

export function SettingsNotificationsRouteScreen() {
  const { state: authState } = useAuth();
  const recipientId = authState.user?.id ?? "";

  return <NotificationsPage recipientId={recipientId} />;
}