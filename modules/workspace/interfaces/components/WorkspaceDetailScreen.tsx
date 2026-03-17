"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { WorkspaceEntity, WorkspaceGrant } from "@/modules/workspace";
import { formatDate } from "@/shared/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/shadcn/ui/avatar";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import { Separator } from "@/ui/shadcn/ui/separator";

import { getWorkspaceById } from "../queries/workspace.queries";

const lifecycleBadgeVariant: Record<
  WorkspaceEntity["lifecycleState"],
  "default" | "secondary" | "outline"
> = {
  active: "default",
  preparatory: "secondary",
  stopped: "outline",
};

function getWorkspaceInitials(name: string) {
  const tokens = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (tokens.length === 0) {
    return "WS";
  }

  return tokens.map((token) => token[0]?.toUpperCase() ?? "").join("");
}

function formatTimestamp(timestamp: WorkspaceEntity["createdAt"] | undefined) {
  if (!timestamp) {
    return "—";
  }

  try {
    return formatDate(timestamp.toDate());
  } catch {
    return "—";
  }
}

function describeGrant(grant: WorkspaceGrant) {
  if (grant.teamId) {
    return "Team grant";
  }

  if (grant.userId) {
    return "User grant";
  }

  return "Unscoped grant";
}

interface WorkspaceDetailScreenProps {
  readonly workspaceId: string;
  readonly accountId: string | null | undefined;
  readonly accountsHydrated: boolean;
}

export function WorkspaceDetailScreen({
  workspaceId,
  accountId,
  accountsHydrated,
}: WorkspaceDetailScreenProps) {
  const [workspace, setWorkspace] = useState<WorkspaceEntity | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadWorkspace() {
      if (!workspaceId) {
        setLoadState("error");
        return;
      }

      setLoadState("loading");
      try {
        const detail = await getWorkspaceById(workspaceId);
        if (cancelled) return;
        setWorkspace(detail);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspaceDetailScreen] Failed to load workspace:", error);
        }
        if (!cancelled) {
          setWorkspace(null);
          setLoadState("error");
        }
      }
    }

    void loadWorkspace();

    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  const accountMismatch = workspace && accountId && workspace.accountId !== accountId;
  const personnelEntries = useMemo(() => {
    if (!workspace?.personnel) {
      return [];
    }

    return [
      { label: "Manager", value: workspace.personnel.managerId },
      { label: "Supervisor", value: workspace.personnel.supervisorId },
      { label: "Safety officer", value: workspace.personnel.safetyOfficerId },
    ].filter((entry) => Boolean(entry.value));
  }, [workspace]);

  const addressLines = useMemo(() => {
    if (!workspace?.address) {
      return [];
    }

    const { street, city, state, postalCode, country, details } = workspace.address;

    return [
      street,
      [city, state, postalCode].filter(Boolean).join(", "),
      country,
      details,
    ].filter(Boolean);
  }, [workspace]);

  return (
    <div className="space-y-6">
      <Link href="/workspace" className="inline-flex text-sm font-medium text-primary hover:underline">
        ← 返回 Workspace Hub
      </Link>

      {!accountsHydrated && (
        <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
          正在同步帳號內容…
        </div>
      )}

      {loadState === "loading" && (
        <Card className="border border-border/50">
          <CardContent className="px-6 py-5 text-sm text-muted-foreground">
            Loading workspace detail…
          </CardContent>
        </Card>
      )}

      {loadState === "error" && (
        <Card className="border border-destructive/30">
          <CardContent className="px-6 py-5 text-sm text-destructive">
            無法載入工作區資料，請返回清單後重試。
          </CardContent>
        </Card>
      )}

      {loadState === "loaded" && !workspace && (
        <Card className="border border-border/50">
          <CardContent className="px-6 py-5 text-sm text-muted-foreground">
            找不到此工作區。
          </CardContent>
        </Card>
      )}

      {accountMismatch && (
        <Card className="border border-destructive/30">
          <CardContent className="px-6 py-5 text-sm text-destructive">
            此工作區不在目前帳號範圍內。
          </CardContent>
        </Card>
      )}

      {workspace && !accountMismatch && (
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
        </>
      )}
    </div>
  );
}
