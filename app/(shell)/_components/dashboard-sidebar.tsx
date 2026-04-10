"use client";

/**
 * Thin app-layer wrapper for DashboardSidebar.
 *
 * Reads the current user ID from auth context (app-layer concern) and injects it
 * into the module component as a prop. Business logic lives in the module.
 */

import { useAuth } from "@/app/providers/auth-provider";
import {
  DashboardSidebar as ModuleDashboardSidebar,
  type DashboardSidebarProps,
} from "@/modules/platform/api";

type AppDashboardSidebarProps = Omit<DashboardSidebarProps, "userId">;

export function DashboardSidebar(props: AppDashboardSidebarProps) {
  const { state: authState } = useAuth();
  return <ModuleDashboardSidebar {...props} userId={authState.user?.id ?? null} />;
}
