"use client";

import type { ActiveAccount } from "@/app/providers/app-context";
import { CreateWorkspaceDialogRail as WorkspaceCreateWorkspaceDialogRail } from "@/modules/workspace/interfaces/components/CreateWorkspaceDialogRail";

interface CreateWorkspaceDialogRailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeAccount: ActiveAccount | null;
  isOrganizationAccount: boolean;
  onNavigate: (href: string) => void;
}

export function CreateWorkspaceDialogRail({
  open,
  onOpenChange,
  activeAccount,
  isOrganizationAccount,
  onNavigate,
}: CreateWorkspaceDialogRailProps) {
  return (
    <WorkspaceCreateWorkspaceDialogRail
      open={open}
      onOpenChange={onOpenChange}
      accountId={activeAccount?.id ?? null}
      accountType={activeAccount ? (isOrganizationAccount ? "organization" : "user") : null}
      onNavigate={onNavigate}
    />
  );
}
