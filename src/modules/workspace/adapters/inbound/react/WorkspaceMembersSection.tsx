"use client";

/**
 * WorkspaceMembersSection — workspace.members tab — team member list.
 */

import { Badge, Button } from "@packages";
import { Users, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createClientMembershipUseCases } from "../../outbound/firebase-composition";
import type { WorkspaceMemberSnapshot } from "../../../subdomains/membership/domain/entities/WorkspaceMember";
import {
  addMemberAction,
  changeMemberRoleAction,
} from "../server-actions/membership-actions";

interface WorkspaceMembersSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}

const ROLE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  owner: "default",
  admin: "secondary",
  member: "outline",
};
const membershipUseCases = createClientMembershipUseCases();

export function WorkspaceMembersSection({
  workspaceId,
  accountId: _accountId,
  currentUserId,
}: WorkspaceMembersSectionProps): React.ReactElement {
  const { listMembersByWorkspace } = membershipUseCases;
  const [roleFilter, setRoleFilter] = useState<string>("全部");
  const [members, setMembers] = useState<WorkspaceMemberSnapshot[]>([]);
  const [inviteDisplayName, setInviteDisplayName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"owner" | "admin" | "member">("member");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const operatorActorId = currentUserId;

  async function loadMembers(): Promise<void> {
    const result = await listMembersByWorkspace.execute(workspaceId);
    setMembers(result.filter((member) => member.status === "active"));
  }

  useEffect(() => {
    let active = true;
    void listMembersByWorkspace.execute(workspaceId).then((result) => {
      if (active) {
        setMembers(result.filter((member) => member.status === "active"));
      }
    }).catch(() => {
      if (active) setMembers([]);
    });
    return () => { active = false; };
  }, [listMembersByWorkspace, workspaceId]);

  const visibleMembers = useMemo(() => {
    if (roleFilter === "全部") return members;
    return members.filter((member) => member.role === roleFilter);
  }, [members, roleFilter]);

  async function handleInviteMember(): Promise<void> {
    if (!operatorActorId) {
      setActionError("尚未取得操作者身分，請重新登入後再試。");
      return;
    }
    const displayName = inviteDisplayName.trim();
    const email = inviteEmail.trim();
    if (!displayName || !email) {
      setActionError("請輸入姓名與 Email。");
      return;
    }
    setIsSubmitting(true);
    setActionError(null);
    // TODO(workspace-membership): replace this fallback with IAM directory lookup (email -> actorId).
    // Temporary mapping: use normalized email as target actor identity.
    const targetActorIdFromEmail = email.toLowerCase();
    const result = await addMemberAction({
      actorId: operatorActorId,
      workspaceId,
      targetActorId: targetActorIdFromEmail,
      role: "member",
      displayName,
      email,
    });
    if (!result.success) {
      setActionError(result.error.message);
      setIsSubmitting(false);
      return;
    }
    if (inviteRole !== "member") {
      const roleResult = await changeMemberRoleAction({
        actorId: operatorActorId,
        memberId: result.aggregateId,
        role: inviteRole,
      });
      if (!roleResult.success) {
        setActionError(roleResult.error.message);
        setIsSubmitting(false);
        return;
      }
    }
    setInviteDisplayName("");
    setInviteEmail("");
    setInviteRole("member");
    await loadMembers();
    setIsSubmitting(false);
  }

  async function handleRoleChange(memberId: string, nextRole: "owner" | "admin" | "member"): Promise<void> {
    if (!operatorActorId) {
      setActionError("尚未取得操作者身分，請重新登入後再試。");
      return;
    }
    setIsSubmitting(true);
    setActionError(null);
    const result = await changeMemberRoleAction({
      actorId: operatorActorId,
      memberId,
      role: nextRole,
    });
    if (!result.success) {
      setActionError(result.error.message);
      setIsSubmitting(false);
      return;
    }
    await loadMembers();
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">成員</h2>
        </div>
        <Badge variant="outline" className="text-xs">
          操作身分：{operatorActorId ?? "未登入"}
        </Badge>
      </div>

      <div className="space-y-2 rounded-xl border border-border/40 bg-card/20 p-3">
        <p className="text-xs font-medium text-muted-foreground">邀請成員</p>
        <div className="grid gap-2 sm:grid-cols-4">
          <input
            value={inviteDisplayName}
            onChange={(event) => setInviteDisplayName(event.target.value)}
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
            placeholder="姓名"
            disabled={isSubmitting}
          />
          <input
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            className="h-9 rounded-md border border-border bg-background px-2 text-sm sm:col-span-2"
            placeholder="email@example.com"
            disabled={isSubmitting}
          />
          <select
            value={inviteRole}
            onChange={(event) => setInviteRole(event.target.value as "owner" | "admin" | "member")}
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
            disabled={isSubmitting}
          >
            {(["owner", "admin", "member"] as const).map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <Button size="sm" variant="outline" onClick={() => void handleInviteMember()} disabled={isSubmitting}>
          <UserPlus className="size-3.5" />
          {isSubmitting ? "處理中…" : "邀請成員"}
        </Button>
      </div>

      {actionError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {actionError}
        </p>
      )}

      {/* Role filter */}
      <div className="flex flex-wrap gap-2">
        {(["全部", "owner", "admin", "member"] as const).map((role, i) => (
          <Badge
            key={role}
            variant={ROLE_VARIANT[role as keyof typeof ROLE_VARIANT] ?? (i === 0 ? "default" : "outline")}
            className="cursor-pointer text-xs capitalize"
            onClick={() => setRoleFilter(role)}
          >
            {role === "全部" ? "全部" : role}
          </Badge>
        ))}
      </div>

      {visibleMembers.length > 0 ? (
        <div className="space-y-2 rounded-xl border border-border/40 bg-card/20 p-2">
          {visibleMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border border-border/30 bg-card/40 px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium">{member.displayName}</p>
                <p className="text-xs text-muted-foreground">{member.email ?? member.actorId}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={ROLE_VARIANT[member.role] ?? "outline"} className="capitalize">{member.role}</Badge>
                <select
                  value={member.role}
                  onChange={(event) =>
                    void handleRoleChange(member.id, event.target.value as "owner" | "admin" | "member")
                  }
                  className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                  disabled={isSubmitting || member.role === "owner"}
                >
                  {(["owner", "admin", "member"] as const).map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
          <Users className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">尚未邀請任何成員</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            邀請團隊成員加入此工作區，共同協作任務與知識文件。
          </p>
          <Button size="sm" variant="outline" className="mt-4" onClick={() => void handleInviteMember()} disabled={isSubmitting}>
            <UserPlus className="size-3.5" />
            邀請成員
          </Button>
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
