"use client";

import Link from "next/link";
import type { WorkspaceEntity } from "@/modules/workspace/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@ui-shadcn/ui/avatar";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Separator } from "@ui-shadcn/ui/separator";
import { describeGrant } from "../../application/workspace-settings";
import {
  formatTimestamp,
  getWorkspaceInitials,
  lifecycleBadgeVariant,
} from "./workspace-detail-helpers";
import { WorkspaceProductSpineCard } from "./WorkspaceProductSpineCard";

interface WorkspaceOverviewTabProps {
  readonly workspace: WorkspaceEntity;
  readonly activeWorkspaceId: string | null | undefined;
  readonly personnelEntries: Array<{ label: string; value: string | undefined }>;
  readonly addressLines: string[];
  readonly onEditClick: () => void;
  readonly onSetActiveWorkspace: () => void;
}

export function WorkspaceOverviewTab({
  workspace,
  activeWorkspaceId,
  personnelEntries,
  addressLines,
  onEditClick,
  onSetActiveWorkspace,
}: WorkspaceOverviewTabProps) {
  return (
    <>
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
              <p className="mt-1 text-xl font-semibold">{workspace.capabilities.length}</p>
            </div>
            <div className="rounded-xl border border-border/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Teams</p>
              <p className="mt-1 text-xl font-semibold">{workspace.teamIds.length}</p>
            </div>
            <div className="rounded-xl border border-border/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Locations</p>
              <p className="mt-1 text-xl font-semibold">{workspace.locations?.length ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Grants</p>
              <p className="mt-1 text-xl font-semibold">{workspace.grants.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <WorkspaceProductSpineCard workspaceId={workspace.id} />

        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Capabilities</CardTitle>
            <CardDescription>
              Runtime features currently mounted on this workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {workspace.capabilities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No capability bindings have been added yet.
              </p>
            ) : (
              workspace.capabilities.map((capability) => (
                <div
                  key={capability.id}
                  className="rounded-xl border border-border/40 px-4 py-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {capability.name}
                    </p>
                    <Badge variant="outline">{capability.type}</Badge>
                    <Badge
                      variant={capability.status === "stable" ? "secondary" : "outline"}
                    >
                      {capability.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {capability.description}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Access Model</CardTitle>
            <CardDescription>
              Team scopes and direct grants applied to this workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Team access</p>
              {workspace.teamIds.length === 0 ? (
                <p className="text-sm text-muted-foreground">No team access assigned.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {workspace.teamIds.map((teamId) => (
                    <Badge key={teamId} variant="secondary">
                      {teamId}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Direct grants</p>
              {workspace.grants.length === 0 ? (
                <p className="text-sm text-muted-foreground">No direct grants recorded.</p>
              ) : (
                workspace.grants.map((grant, index) => (
                  <div
                    key={`grant-${grant.role}-${grant.teamId ?? "none"}-${grant.userId ?? "none"}-${grant.protocol ?? "none"}-${index}`}
                    className="rounded-xl border border-border/40 px-4 py-3"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {describeGrant(grant)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Role: {grant.role}
                      {grant.teamId ? ` · Team: ${grant.teamId}` : ""}
                      {grant.userId ? ` · User: ${grant.userId}` : ""}
                      {grant.protocol ? ` · Protocol: ${grant.protocol}` : ""}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Locations</CardTitle>
            <CardDescription>
              Physical or logical locations linked to the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {workspace.locations == null || workspace.locations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No locations have been configured yet.
              </p>
            ) : (
              workspace.locations.map((location) => (
                <div
                  key={location.locationId}
                  className="rounded-xl border border-border/40 px-4 py-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {location.label}
                    </p>
                    <Badge variant="outline">{location.locationId}</Badge>
                  </div>
                  {location.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {location.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    Capacity: {location.capacity ?? "—"}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Workspace Profile</CardTitle>
            <CardDescription>
              Operational contacts and registered workspace address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Personnel</p>
              {personnelEntries.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No personnel roles assigned.
                </p>
              ) : (
                personnelEntries.map((entry) => (
                  <div
                    key={entry.label}
                    className="flex items-center justify-between rounded-xl border border-border/40 px-4 py-3 text-sm"
                  >
                    <span className="text-muted-foreground">{entry.label}</span>
                    <span className="font-medium text-foreground">{entry.value}</span>
                  </div>
                ))
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Address</p>
              {addressLines.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No address information has been provided.
                </p>
              ) : (
                <div className="rounded-xl border border-border/40 px-4 py-4 text-sm text-muted-foreground">
                  {addressLines.map((line, index) => (
                    <p key={`${line}-${index}`}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {workspace.lifecycleState === "preparatory" && workspace.capabilities.length === 0 && (
        <Card className="border border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>🚀 開始使用這個工作區</CardTitle>
            <CardDescription>完成以下步驟，讓工作區進入運作狀態。</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold">Step 1 · 上傳文件</p>
              <p className="mt-1 text-xs text-muted-foreground">
                先把原始文件上傳到 Files 分頁，作為知識基底。
              </p>
              <Button asChild size="sm" variant="outline" className="mt-3">
                <Link href={`/workspace/${workspace.id}?tab=Files`}>前往 Files</Link>
              </Button>
            </div>
            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold">Step 2 · 建立頁面</p>
              <p className="mt-1 text-xs text-muted-foreground">
                在 Wiki 分頁建立第一個知識頁面，整理結構。
              </p>
              <Button asChild size="sm" variant="outline" className="mt-3">
                <Link href={`/workspace/${workspace.id}?tab=Wiki`}>前往 Wiki</Link>
              </Button>
            </div>
            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold">Step 3 · AI 查詢</p>
              <p className="mt-1 text-xs text-muted-foreground">
                用 RAG Query 對工作區知識提問，驗證內容可被檢索。
              </p>
              <Button asChild size="sm" variant="outline" className="mt-3">
                <Link href={`/notebook/rag-query?workspaceId=${encodeURIComponent(workspace.id)}`}>
                  前往 RAG Query
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
