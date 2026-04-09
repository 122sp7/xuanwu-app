"use client";

import type { WorkspaceEntity } from "../../../api/contracts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@ui-shadcn/ui/avatar";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent } from "@ui-shadcn/ui/card";

import {
  formatTimestamp,
  getWorkspaceInitials,
  lifecycleBadgeVariant,
} from "../layout/workspace-detail-helpers";
import { getWorkspaceGovernanceSummary } from "../../view-models/workspace-supporting-records";

interface WorkspaceOverviewSummaryCardProps {
  readonly workspace: WorkspaceEntity;
  readonly activeWorkspaceId: string | null | undefined;
  readonly onEditClick: () => void;
  readonly onSetActiveWorkspace: () => void;
}

export function WorkspaceOverviewSummaryCard({
  workspace,
  activeWorkspaceId,
  onEditClick,
  onSetActiveWorkspace,
}: WorkspaceOverviewSummaryCardProps) {
  const governanceSummary = getWorkspaceGovernanceSummary(workspace);

  return (
    <Card className="border border-border/50">
      <CardContent className="flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Avatar size="lg">
            <AvatarImage src={workspace.photoURL} alt={workspace.name} />
            <AvatarFallback>{getWorkspaceInitials(workspace.name)}</AvatarFallback>
          </Avatar>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-2xl font-semibold tracking-tight">{workspace.name}</p>
              <p className="text-sm text-muted-foreground">
                {workspace.accountType === "organization" ? "Organization" : "Personal"} workspace ·
                account {workspace.accountId}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={lifecycleBadgeVariant[workspace.lifecycleState]}>
                {workspace.lifecycleState}
              </Badge>
              <Badge variant="outline">{workspace.visibility}</Badge>
              <Badge variant="outline">Created {formatTimestamp(workspace.createdAt)}</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onEditClick}>
                編輯工作區
              </Button>
              {activeWorkspaceId !== workspace.id && (
                <Button type="button" variant="default" size="sm" onClick={onSetActiveWorkspace}>
                  設為目前工作區
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[20rem]">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Capabilities</p>
            <p className="mt-1 text-xl font-semibold">{governanceSummary.capabilityCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Teams</p>
            <p className="mt-1 text-xl font-semibold">{governanceSummary.teamCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Locations</p>
            <p className="mt-1 text-xl font-semibold">{governanceSummary.locationCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Grants</p>
            <p className="mt-1 text-xl font-semibold">{governanceSummary.grantCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}