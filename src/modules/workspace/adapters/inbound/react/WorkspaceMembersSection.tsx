"use client";

/**
 * WorkspaceMembersSection — workspace.members tab — team member list.
 */

import { Badge, Button } from "@packages";
import { Users, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createClientMembershipUseCases } from "../../outbound/firebase-composition";
import type { WorkspaceMemberSnapshot } from "../../../subdomains/membership/domain/entities/WorkspaceMember";

interface WorkspaceMembersSectionProps {
  workspaceId: string;
  accountId: string;
}

const ROLE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  owner: "default",
  admin: "secondary",
  member: "outline",
};

export function WorkspaceMembersSection({
  workspaceId,
  accountId: _accountId,
}: WorkspaceMembersSectionProps): React.ReactElement {
  const { listMembersByWorkspace } = useMemo(() => createClientMembershipUseCases(), []);
  const [roleFilter, setRoleFilter] = useState<string>("全部");
  const [members, setMembers] = useState<WorkspaceMemberSnapshot[]>([]);

  useEffect(() => {
    let active = true;
    void listMembersByWorkspace(workspaceId).then((result) => {
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">成員</h2>
        </div>
        <Button size="sm" variant="outline" disabled>
          <UserPlus className="size-3.5" />
          邀請成員
        </Button>
      </div>

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
              <Badge variant={ROLE_VARIANT[member.role] ?? "outline"} className="capitalize">{member.role}</Badge>
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
          <Button size="sm" variant="outline" className="mt-4" disabled>
            <UserPlus className="size-3.5" />
            邀請成員
          </Button>
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
