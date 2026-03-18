"use client";

/**
 * Organization Overview Page — /organization
 * Lists organizations visible to the current user and allows switching
 * to an organization account context.
 * Wired to organization module queries.
 */

import { useMemo, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import type { AccountEntity } from "@/modules/account/domain/entities/Account";
import { getWorkspaceAuditLogs } from "@/modules/audit";
import { getNotificationsForRecipient } from "@/modules/notification";
import {
  getOrgPolicies,
  getOrganizationMembers,
  getOrganizationTeams,
} from "@/modules/organization";
import { getWorkspacesForAccount } from "@/modules/workspace";
import { Badge } from "@/ui/shadcn/ui/badge";
import { Button } from "@/ui/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/shadcn/ui/tabs";

const organizationSections = [
  { value: "members", label: "成員" },
  { value: "teams", label: "團隊" },
  { value: "permissions", label: "權限" },
  { value: "schedule", label: "排程" },
  { value: "daily", label: "每日" },
  { value: "logs", label: "日誌" },
] as const;

type OrganizationSection = (typeof organizationSections)[number]["value"];

function isOrganizationSection(value: string | null): value is OrganizationSection {
  return organizationSections.some((section) => section.value === value);
}

function isOrganizationAccount(
  activeAccount: ReturnType<typeof useApp>["state"]["activeAccount"],
): activeAccount is AccountEntity & { accountType: "organization" } {
  return (
    activeAccount != null &&
    "accountType" in activeAccount &&
    activeAccount.accountType === "organization"
  );
}

function isSameLocalDay(timestamp: number) {
  const today = new Date();
  const target = new Date(timestamp);

  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth() &&
    today.getDate() === target.getDate()
  );
}

function formatDateTime(value: string) {
  if (!value) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function OrganizationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: appState, dispatch } = useApp();
  const { state: authState } = useAuth();
  const { user } = authState;
  const { accounts, activeAccount, accountsHydrated, bootstrapPhase } = appState;

  const orgList = Object.values(accounts);
  const activeOrganizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;
  const currentSection = searchParams.get("section");
  const activeSection: OrganizationSection = isOrganizationSection(currentSection)
    ? currentSection
    : "members";

  const [members, setMembers] = useState<Awaited<ReturnType<typeof getOrganizationMembers>>>([]);
  const [teams, setTeams] = useState<Awaited<ReturnType<typeof getOrganizationTeams>>>([]);
  const [policies, setPolicies] = useState<Awaited<ReturnType<typeof getOrgPolicies>>>([]);
  const [workspaceSummaries, setWorkspaceSummaries] = useState<
    Awaited<ReturnType<typeof getWorkspacesForAccount>>
  >([]);
  const [dailyNotifications, setDailyNotifications] = useState<
    Awaited<ReturnType<typeof getNotificationsForRecipient>>
  >([]);
  const [auditLogs, setAuditLogs] = useState<Awaited<ReturnType<typeof getWorkspaceAuditLogs>>>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  useEffect(() => {
    const organizationId = activeOrganizationId ?? "";
    if (!organizationId) {
      return;
    }

    let cancelled = false;

    async function loadOrganizationGovernance() {
      setLoadState("loading");
      try {
        const [nextMembers, nextTeams, nextPolicies, nextWorkspaces, nextNotifications] =
          await Promise.all([
            getOrganizationMembers(organizationId),
            getOrganizationTeams(organizationId),
            getOrgPolicies(organizationId),
            getWorkspacesForAccount(organizationId),
            getNotificationsForRecipient(organizationId, 100),
          ]);

        const workspaceLogs = await Promise.all(
          nextWorkspaces.map((workspace) => getWorkspaceAuditLogs(workspace.id)),
        );

        if (cancelled) {
          return;
        }

        setMembers(nextMembers);
        setTeams(nextTeams);
        setPolicies(nextPolicies);
        setWorkspaceSummaries(nextWorkspaces);
        setDailyNotifications(nextNotifications);
        setAuditLogs(
          workspaceLogs
            .flat()
            .sort((left, right) => right.occurredAtISO.localeCompare(left.occurredAtISO)),
        );
        setLoadState("loaded");
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[OrganizationPage] Failed to load governance data:", error);
        }

        if (!cancelled) {
          setMembers([]);
          setTeams([]);
          setPolicies([]);
          setWorkspaceSummaries([]);
          setDailyNotifications([]);
          setAuditLogs([]);
          setLoadState("error");
        }
      }
    }

    void loadOrganizationGovernance();

    return () => {
      cancelled = true;
    };
  }, [activeOrganizationId]);

  const todayFeed = useMemo(
    () =>
      dailyNotifications.filter((notification) => {
        if (!isSameLocalDay(notification.timestamp)) {
          return false;
        }

        const metadataWorkspaceId =
          typeof notification.metadata?.workspaceId === "string"
            ? notification.metadata.workspaceId
            : null;

        if (!metadataWorkspaceId) {
          return true;
        }

        return workspaceSummaries.some((workspace) => workspace.id === metadataWorkspaceId);
      }),
    [dailyNotifications, workspaceSummaries],
  );

  function handleSectionChange(section: string) {
    if (!isOrganizationSection(section)) {
      return;
    }

    router.replace(`/organization?section=${section}`, { scroll: false });
  }

  function handleSwitch(account: AccountEntity) {
    dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: account });
  }

  function handleSwitchToPersonal() {
    if (user) dispatch({ type: "SET_ACTIVE_ACCOUNT", payload: user });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Switch between your personal account and your organizations.
        </p>
      </div>

      {!accountsHydrated && (
        <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
          {bootstrapPhase === "seeded"
            ? "正在同步你的組織清單，完成後就能切換到對應的組織上下文。"
            : "正在載入組織資料…"}
        </div>
      )}

      {/* Personal account */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">Personal Account</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{user?.name ?? "—"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          {activeAccount?.id === user?.id ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Active
            </span>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSwitchToPersonal}
            >
              Switch
            </Button>
          )}
        </div>
      </section>

      {/* Organizations */}
      <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">
          Organizations
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            ({orgList.length})
          </span>
        </h2>

        {orgList.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You are not a member of any organization yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {orgList.map((org) => (
              <li
                key={org.id}
                className="flex items-center justify-between rounded-xl border border-border/40 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{org.name}</p>
                  {org.description && (
                    <p className="text-xs text-muted-foreground">{org.description}</p>
                  )}
                </div>
                {activeAccount?.id === org.id ? (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Active
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSwitch(org)}
                  >
                    Switch
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {activeOrganizationId && (
        <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <Tabs value={activeSection} onValueChange={handleSectionChange}>
            <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-muted/40 p-1">
              {organizationSections.map((section) => (
                <TabsTrigger key={section.value} value={section.value}>
                  {section.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {loadState === "loading" && (
              <p className="mt-4 text-sm text-muted-foreground">載入組織治理資料中…</p>
            )}
            {loadState === "error" && (
              <p className="mt-4 text-sm text-destructive">
                讀取組織治理資料失敗，請稍後重新整理頁面。
              </p>
            )}

            <TabsContent value="members" className="mt-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Members</CardTitle>
                  <CardDescription>組織成員清單與目前角色。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {members.length === 0 ? (
                    <p className="text-sm text-muted-foreground">目前沒有可顯示的成員資料。</p>
                  ) : (
                    members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{member.role}</Badge>
                          <Badge variant="secondary">{member.presence}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams" className="mt-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Teams</CardTitle>
                  <CardDescription>組織團隊與成員關聯。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {teams.length === 0 ? (
                    <p className="text-sm text-muted-foreground">目前沒有可顯示的團隊資料。</p>
                  ) : (
                    teams.map((team) => (
                      <div
                        key={team.id}
                        className="rounded-lg border border-border/40 px-3 py-2"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{team.name}</p>
                          <Badge variant="outline">{team.type}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{team.description || "—"}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Members: {team.memberIds.length}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="mt-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Permissions</CardTitle>
                  <CardDescription>組織層級政策規則與 scope。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {policies.length === 0 ? (
                    <p className="text-sm text-muted-foreground">目前沒有可顯示的政策資料。</p>
                  ) : (
                    policies.map((policy) => (
                      <div
                        key={policy.id}
                        className="rounded-lg border border-border/40 px-3 py-2"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">{policy.name}</p>
                          <Badge variant="outline">{policy.scope}</Badge>
                          <Badge variant={policy.isActive ? "default" : "secondary"}>
                            {policy.isActive ? "active" : "inactive"}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{policy.description}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Rules: {policy.rules.length}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="mt-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Schedule</CardTitle>
                  <CardDescription>
                    組織下各工作區的 lifecycle / milestone 排程總覽。
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workspaceSummaries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">目前沒有可顯示的工作區排程資料。</p>
                  ) : (
                    workspaceSummaries.map((workspace) => (
                      <div
                        key={workspace.id}
                        className="rounded-lg border border-border/40 px-3 py-2"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">{workspace.name}</p>
                          <Badge variant="outline">{workspace.lifecycleState}</Badge>
                          <Badge variant="secondary">{workspace.visibility}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Created: {formatDateTime(workspace.createdAt?.toDate().toISOString() ?? "")}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="daily" className="mt-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Daily</CardTitle>
                  <CardDescription>組織層級今日通知與活動摘要。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todayFeed.length === 0 ? (
                    <p className="text-sm text-muted-foreground">今天沒有新的組織動態。</p>
                  ) : (
                    todayFeed.map((notification) => (
                      <div
                        key={notification.id}
                        className="rounded-lg border border-border/40 px-3 py-2"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <Badge variant="outline">{notification.type}</Badge>
                          {!notification.read && <Badge variant="secondary">Unread</Badge>}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{notification.message}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Logs</CardTitle>
                  <CardDescription>組織下所有工作區的 audit log 彙整。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {auditLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">目前沒有可顯示的 audit logs。</p>
                  ) : (
                    auditLogs.slice(0, 50).map((log) => (
                      <div
                        key={log.id}
                        className="rounded-lg border border-border/40 px-3 py-2"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">{log.action}</p>
                          <Badge variant="outline">{log.source}</Badge>
                          <Badge variant="secondary">{log.workspaceId}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{log.detail || "—"}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDateTime(log.occurredAtISO)}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      )}
    </div>
  );
}
