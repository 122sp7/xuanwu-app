"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { dismissMember, inviteMember, updateMemberRole, type OrganizationRole } from "@/modules/platform/api";
import type { WorkspaceEntity, WorkspaceMemberView } from "../../../contracts";
import { getWorkspaceMembers } from "../../../facades";
import { WorkspaceMemberCard } from "./WorkspaceMemberCard";
import { WorkspaceMemberInviteDialog } from "./WorkspaceMemberInviteDialog";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

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

  const loadMembers = useCallback(async () => {
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
  }, [workspace.id]);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

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
              <WorkspaceMemberCard
                key={member.id}
                member={member}
                canManage={workspace.accountType === "organization" && member.organizationRole !== "Owner"}
                pending={pendingMemberId === member.id}
                editableRoles={editableOrganizationRoles}
                onRoleChange={(role) => void handleRoleChange(member.id, role)}
                onRemove={() => void handleRemoveMember(member.id)}
              />
            ))}
          </div>
        )}
      </CardContent>

      <WorkspaceMemberInviteDialog
        open={inviteOpen}
        email={inviteEmail}
        role={inviteRole}
        submitting={inviteSubmitting}
        editableRoles={editableOrganizationRoles}
        onOpenChange={setInviteOpen}
        onEmailChange={setInviteEmail}
        onRoleChange={setInviteRole}
        onSubmit={() => void handleInviteMember()}
      />
    </Card>
  );
}
