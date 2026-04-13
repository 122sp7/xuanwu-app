"use client";

import { useAuth } from "../../../../identity/api";

import { NotificationsPage } from "../NotificationsPage";

export function SettingsNotificationsRouteScreen() {
  const { state: authState } = useAuth();
  const recipientId = authState.user?.id ?? "";

  return <NotificationsPage recipientId={recipientId} />;
}