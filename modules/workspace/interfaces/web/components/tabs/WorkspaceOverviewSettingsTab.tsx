"use client";

import type { WorkspaceEntity } from "../../../contracts";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";

import { WorkspaceInformationCard } from "../cards/WorkspaceInformationCard";
import { lifecycleBadgeVariant } from "../layout/workspace-detail-helpers";

interface WorkspaceOverviewSettingsTabProps {
  readonly workspace: WorkspaceEntity;
  readonly personnelEntries: Array<{ label: string; value: string | undefined }>;
  readonly addressLines: string[];
  readonly onEditClick: () => void;
}

export function WorkspaceOverviewSettingsTab({
  workspace,
  personnelEntries,
  addressLines,
  onEditClick,
}: WorkspaceOverviewSettingsTabProps) {
  return (
    <div className="space-y-4">
      <Card className="border border-border/50">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle>Workspace Settings</CardTitle>
            <CardDescription>
              檢視目前工作區設定，並從這裡進入編輯流程。
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onEditClick}>
            編輯工作區
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border/40 px-4 py-4">
            <p className="text-xs text-muted-foreground">Visibility</p>
            <div className="mt-2">
              <Badge variant="outline">{workspace.visibility}</Badge>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 px-4 py-4">
            <p className="text-xs text-muted-foreground">Lifecycle</p>
            <div className="mt-2">
              <Badge variant={lifecycleBadgeVariant[workspace.lifecycleState]}>
                {workspace.lifecycleState}
              </Badge>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 px-4 py-4">
            <p className="text-xs text-muted-foreground">Account Type</p>
            <p className="mt-2 text-sm font-medium text-foreground">
              {workspace.accountType === "organization" ? "Organization" : "Personal"}
            </p>
          </div>

          <div className="rounded-xl border border-border/40 px-4 py-4">
            <p className="text-xs text-muted-foreground">Account ID</p>
            <p className="mt-2 break-all text-sm font-medium text-foreground">{workspace.accountId}</p>
          </div>
        </CardContent>
      </Card>

      <WorkspaceInformationCard
        workspaceName={<p className="text-sm font-medium text-foreground">{workspace.name}</p>}
        workspaceAddress={
          addressLines.length > 0 ? (
            <div className="space-y-1.5 text-sm text-foreground">
              {addressLines.map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">尚未設定工作區地址。</p>
          )
        }
        workspaceRoles={personnelEntries.map((entry) => ({
          id: entry.label,
          roleName: <p className="text-sm font-medium text-foreground">{entry.label}</p>,
          roleValue: entry.value ? (
            <p className="break-all text-sm text-foreground">{entry.value}</p>
          ) : (
            <p className="text-sm text-muted-foreground">未設定</p>
          ),
        }))}
      />
    </div>
  );
}