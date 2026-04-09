"use client";

import type { WorkspaceEntity } from "@/modules/workspace/interfaces/api";
import { Badge } from "@ui-shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import { Separator } from "@ui-shadcn/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-shadcn/ui/tabs";
import { describeGrant } from "../workspace-settings";
import { WorkspaceOverviewSettingsTab } from "./WorkspaceOverviewSettingsTab";
import { WorkspaceOverviewSummaryCard } from "./WorkspaceOverviewSummaryCard";
import { WorkspaceProductSpineCard } from "./WorkspaceProductSpineCard";
import { WorkspaceQuickstartCard } from "./WorkspaceQuickstartCard";

interface WorkspaceOverviewTabProps {
  readonly workspace: WorkspaceEntity;
  readonly activeWorkspaceId: string | null | undefined;
  readonly personnelEntries: Array<{ label: string; value: string | undefined }>;
  readonly addressLines: string[];
  readonly showSettingsPanel?: boolean;
  readonly onEditClick: () => void;
  readonly onSetActiveWorkspace: () => void;
}

export function WorkspaceOverviewTab({
  workspace,
  activeWorkspaceId,
  personnelEntries,
  addressLines,
  showSettingsPanel = false,
  onEditClick,
  onSetActiveWorkspace,
}: WorkspaceOverviewTabProps) {
  if (showSettingsPanel) {
    return (
      <WorkspaceOverviewSettingsTab
        workspace={workspace}
        personnelEntries={personnelEntries}
        addressLines={addressLines}
        onEditClick={onEditClick}
      />
    );
  }

  return (
    <Tabs defaultValue="home" className="space-y-4">
      <div className="rounded-2xl border border-border/50 bg-card/70 p-3 shadow-sm">
        <TabsList
          variant="line"
          className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-border/60 bg-transparent p-0"
        >
          <TabsTrigger value="home" className="min-w-fit px-3 py-2">
            Home
          </TabsTrigger>
          <TabsTrigger value="governance" className="min-w-fit px-3 py-2">
            Governance
          </TabsTrigger>
          <TabsTrigger value="profile" className="min-w-fit px-3 py-2">
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-4 space-y-4">
          <WorkspaceOverviewSummaryCard
            workspace={workspace}
            activeWorkspaceId={activeWorkspaceId}
            onEditClick={onEditClick}
            onSetActiveWorkspace={onSetActiveWorkspace}
          />

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <WorkspaceProductSpineCard workspace={workspace} />

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
          </div>

          {workspace.lifecycleState === "preparatory" && workspace.capabilities.length === 0 && (
            <WorkspaceQuickstartCard workspaceId={workspace.id} />
          )}
        </TabsContent>

        <TabsContent value="governance" className="mt-4 space-y-4">
          <div className="grid gap-4 xl:grid-cols-2">
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
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-4 space-y-4">
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
        </TabsContent>

      </div>
    </Tabs>
  );
}
