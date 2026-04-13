"use client";

import { useAuth } from "../../../../identity/api";

import { SettingsProfileRouteScreen } from "./SettingsProfileRouteScreen";

export function SettingsProfileAccountRouteScreen() {
  const { state: authState } = useAuth();

  return (
    <SettingsProfileRouteScreen
      actorId={authState.user?.id ?? null}
      fallbackDisplayName={authState.user?.name ?? ""}
    />
  );
}