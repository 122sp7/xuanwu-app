"use client";

import type { ActiveAccount } from "@/app/providers/app-context";
import { CreateWorkspaceDialogRail as WorkspaceCreateWorkspaceDialogRail } from "@/modules/workspace/api";

interface CreateWorkspaceDialogRailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeAccount: ActiveAccount | null;
  isOrganizationAccount: boolean;
  creatorUserId?: string | null;
  onNavigate: (href: string) => void;
}

export function CreateWorkspaceDialogRail({
  open,
  onOpenChange,
  activeAccount,
  isOrganizationAccount,
  creatorUserId,
  onNavigate,
}: CreateWorkspaceDialogRailProps) {
  return (
    <WorkspaceCreateWorkspaceDialogRail
      open={open}
      onOpenChange={onOpenChange}
      accountId={activeAccount?.id ?? null}
      accountType={activeAccount ? (isOrganizationAccount ? "organization" : "user") : null}
      creatorUserId={creatorUserId}
      onNavigate={onNavigate}
    />
  );
}
