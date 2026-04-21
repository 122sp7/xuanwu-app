"use client";

/**
 * AccountRouteDispatcher — workspace inbound adapter (React).
 *
 * Receives accountId + slug props from the Server Component shim and
 * dispatches to the appropriate route screen.
 *
 * Ported from: app/(shell)/(account)/[accountId]/[[...slug]]/page.tsx
 */

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "../../../../iam/adapters/inbound/react/AuthContext";
import {
  useAccountRouteContext,
  OrganizationMembersRouteScreen,
  OrganizationOverviewRouteScreen,
  OrganizationPermissionsRouteScreen,
  AccountDashboardRouteScreen,
  OrganizationWorkspacesRouteScreen,
  OrganizationTeamsRouteScreen,
  OrganizationScheduleRouteScreen,
  OrganizationDispatcherRouteScreen,
  OrganizationDailyRouteScreen,
  OrganizationAuditRouteScreen,
  SettingsNotificationsRouteScreen,
} from "../../../../platform/adapters/inbound/react/platform-ui-stubs";
import { useApp } from "../../../../platform/adapters/inbound/react/AppContext";
import {
  WorkspaceDetailRouteScreen,
  WorkspaceHubScreen,
} from "./workspace-ui-stubs";
import { WorkspaceAuditSection } from "./WorkspaceAuditSection";
import { WorkspaceAccountDailySection } from "./WorkspaceAccountDailySection";
import { useWorkspaceContext } from "./WorkspaceContext";
import { resolveAccountScopedWorkspaceId } from "./account-scoped-workspace";

export interface AccountRouteDispatcherProps {
  accountId: string;
  slug: string[];
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

export function AccountRouteDispatcher({
  accountId: accountIdFromParams,
  slug,
}: AccountRouteDispatcherProps) {
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
  const {
    state: { activeWorkspaceId, workspaces },
  } = useWorkspaceContext();
  const { state: authState } = useAuth();

  const effectiveAccountId =
    resolvedAccountId || accountIdFromParams || routeAccountId;
  const query = searchParams.toString();
  const querySuffix = query.length > 0 ? `?${query}` : "";
  const isLegacyWorkspaceAlias = routeAccountId === "workspace";
  const accountScopedWorkspaceId = resolveAccountScopedWorkspaceId({
    accountId: effectiveAccountId || null,
    activeWorkspaceId,
    workspaces,
  });

  if (isLegacyWorkspaceAlias && activeAccount?.id) {
    return (
      <RedirectingRoute
        href={`/${encodeURIComponent(activeAccount.id)}${querySuffix}`}
        message="正在導向帳號首頁…"
      />
    );
  }

  const authUserName = authState.user?.name ?? null;
  const organizationAccount = resolvedAccountId
    ? (accounts[resolvedAccountId] ?? null)
    : null;
  const accountName =
    resolvedAccountId === currentUserId
      ? authUserName
      : organizationAccount?.name ??
        (resolvedAccountId === activeAccount?.id ? activeAccount?.name : null);

  // Legacy redirect: /organization/... → /<accountId>/...
  if (slug[0] === "organization") {
    const nextSegments = slug.slice(1);
    const targetPath =
      nextSegments.length > 0
        ? `/${encodeURIComponent(effectiveAccountId)}/${nextSegments.map(encodeURIComponent).join("/")}`
        : `/${encodeURIComponent(effectiveAccountId)}`;
    return (
      <RedirectingRoute
        href={`${targetPath}${querySuffix}`}
        message="正在導向新的帳號路由…"
      />
    );
  }

  // Legacy redirect: /workspace/... → /<accountId>/...
  if (slug[0] === "workspace") {
    const nextSegments = slug.slice(1);
    const targetPath =
      nextSegments.length > 0
        ? `/${encodeURIComponent(effectiveAccountId)}/${nextSegments.map(encodeURIComponent).join("/")}`
        : `/${encodeURIComponent(effectiveAccountId)}`;
    return (
      <RedirectingRoute
        href={`${targetPath}${querySuffix}`}
        message="正在導向新的工作區路由…"
      />
    );
  }

  // Root: /<accountId>
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

  // Single-segment routes: /<accountId>/<segment>
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
        if (accountType === "organization") {
          return <OrganizationDispatcherRouteScreen />;
        }
        return <OrganizationScheduleRouteScreen />;
      case "daily":
        if (accountType === "organization") {
          return <WorkspaceAccountDailySection accountId={effectiveAccountId} />;
        }
        return <OrganizationDailyRouteScreen />;
      case "audit":
        if (accountType === "organization" && accountScopedWorkspaceId) {
          return (
            <WorkspaceAuditSection
              workspaceId={accountScopedWorkspaceId}
              accountId={effectiveAccountId}
            />
          );
        }
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
            currentUserId={currentUserId ?? undefined}
            initialTab={searchParams.get("tab") ?? undefined}
            initialOverviewPanel={searchParams.get("panel") ?? undefined}
          />
        );
    }
  }

  // Two-segment routes
  if (slug.length === 2 && slug[0] === "settings" && slug[1] === "notifications") {
    return <SettingsNotificationsRouteScreen />;
  }

  if (
    slug.length === 2 &&
    slug[0] === "schedule" &&
    slug[1] === "dispatcher"
  ) {
    return <OrganizationDispatcherRouteScreen />;
  }

  // Fallback
  return accountType === "organization" ? (
    <OrganizationOverviewRouteScreen />
  ) : (
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
