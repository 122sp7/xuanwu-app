"use client";

import type { WorkspaceMemberView } from "../../../contracts";
import type { OrganizationRole } from "@/modules/platform/api";
import { Avatar, AvatarFallback } from "@ui-shadcn/ui/avatar";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";

function getMemberInitials(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "??";
  return trimmed.split(/\s+/).slice(0, 2).map((token) => token[0]?.toUpperCase() ?? "").join("");
}

function getAccessChannelKey(memberId: string, channel: WorkspaceMemberView["accessChannels"][number], index: number) {
  return [memberId, channel.source, channel.label, channel.role ?? "", channel.protocol ?? "", channel.teamId ?? "", String(index)].join("::");
}

const presenceLabelMap = { active: "Active", away: "Away", offline: "Offline", unknown: "Unknown" } as const;
const sourceLabelMap = { owner: "Owner", direct: "Direct", team: "Team", personnel: "Personnel" } as const;

interface WorkspaceMemberCardProps {
  readonly member: WorkspaceMemberView;
  readonly canManage: boolean;
  readonly pending: boolean;
  readonly editableRoles: readonly OrganizationRole[];
  readonly onRoleChange: (role: OrganizationRole) => void;
  readonly onRemove: () => void;
}

export function WorkspaceMemberCard({
  member,
  canManage,
  pending,
  editableRoles,
  onRoleChange,
  onRemove,
}: WorkspaceMemberCardProps) {
  return (
    <div className="rounded-xl border border-border/40 px-4 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>{getMemberInitials(member.displayName)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{member.displayName}</p>
              <Badge variant="outline">{presenceLabelMap[member.presence]}</Badge>
              {member.organizationRole ? <Badge variant="secondary">{member.organizationRole}</Badge> : null}
              {member.isExternal ? <Badge variant="outline">External</Badge> : null}
            </div>
            <p className="text-xs text-muted-foreground">{member.email ?? member.id}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canManage ? (
            <Select
              value={(member.organizationRole as OrganizationRole | undefined) ?? "Member"}
              onValueChange={(value) => onRoleChange(value as OrganizationRole)}
              disabled={pending}
            >
              <SelectTrigger className="h-8 w-[132px]">
                <SelectValue placeholder="角色" />
              </SelectTrigger>
              <SelectContent>
                {editableRoles.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}
              </SelectContent>
            </Select>
          ) : null}

          {canManage ? (
            <Button variant="outline" size="sm" disabled={pending} onClick={onRemove}>移除</Button>
          ) : null}

          {member.accessChannels.map((channel, index) => (
            <Badge key={getAccessChannelKey(member.id, channel, index)} variant="outline">
              {sourceLabelMap[channel.source]} · {channel.label}
              {channel.role ? ` · ${channel.role}` : ""}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
