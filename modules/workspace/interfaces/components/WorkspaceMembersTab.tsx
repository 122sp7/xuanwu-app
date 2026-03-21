"use client";

import { useEffect, useMemo, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import type { WorkspaceMemberView } from "../../domain/entities/WorkspaceMember";
import { Avatar, AvatarFallback } from '@ui-shadcn';
import { Badge } from '@ui-shadcn';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui-shadcn';
import { getWorkspaceMembers } from "../queries/workspace-member.queries";

function getMemberInitials(name: string) {
  const trimmed = name.trim();
  if (!trimmed) {
    return "??";
  }

  const tokens = trimmed.split(/\s+/).slice(0, 2);
  return tokens.map((token) => token[0]?.toUpperCase() ?? "").join("");
}

function getAccessChannelKey(memberId: string, channel: WorkspaceMemberView["accessChannels"][number], index: number) {
  return [
    memberId,
    channel.source,
    channel.label,
    channel.role ?? "",
    channel.protocol ?? "",
    channel.teamId ?? "",
    String(index),
  ].join("::");
}

const presenceLabelMap = {
  active: "Active",
  away: "Away",
  offline: "Offline",
  unknown: "Unknown",
} as const;

const sourceLabelMap = {
  owner: "Owner",
  direct: "Direct",
  team: "Team",
  personnel: "Personnel",
} as const;

interface WorkspaceMembersTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceMembersTab({ workspace }: WorkspaceMembersTabProps) {
  const [members, setMembers] = useState<WorkspaceMemberView[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadMembers() {
      setLoadState("loading");

      try {
        const nextMembers = await getWorkspaceMembers(workspace.id);
        if (cancelled) {
          return;
        }

        setMembers(nextMembers);
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[WorkspaceMembersTab] Failed to load members:", error);
        }

        if (!cancelled) {
          setMembers([]);
          setLoadState("error");
        }
      }
    }

    void loadMembers();

    return () => {
      cancelled = true;
    };
  }, [workspace.id]);

  const directCount = useMemo(
    () =>
      members.filter((member) =>
        member.accessChannels.some((channel) => channel.source === "direct"),
      ).length,
    [members],
  );

  const teamCount = useMemo(
    () =>
      members.filter((member) =>
        member.accessChannels.some((channel) => channel.source === "team"),
      ).length,
    [members],
  );

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>
          {workspace.accountType === "organization"
            ? "組織成員與工作區授權來源的整合檢視。"
            : "個人工作區目前的共享與聯絡角色摘要。"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Visible members</p>
            <p className="mt-1 text-xl font-semibold">{members.length}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Direct access</p>
            <p className="mt-1 text-xl font-semibold">{directCount}</p>
          </div>
          <div className="rounded-xl border border-border/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">Team access</p>
            <p className="mt-1 text-xl font-semibold">{teamCount}</p>
          </div>
        </div>

        {loadState === "loading" && (
          <p className="text-sm text-muted-foreground">Loading workspace members…</p>
        )}

        {loadState === "error" && (
          <p className="text-sm text-destructive">
            無法載入成員資料，請重新整理頁面或稍後再試。
          </p>
        )}

        {loadState === "loaded" && members.length === 0 && (
          <p className="text-sm text-muted-foreground">
            目前尚未整理出任何工作區成員或授權來源，之後可在這裡持續擴充成員維護流程。
          </p>
        )}

        {loadState === "loaded" && members.length > 0 && (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="rounded-xl border border-border/40 px-4 py-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>{getMemberInitials(member.displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {member.displayName}
                        </p>
                        <Badge variant="outline">{presenceLabelMap[member.presence]}</Badge>
                        {member.organizationRole && (
                          <Badge variant="secondary">{member.organizationRole}</Badge>
                        )}
                        {member.isExternal && <Badge variant="outline">External</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {member.email ?? member.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {member.accessChannels.map((channel, index) => (
                      <Badge
                        key={getAccessChannelKey(member.id, channel, index)}
                        variant="outline"
                      >
                        {sourceLabelMap[channel.source]} · {channel.label}
                        {channel.role ? ` · ${channel.role}` : ""}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
