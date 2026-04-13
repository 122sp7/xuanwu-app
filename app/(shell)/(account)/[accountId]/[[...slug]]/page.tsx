"use client";

import { use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  OrganizationMembersRouteScreen,
  OrganizationOverviewRouteScreen,
  OrganizationPermissionsRouteScreen,
  OrganizationTeamsRouteScreen,
  SettingsNotificationsRouteScreen,
  useAccountRouteContext,
  useApp,
  useAuth,
} from "@/modules/platform/api";
import {
  AccountDashboardRouteScreen,
  OrganizationAuditRouteScreen,
  OrganizationDailyRouteScreen,
  OrganizationScheduleRouteScreen,
  OrganizationWorkspacesRouteScreen,
  WorkspaceDetailRouteScreen,
  WorkspaceHubScreen,
} from "@/modules/workspace/api";

interface AccountRouteDispatcherPageProps {
  params: Promise<{
    accountId: string;
    slug?: string[];
  }>;
}

interface RedirectingRouteProps {
  readonly href: string;
  readonly message: string;
}

function RedirectingRoute({ href, message }: RedirectingRouteProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(href);
  }, [href, router]);

  return <div className="px-4 py-6 text-sm text-muted-foreground">{message}</div>;
}

export default function AccountRouteDispatcherPage({
  params,
}: AccountRouteDispatcherPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const {
    routeAccountId,
    resolvedAccountId,
    currentUserId,
    accountType,
    accountsHydrated,
  } = useAccountRouteContext();
  const {
    state: { activeAccount, accounts, bootstrapPhase },
  } = useApp();
  const { state: authState } = useAuth();

  const slug = resolvedParams.slug ?? [];
  const routeAccountIdFromParams = resolvedParams.accountId;
  const effectiveAccountId = resolvedAccountId || routeAccountIdFromParams || routeAccountId;
  const query = searchParams.toString();
  const querySuffix = query.length > 0 ? `?${query}` : "";
  const isLegacyWorkspaceAlias = routeAccountId === "workspace";

  if (isLegacyWorkspaceAlias && activeAccount?.id) {
    return (
      <RedirectingRoute
        href={`/${encodeURIComponent(activeAccount.id)}${querySuffix}`}
        message="正在導向帳號首頁…"
      />
    );
  }

  const authUserName = authState.user?.name ?? null;
  const organizationAccount = resolvedAccountId ? accounts[resolvedAccountId] ?? null : null;
  const accountName =
    resolvedAccountId === currentUserId
      ? authUserName
      : organizationAccount?.name ??
        (resolvedAccountId === activeAccount?.id ? activeAccount?.name : null);

  if (slug[0] === "organization") {
    const nextSegments = slug.slice(1);
    const targetPath = nextSegments.length > 0
      ? `/${encodeURIComponent(effectiveAccountId)}/${nextSegments.map(encodeURIComponent).join("/")}`
      : `/${encodeURIComponent(effectiveAccountId)}`;

    return (
      <RedirectingRoute
        href={`${targetPath}${querySuffix}`}
        message="正在導向新的帳號路由…"
      />
    );
  }

  if (slug[0] === "workspace") {
    const nextSegments = slug.slice(1);
    const targetPath = nextSegments.length > 0
      ? `/${encodeURIComponent(effectiveAccountId)}/${nextSegments.map(encodeURIComponent).join("/")}`
      : `/${encodeURIComponent(effectiveAccountId)}`;

    return (
      <RedirectingRoute
        href={`${targetPath}${querySuffix}`}
        message="正在導向新的工作區路由…"
      />
    );
  }

  if (slug.length === 0) {
    if (accountType === "organization") {
      return <OrganizationOverviewRouteScreen />;
    }

    const context = searchParams.get("context");

    return (
      <div className="space-y-4">
        {context === "unavailable" && (
          <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
            目前帳戶無法存取該工作區，已返回工作區清單。
          </div>
        )}

        <WorkspaceHubScreen
          accountId={effectiveAccountId || null}
          accountName={accountName}
          accountType={accountType}
          accountsHydrated={accountsHydrated}
          isBootstrapSeeded={bootstrapPhase === "seeded"}
          currentUserId={currentUserId}
        />
      </div>
    );
  }

  if (slug.length === 1) {
    switch (slug[0]) {
      case "dashboard":
        return <AccountDashboardRouteScreen />;
      case "members":
        return <OrganizationMembersRouteScreen />;
      case "permissions":
        return <OrganizationPermissionsRouteScreen />;
      case "teams":
        return <OrganizationTeamsRouteScreen />;
      case "workspaces":
        return <OrganizationWorkspacesRouteScreen />;
      case "schedule":
        return <OrganizationScheduleRouteScreen />;
      case "daily":
        return <OrganizationDailyRouteScreen />;
      case "audit":
        return <OrganizationAuditRouteScreen />;
      case "settings":
        return (
          <RedirectingRoute
            href={`/${encodeURIComponent(effectiveAccountId)}/settings/notifications${querySuffix}`}
            message="正在導向帳號設定…"
          />
        );
      default:
        return (
          <WorkspaceDetailRouteScreen
            workspaceId={slug[0]}
            accountId={effectiveAccountId}
            accountsHydrated={accountsHydrated}
            initialTab={searchParams.get("tab") ?? undefined}
            initialOverviewPanel={searchParams.get("panel") ?? undefined}
          />
        );
    }
  }

  if (slug.length === 2 && slug[0] === "settings" && slug[1] === "notifications") {
    return <SettingsNotificationsRouteScreen />;
  }

  if (slug.length === 2 && slug[0] === "schedule" && slug[1] === "dispatcher") {
    return (
      <RedirectingRoute
        href={`/${encodeURIComponent(effectiveAccountId)}/schedule${querySuffix}`}
        message="正在導向排程…"
      />
    );
  }

  return accountType === "organization"
    ? <OrganizationOverviewRouteScreen />
    : (
      <WorkspaceHubScreen
        accountId={effectiveAccountId || null}
        accountName={accountName}
        accountType={accountType}
        accountsHydrated={accountsHydrated}
        isBootstrapSeeded={bootstrapPhase === "seeded"}
        currentUserId={currentUserId}
      />
    );
}