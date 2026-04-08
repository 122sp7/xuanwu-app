"use client";

import { WorkspaceSidebarSection as ModuleWorkspaceSidebarSection } from "@/modules/workspace/interfaces/components/WorkspaceSidebarSection";

import type { SidebarLocaleBundle } from "./use-sidebar-locale";
import type { NavPreferences } from "./customize-navigation-dialog";
import { sidebarItemClass } from "./sidebar-nav-data";

// ── Tab link item shape ────────────────────────────────────────────────────────

// ── Props ─────────────────────────────────────────────────────────────────────

interface WorkspaceSidebarSectionProps {
  workspacePathId: string;
  navPrefs: NavPreferences;
  localeBundle: SidebarLocaleBundle | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WorkspaceSidebarSection({
  workspacePathId,
  navPrefs,
  localeBundle,
}: WorkspaceSidebarSectionProps) {
  return (
    <ModuleWorkspaceSidebarSection
      workspacePathId={workspacePathId}
      navPrefs={navPrefs}
      localeBundle={localeBundle}
      getItemClassName={sidebarItemClass}
    />
  );
}
