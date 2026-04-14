"use client";

import { useEffect, useMemo, useState } from "react";

import { dismissMember, inviteMember, updateMemberRole, type OrganizationRole } from "@/modules/platform/api";
import type { WorkspaceEntity, WorkspaceMemberView } from "../../../contracts";
import { Avatar, AvatarFallback } from "@ui-shadcn/ui/avatar";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui-shadcn/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";
import { getWorkspaceMembers } from "../../../facades";

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

const editableOrganizationRoles: readonly OrganizationRole[] = ["Admin", "Member", "Guest"];

interface WorkspaceMembersTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceMembersTab({ workspace }: WorkspaceMembersTabProps) {
  const [members, setMembers] = useState<WorkspaceMemberView[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrganizationRole>("Member");
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingMemberId, setPendingMemberId] = useState<string | null>(null);

  async function loadMembers() {
    setLoadState("loading");

    try {
      const nextMembers = await getWorkspaceMembers(workspace.id);
      setMembers(nextMembers);
      setLoadState("loaded");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[WorkspaceMembersTab] Failed to load members:", error);
      }

      setMembers([]);
      setLoadState("error");
    }
  }

  useEffect(() => {
    void loadMembers();
  }, [workspace.id]);

  async function handleInviteMember() {
    if (workspace.accountType !== "organization" || !inviteEmail.trim()) {
      return;
    }

    setInviteSubmitting(true);
    setActionError(null);

    try {
      const result = await inviteMember({
        organizationId: workspace.accountId,
        email: inviteEmail.trim(),
        teamId: "",
        role: inviteRole,
        protocol: "email",
      });

      if (!result.success) {
        setActionError(result.error.message ?? "邀請成員失敗");
        return;
      }

      setInviteOpen(false);
      setInviteEmail("");
      setInviteRole("Member");
      await loadMembers();
    } finally {
      setInviteSubmitting(false);
    }
  }

  async function handleRoleChange(memberId: string, role: OrganizationRole) {
    if (workspace.accountType !== "organization") {
      return;
    }

    setPendingMemberId(memberId);
    setActionError(null);

    try {
      const result = await updateMemberRole({
        organizationId: workspace.accountId,
        memberId,
        role,
      });

      if (!result.success) {
        setActionError(result.error.message ?? "更新角色失敗");
        return;
      }

      await loadMembers();
    } finally {
      setPendingMemberId(null);
    }
  }

  async function handleRemoveMember(memberId: string) {
    if (workspace.accountType !== "organization") {
      return;
    }

    const confirmed = window.confirm("確定要移除此成員嗎？");
    if (!confirmed) {
      return;
    }

    setPendingMemberId(memberId);
    setActionError(null);

    try {
      const result = await dismissMember(workspace.accountId, memberId);
      if (!result.success) {
        setActionError(result.error.message ?? "移除成員失敗");
        return;
      }

      await loadMembers();
    } finally {
      setPendingMemberId(null);
    }
  }

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              {workspace.accountType === "organization"
                ? "組織成員與工作區授權來源的整合檢視，可直接發起邀請與角色調整。"
                : "個人工作區目前的共享與聯絡角色摘要。"}
            </CardDescription>
          </div>
          {workspace.accountType === "organization" ? (
            <Button onClick={() => setInviteOpen(true)}>邀請成員</Button>
          ) : null}
        </div>
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

        {actionError ? (
          <p className="text-sm text-destructive">{actionError}</p>
        ) : null}

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

                  <div className="flex flex-wrap items-center gap-2">
                    {workspace.accountType === "organization" && member.organizationRole !== "Owner" ? (
                      <Select
                        value={(member.organizationRole as OrganizationRole | undefined) ?? "Member"}
                        onValueChange={(value) => void handleRoleChange(member.id, value as OrganizationRole)}
                        disabled={pendingMemberId === member.id}
                      >
                        <SelectTrigger className="h-8 w-[132px]">
                          <SelectValue placeholder="角色" />
                        </SelectTrigger>
                        <SelectContent>
                          {editableOrganizationRoles.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : null}

                    {workspace.accountType === "organization" && member.organizationRole !== "Owner" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pendingMemberId === member.id}
                        onClick={() => void handleRemoveMember(member.id)}
                      >
                        移除
                      </Button>
                    ) : null}

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

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>邀請成員</DialogTitle>
            <DialogDescription>輸入電子信箱以邀請新成員加入此工作區所屬組織。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="workspace-invite-email">電子信箱</Label>
              <Input
                id="workspace-invite-email"
                type="email"
                placeholder="member@example.com"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="workspace-invite-role">角色</Label>
              <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as OrganizationRole)}>
                <SelectTrigger id="workspace-invite-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {editableOrganizationRoles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              取消
            </Button>
            <Button onClick={() => void handleInviteMember()} disabled={inviteSubmitting || !inviteEmail.trim()}>
              {inviteSubmitting ? "邀請中…" : "送出邀請"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
