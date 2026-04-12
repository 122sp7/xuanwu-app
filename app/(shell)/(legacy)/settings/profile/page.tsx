"use client";

import { SettingsProfileRouteScreen, useAuth } from "@/modules/platform/api";

export default function SettingsProfilePage() {
  const { state: authState } = useAuth();

  return (
    <SettingsProfileRouteScreen
      actorId={authState.user?.id ?? null}
      fallbackDisplayName={authState.user?.name ?? ""}
    />
  );
}
