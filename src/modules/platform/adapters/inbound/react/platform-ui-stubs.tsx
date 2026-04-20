"use client";

/**
 * platform-ui-stubs — platform inbound adapter (React).
 *
 * Remaining stubs for platform UI elements not yet implemented as real
 * components.  Items that have been promoted to real implementations are
 * re-exported from their canonical files below.
 *
 * Account / organization route screens are owned here because they belong to
 * the platform bounded context (account lifecycle, org management) rather than
 * to the workspace bounded context.
 */

import { Badge, Button } from "@packages";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  BellOff,
  BriefcaseBusiness,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Filter,
  FolderOpen,
  LayoutDashboard,
  Lock,
  Play,
  Plus,
  Settings2,
  Shield,
  Users,
  UserPlus,
  Zap,
} from "lucide-react";

// ── Shell theme toggle + language switcher ────────────────────────────────────
// Imported locally so they can be composed in ShellHeaderControls below,
// then re-exported so callers that want direct access can import from here.

import { ShellThemeToggle } from "./shell/ShellThemeToggle";
import { ShellLanguageSwitcher } from "./shell/ShellLanguageSwitcher";
import {
  createOrganizationTeam,
  recruitOrganizationMember,
  listOrganizationMembers,
  listOrganizationTeams,
  updateOrganizationMemberRole,
} from "../../../../iam/adapters/outbound/firebase-composition";
import { useAccountRouteContext } from "./useAccountRouteContext";

// ── Real implementations (promoted from stubs) ────────────────────────────────

export { ShellGuard } from "./shell/ShellGuard";
export { ShellUserAvatar } from "./shell/ShellUserAvatar";
export { AccountSwitcher } from "./shell/AccountSwitcher";
export { CreateOrganizationDialog } from "./shell/CreateOrganizationDialog";
export { ShellThemeToggle, ShellLanguageSwitcher };

// ── Account route context ─────────────────────────────────────────────────────

export { useAccountRouteContext };
export type { AccountRouteContextValue } from "./useAccountRouteContext";

// ── Shell breadcrumbs ─────────────────────────────────────────────────────────

export function ShellAppBreadcrumbs(): null {
  return null;
}

// ── Shell header controls (theme toggle + language switcher) ──────────────────

export function ShellHeaderControls(): React.ReactElement {
  return (
    <div className="flex items-center gap-1">
      <ShellLanguageSwitcher />
      <ShellThemeToggle />
    </div>
  ) as React.ReactElement;
}

// ── Global search ─────────────────────────────────────────────────────────────

interface ShellGlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShellGlobalSearchDialog(
  _props: ShellGlobalSearchDialogProps,
): null {
  return null;
}

export function useShellGlobalSearch(): {
  open: boolean;
  setOpen: (open: boolean) => void;
} {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}

// ── Route screens ─────────────────────────────────────────────────────────────

// ── AccountDashboardRouteScreen ───────────────────────────────────────────────

export function AccountDashboardRouteScreen(): React.ReactElement {
  const today = new Date().toLocaleDateString("zh-Hant-TW", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="size-5 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">儀表板</h1>
        </div>
        <Badge variant="outline" className="text-xs">{today}</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "工作區", value: "0", icon: <FolderOpen className="size-3.5 text-primary" /> },
          { label: "今日任務", value: "0", icon: <Circle className="size-3.5 text-muted-foreground" /> },
          { label: "進行中", value: "0", icon: <Clock className="size-3.5 text-amber-500" /> },
          { label: "已完成", value: "0", icon: <CheckCircle2 className="size-3.5 text-emerald-500" /> },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1.5 rounded-xl border border-border/40 bg-card/60 px-3 py-3"
          >
            <div className="flex items-center gap-1.5">
              {stat.icon}
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div>
        <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">最近動態</p>
        <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
          <Activity className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">尚無動態記錄</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            建立工作區並開始工作後，最近動態將顯示於此。
          </p>
        </div>
      </div>
    </div>
  ) as React.ReactElement;
}

// ── OrganizationOverviewRouteScreen ──────────────────────────────────────────

export function OrganizationOverviewRouteScreen(): React.ReactElement {
  const navLinks = [
    { label: "成員", description: "管理組織成員與角色", icon: <Users className="size-4 text-muted-foreground" />, path: "members" },
    { label: "團隊", description: "管理功能性團隊分組", icon: <BriefcaseBusiness className="size-4 text-muted-foreground" />, path: "teams" },
    { label: "工作區", description: "查看組織下的所有工作區", icon: <FolderOpen className="size-4 text-muted-foreground" />, path: "workspaces" },
    { label: "權限", description: "設定角色與存取控制", icon: <Lock className="size-4 text-muted-foreground" />, path: "permissions" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield className="size-5 text-primary" />
        <h1 className="text-xl font-semibold tracking-tight">組織治理</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "成員", value: "0" },
          { label: "團隊", value: "0" },
          { label: "工作區", value: "0" },
          { label: "待處理", value: "0" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1.5 rounded-xl border border-border/40 bg-card/60 px-3 py-3"
          >
            <span className="text-xs text-muted-foreground">{stat.label}</span>
            <p className="text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div>
        <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">管理功能</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/30 px-4 py-3 transition hover:bg-muted/40 cursor-pointer"
            >
              {link.icon}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-xs text-muted-foreground truncate">{link.description}</p>
              </div>
              <ChevronRight className="size-3.5 text-muted-foreground/50 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ) as React.ReactElement;
}

// ── OrganizationMembersRouteScreen ────────────────────────────────────────────

export function OrganizationMembersRouteScreen(): React.ReactElement {
  const { resolvedAccountId, accountType } = useAccountRouteContext();
  const [roleFilter, setRoleFilter] = useState<string>("全部");
  const roles = ["全部", "owner", "admin", "member"] as const;
  const [members, setMembers] = useState<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    presence: string;
  }>>([]);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Owner" | "Admin" | "Member">("Member");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadMembers(organizationId: string): Promise<void> {
    const result = await listOrganizationMembers(organizationId);
    setMembers(result);
  }

  useEffect(() => {
    let active = true;
    if (accountType !== "organization" || !resolvedAccountId) {
      return () => { active = false; };
    }
    void listOrganizationMembers(resolvedAccountId).then((result) => {
      if (!active) return;
      setMembers(result);
    }).catch(() => {
      if (active) setMembers([]);
    });
    return () => { active = false; };
  }, [accountType, resolvedAccountId]);

  const visibleMembers = useMemo(() => {
    if (accountType !== "organization" || !resolvedAccountId) return [];
    if (roleFilter === "全部") return members;
    return members.filter((member) => member.role.toLowerCase() === roleFilter);
  }, [accountType, members, resolvedAccountId, roleFilter]);

  async function handleInviteMember(): Promise<void> {
    if (!resolvedAccountId || accountType !== "organization") return;
    const name = inviteName.trim();
    const email = inviteEmail.trim().toLowerCase();
    if (!name || !email) {
      setActionError("請輸入姓名與 Email。");
      return;
    }
    setActionError(null);
    setIsSubmitting(true);
    // Temporary mapping: email is used as member identity key until IAM directory lookup is available.
    const memberIdFromEmail = email;
    const recruitResult = await recruitOrganizationMember(resolvedAccountId, memberIdFromEmail, name, email);
    if (!recruitResult.success) {
      setActionError(recruitResult.error.message);
      setIsSubmitting(false);
      return;
    }
    if (inviteRole !== "Member") {
      const roleResult = await updateOrganizationMemberRole({
        organizationId: resolvedAccountId,
        memberId: memberIdFromEmail,
        role: inviteRole,
      });
      if (!roleResult.success) {
        setActionError(roleResult.error.message);
        setIsSubmitting(false);
        return;
      }
    }
    await loadMembers(resolvedAccountId);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("Member");
    setIsSubmitting(false);
  }

  async function handleMemberRoleChange(memberId: string, role: "Owner" | "Admin" | "Member"): Promise<void> {
    if (!resolvedAccountId || accountType !== "organization") return;
    setActionError(null);
    setIsSubmitting(true);
    const result = await updateOrganizationMemberRole({
      organizationId: resolvedAccountId,
      memberId,
      role,
    });
    if (!result.success) {
      setActionError(result.error.message);
      setIsSubmitting(false);
      return;
    }
    await loadMembers(resolvedAccountId);
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">成員</h1>
        </div>
        <Badge variant="outline" className="text-xs">組織管理</Badge>
      </div>

      <div className="space-y-2 rounded-xl border border-border/40 bg-card/20 p-3">
        <p className="text-xs font-medium text-muted-foreground">邀請成員</p>
        <div className="grid gap-2 sm:grid-cols-4">
          <input
            value={inviteName}
            onChange={(event) => setInviteName(event.target.value)}
            placeholder="姓名"
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
            disabled={isSubmitting}
          />
          <input
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            placeholder="email@example.com"
            className="h-9 rounded-md border border-border bg-background px-2 text-sm sm:col-span-2"
            disabled={isSubmitting}
          />
          <select
            value={inviteRole}
            onChange={(event) => setInviteRole(event.target.value as "Owner" | "Admin" | "Member")}
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
            disabled={isSubmitting}
          >
            <option value="Owner">Owner</option>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
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
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition capitalize ${
              roleFilter === role
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:bg-muted/60"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {visibleMembers.length > 0 ? (
        <div className="space-y-2 rounded-xl border border-border/40 bg-card/20 p-2">
          {visibleMembers.map((member) => {
            const role = member.role.toLowerCase();
            const badgeVariant = role === "owner" ? "default" : role === "admin" ? "secondary" : "outline";
            return (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-border/30 bg-card/40 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={badgeVariant} className="capitalize">{role}</Badge>
                  <select
                    value={member.role}
                    onChange={(event) =>
                      void handleMemberRoleChange(
                        member.id,
                        event.target.value as "Owner" | "Admin" | "Member",
                      )
                    }
                    className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                    disabled={isSubmitting || member.role === "Owner"}
                  >
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
          <Users className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">尚無組織成員</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            邀請成員加入組織後，可指派角色並管理存取範圍。
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

// ── OrganizationTeamsRouteScreen ──────────────────────────────────────────────

export function OrganizationTeamsRouteScreen(): React.ReactElement {
  const { resolvedAccountId, accountType } = useAccountRouteContext();
  const [teams, setTeams] = useState<Array<{
    id: string;
    name: string;
    description: string;
    type: "internal" | "external";
    memberIds: string[];
  }>>([]);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamType, setTeamType] = useState<"internal" | "external">("internal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function loadTeams(organizationId: string): Promise<void> {
    const result = await listOrganizationTeams(organizationId);
    setTeams(result);
  }

  useEffect(() => {
    let active = true;
    if (accountType !== "organization" || !resolvedAccountId) {
      return () => { active = false; };
    }
    void listOrganizationTeams(resolvedAccountId).then((result) => {
      if (!active) return;
      setTeams(result);
    }).catch(() => {
      if (active) setTeams([]);
    });
    return () => { active = false; };
  }, [accountType, resolvedAccountId]);

  async function handleCreateTeam(): Promise<void> {
    if (!resolvedAccountId || accountType !== "organization") return;
    const name = teamName.trim();
    if (!name) {
      setCreateError("請輸入團隊名稱。");
      return;
    }
    setCreateError(null);
    setIsSubmitting(true);
    const result = await createOrganizationTeam({
      organizationId: resolvedAccountId,
      name,
      description: teamDescription.trim(),
      type: teamType,
    });
    if (!result.success) {
      setCreateError(result.error.message);
      setIsSubmitting(false);
      return;
    }
    await loadTeams(resolvedAccountId);
    setTeamName("");
    setTeamDescription("");
    setTeamType("internal");
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="size-4 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">團隊</h1>
        </div>
        <Button size="sm" variant="outline" onClick={() => void handleCreateTeam()} disabled={isSubmitting}>
          <Plus className="size-3.5" />
          {isSubmitting ? "建立中…" : "建立團隊"}
        </Button>
      </div>

      <div className="space-y-2 rounded-xl border border-border/40 bg-card/20 p-3">
        <p className="text-xs font-medium text-muted-foreground">新增團隊</p>
        <div className="grid gap-2 sm:grid-cols-4">
          <input
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
            placeholder="團隊名稱"
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
            disabled={isSubmitting}
          />
          <input
            value={teamDescription}
            onChange={(event) => setTeamDescription(event.target.value)}
            placeholder="描述（可選）"
            className="h-9 rounded-md border border-border bg-background px-2 text-sm sm:col-span-2"
            disabled={isSubmitting}
          />
          <select
            value={teamType}
            onChange={(event) => setTeamType(event.target.value as "internal" | "external")}
            className="h-9 rounded-md border border-border bg-background px-2 text-sm"
            disabled={isSubmitting}
          >
            <option value="internal">內部</option>
            <option value="external">外部</option>
          </select>
        </div>
      </div>

      {createError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {createError}
        </p>
      )}

      {teams.length > 0 ? (
        <div className="space-y-2 rounded-xl border border-border/40 bg-card/20 p-2">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between rounded-lg border border-border/30 bg-card/40 px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium">{team.name}</p>
                <p className="text-xs text-muted-foreground">
                  {team.description || "尚無描述"}
                </p>
              </div>
              <Badge variant={team.type === "internal" ? "secondary" : "outline"}>
                {team.type === "internal" ? "內部" : "外部"} · {team.memberIds.length}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
          <BriefcaseBusiness className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">尚無團隊</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            建立功能性團隊（如工程、設計、業務），便於按團隊指派工作區與任務。
          </p>
          <Button size="sm" variant="outline" className="mt-4" onClick={() => void handleCreateTeam()} disabled={isSubmitting}>
            <Plus className="size-3.5" />
            建立第一個團隊
          </Button>
        </div>
      )}
    </div>
  ) as React.ReactElement;
}

// ── OrganizationPermissionsRouteScreen ────────────────────────────────────────

const PERMISSION_MATRIX = [
  { resource: "工作區", owner: true, admin: true, member: false },
  { resource: "成員管理", owner: true, admin: true, member: false },
  { resource: "團隊管理", owner: true, admin: true, member: false },
  { resource: "任務建立", owner: true, admin: true, member: true },
  { resource: "任務查看", owner: true, admin: true, member: true },
  { resource: "知識庫", owner: true, admin: true, member: true },
  { resource: "設定修改", owner: true, admin: false, member: false },
  { resource: "帳單管理", owner: true, admin: false, member: false },
] as const;

export function OrganizationPermissionsRouteScreen(): React.ReactElement {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="size-4 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">權限</h1>
        </div>
        <Badge variant="outline" className="text-xs">角色型存取控制</Badge>
      </div>

      {/* Role descriptions */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { role: "owner", label: "擁有者", description: "完整管理權，包含帳單與設定", color: "text-amber-600 border-amber-500/30 bg-amber-500/10" },
          { role: "admin", label: "管理員", description: "成員管理、工作區與任務全權操作", color: "text-blue-600 border-blue-500/30 bg-blue-500/10" },
          { role: "member", label: "成員", description: "查看與執行已指派的任務", color: "text-emerald-600 border-emerald-500/30 bg-emerald-500/10" },
        ].map((r) => (
          <div key={r.role} className={`rounded-xl border px-3 py-3 ${r.color}`}>
            <p className="text-sm font-semibold capitalize">{r.label}</p>
            <p className="mt-1 text-xs opacity-80">{r.description}</p>
          </div>
        ))}
      </div>

      {/* Permissions matrix */}
      <div className="rounded-xl border border-border/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-muted/40">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">資源</th>
              <th className="px-4 py-2.5 text-center text-xs font-medium text-amber-600">擁有者</th>
              <th className="px-4 py-2.5 text-center text-xs font-medium text-blue-600">管理員</th>
              <th className="px-4 py-2.5 text-center text-xs font-medium text-emerald-600">成員</th>
            </tr>
          </thead>
          <tbody>
            {PERMISSION_MATRIX.map((row, i) => (
              <tr key={row.resource} className={i % 2 === 0 ? "bg-card/20" : ""}>
                <td className="px-4 py-2.5 text-xs">{row.resource}</td>
                <td className="px-4 py-2.5 text-center">
                  {row.owner
                    ? <CheckCircle2 className="mx-auto size-3.5 text-emerald-500" />
                    : <Circle className="mx-auto size-3.5 text-muted-foreground/30" />
                  }
                </td>
                <td className="px-4 py-2.5 text-center">
                  {row.admin
                    ? <CheckCircle2 className="mx-auto size-3.5 text-emerald-500" />
                    : <Circle className="mx-auto size-3.5 text-muted-foreground/30" />
                  }
                </td>
                <td className="px-4 py-2.5 text-center">
                  {row.member
                    ? <CheckCircle2 className="mx-auto size-3.5 text-emerald-500" />
                    : <Circle className="mx-auto size-3.5 text-muted-foreground/30" />
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) as React.ReactElement;
}

// ── SettingsNotificationsRouteScreen ─────────────────────────────────────────

export function SettingsNotificationsRouteScreen(): React.ReactElement {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);

  const channels = [
    {
      key: "email" as const,
      label: "電子郵件通知",
      description: "任務更新、成員邀請與工作區動態",
      enabled: emailEnabled,
      toggle: () => setEmailEnabled((v) => !v),
      icon: <Bell className="size-4 text-primary" />,
    },
    {
      key: "push" as const,
      label: "推播通知",
      description: "瀏覽器推播，即時接收任務指派與到期提醒",
      enabled: pushEnabled,
      toggle: () => setPushEnabled((v) => !v),
      icon: pushEnabled ? <Bell className="size-4 text-primary" /> : <BellOff className="size-4 text-muted-foreground" />,
    },
  ] as const;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings2 className="size-4 text-primary" />
        <h1 className="text-xl font-semibold tracking-tight">通知設定</h1>
      </div>

      {/* Channels */}
      <div className="space-y-3">
        {channels.map((ch) => (
          <div
            key={ch.key}
            className="flex items-center justify-between rounded-xl border border-border/40 bg-card/30 px-4 py-4"
          >
            <div className="flex items-center gap-3">
              {ch.icon}
              <div>
                <p className="text-sm font-medium">{ch.label}</p>
                <p className="text-xs text-muted-foreground">{ch.description}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant={ch.enabled ? "default" : "outline"}
              onClick={ch.toggle}
              className="shrink-0"
            >
              {ch.enabled ? "已啟用" : "已停用"}
            </Button>
          </div>
        ))}
      </div>

      {/* Event types */}
      <div>
        <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">通知類型</p>
        <div className="space-y-2">
          {[
            "任務指派與狀態更新",
            "成員邀請與角色變更",
            "工作區建立與封存",
            "質檢與驗收請求",
            "評論與提及",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-2.5"
            >
              <span className="text-sm">{item}</span>
              <Badge variant="outline" className="text-xs">開啟</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) as React.ReactElement;
}

// ── Account / organization route screens ──────────────────────────────────────
// These screens belong to the platform bounded context (account lifecycle and
// organization management) and were previously misplaced in workspace-ui-stubs.

// ── OrganizationWorkspacesRouteScreen ─────────────────────────────────────────

export function OrganizationWorkspacesRouteScreen(): React.ReactElement {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="size-4 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">工作區</h1>
        </div>
        <Button size="sm" variant="outline" disabled>
          <Plus className="size-3.5" />
          建立工作區
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "全部", value: "0" },
          { label: "進行中", value: "0" },
          { label: "籌備中", value: "0" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1.5 rounded-xl border border-border/40 bg-card/60 px-3 py-3"
          >
            <span className="text-xs text-muted-foreground">{stat.label}</span>
            <p className="text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Workspace list — empty state */}
      <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
        <FolderOpen className="mx-auto mb-3 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">尚無工作區</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          建立工作區以組織任務、成員與知識文件。
        </p>
        <Button size="sm" variant="outline" className="mt-4" disabled>
          <Plus className="size-3.5" />
          建立工作區
        </Button>
      </div>
    </div>
  ) as React.ReactElement;
}

// ── OrganizationDailyRouteScreen ──────────────────────────────────────────────

export function OrganizationDailyRouteScreen(): React.ReactElement {
  const today = new Date().toLocaleDateString("zh-Hant-TW", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">每日</h1>
        </div>
        <Badge variant="outline" className="text-xs">{today}</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "今日任務", value: "0", icon: <Circle className="size-3.5 text-muted-foreground" /> },
          { label: "已完成", value: "0", icon: <CheckCircle2 className="size-3.5 text-emerald-500" /> },
          { label: "進行中", value: "0", icon: <Clock className="size-3.5 text-amber-500" /> },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1.5 rounded-xl border border-border/40 bg-card/60 px-3 py-3"
          >
            <div className="flex items-center gap-1.5">
              {stat.icon}
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Today's tasks — empty state */}
      <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
        <CalendarDays className="mx-auto mb-3 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">今日尚無排程任務</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          工作區任務指派截止日後，將自動匯聚到帳號每日視圖。
        </p>
      </div>
    </div>
  ) as React.ReactElement;
}

// ── OrganizationScheduleRouteScreen ──────────────────────────────────────────

export function OrganizationScheduleRouteScreen(): React.ReactElement {
  const [period, setPeriod] = useState<string>("本週");
  const periods = ["本週", "本月", "季度", "全部"] as const;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarRange className="size-4 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">排程</h1>
        </div>
        <Button size="sm" variant="outline" disabled>
          <Plus className="size-3.5" />
          新增里程碑
        </Button>
      </div>

      {/* Period filter */}
      <div className="flex flex-wrap gap-2">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              period === p
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:bg-muted/60"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Timeline — empty state */}
      <div className="relative rounded-xl border border-border/40 bg-card/30 overflow-hidden">
        <div className="absolute left-6 top-0 h-full w-px bg-border/30" />
        <div className="px-4 py-8 text-center">
          <CalendarRange className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">尚無排程里程碑</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            建立工作區里程碑後，帳號排程將匯聚各工作區進度。
          </p>
        </div>
      </div>
    </div>
  ) as React.ReactElement;
}

// ── OrganizationDispatcherRouteScreen ────────────────────────────────────────

const DISPATCHER_QUEUE_STUBS = [
  { label: "任務形成審核", count: 0, color: "text-primary" },
  { label: "待驗收任務", count: 0, color: "text-amber-600" },
  { label: "待結算清單", count: 0, color: "text-emerald-600" },
  { label: "開放問題單", count: 0, color: "text-rose-600" },
] as const;

export function OrganizationDispatcherRouteScreen(): React.ReactElement {
  const [activeQueue, setActiveQueue] = useState<string>(DISPATCHER_QUEUE_STUBS[0].label);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">調度台</h1>
        </div>
        <Badge variant="outline" className="text-xs">帳號 · 排程</Badge>
      </div>

      {/* Queue summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {DISPATCHER_QUEUE_STUBS.map((q) => (
          <button
            key={q.label}
            onClick={() => setActiveQueue(q.label)}
            className={`flex flex-col gap-1.5 rounded-xl border px-3 py-3 text-left transition ${
              activeQueue === q.label
                ? "border-primary/40 bg-primary/8"
                : "border-border/40 bg-card/60 hover:bg-muted/40"
            }`}
          >
            <span className="text-xs text-muted-foreground">{q.label}</span>
            <p className={`text-xl font-semibold ${q.color}`}>{q.count}</p>
          </button>
        ))}
      </div>

      {/* Active queue label */}
      <div className="flex items-center gap-2">
        <Play className="size-3.5 text-primary" />
        <p className="text-sm font-medium">{activeQueue}</p>
      </div>

      {/* Queue list — empty state */}
      <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
        <Zap className="mx-auto mb-3 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">調度佇列目前為空</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          工作區產生待處理項目後，將自動匯聚至帳號調度台。
        </p>
      </div>

      {/* Auto-dispatch rules info */}
      <div className="rounded-xl border border-border/40 bg-muted/20 px-4 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">自動調度規則</p>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          {[
            "任務形成完成後自動推入驗收佇列",
            "驗收通過後自動轉入結算佇列",
            "問題單達到高優先後自動升級通知",
          ].map((rule) => (
            <li key={rule} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-emerald-500" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) as React.ReactElement;
}

// ── OrganizationAuditRouteScreen ──────────────────────────────────────────────
const AUDIT_EVENT_TYPES = ["全部", "任務", "成員", "工作區", "設定"] as const;

export function OrganizationAuditRouteScreen(): React.ReactElement {
  const [eventType, setEventType] = useState<string>("全部");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">日誌</h1>
        </div>
        <Button size="sm" variant="ghost" disabled>
          <Filter className="size-3.5" />
          篩選
        </Button>
      </div>

      {/* Event type filter */}
      <div className="flex flex-wrap gap-2">
        {AUDIT_EVENT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setEventType(type)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              eventType === type
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:bg-muted/60"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Log — empty state */}
      <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-8 text-center">
        <Activity className="mx-auto mb-3 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">尚無日誌記錄</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          成員的操作行為（建立、修改、刪除）將自動記錄於帳號層級日誌。
        </p>
      </div>
    </div>
  ) as React.ReactElement;
}
