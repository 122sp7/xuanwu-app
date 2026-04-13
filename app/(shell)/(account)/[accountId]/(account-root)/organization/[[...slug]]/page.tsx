"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  OrganizationMembersRouteScreen,
  OrganizationOverviewRouteScreen,
  OrganizationPermissionsRouteScreen,
  OrganizationTeamsRouteScreen,
} from "@/modules/platform/api";
import {
  OrganizationAuditRouteScreen,
  OrganizationDailyRouteScreen,
  OrganizationScheduleRouteScreen,
  OrganizationWorkspacesRouteScreen,
} from "@/modules/workspace/api";

interface OrganizationRouteDispatcherPageProps {
  params: {
    accountId: string;
    slug?: string[];
  };
}

function OrganizationScheduleDispatcherRedirect({ accountId }: { accountId: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${encodeURIComponent(accountId)}/organization/schedule`);
  }, [accountId, router]);

  return (
    <div className="rounded-xl border border-border/40 px-4 py-3 text-sm text-muted-foreground">
      正在導向組織排程…
    </div>
  );
}

export default function OrganizationRouteDispatcherPage({
  params,
}: OrganizationRouteDispatcherPageProps) {
  const slug = params.slug ?? [];

  if (slug.length === 0) {
    return <OrganizationOverviewRouteScreen />;
  }

  if (slug.length === 1) {
    switch (slug[0]) {
      case "audit":
        return <OrganizationAuditRouteScreen />;
      case "daily":
        return <OrganizationDailyRouteScreen />;
      case "members":
        return <OrganizationMembersRouteScreen />;
      case "permissions":
        return <OrganizationPermissionsRouteScreen />;
      case "schedule":
        return <OrganizationScheduleRouteScreen />;
      case "teams":
        return <OrganizationTeamsRouteScreen />;
      case "workspaces":
        return <OrganizationWorkspacesRouteScreen />;
      default:
        return <OrganizationOverviewRouteScreen />;
    }
  }

  if (slug.length === 2 && slug[0] === "schedule" && slug[1] === "dispatcher") {
    return <OrganizationScheduleDispatcherRedirect accountId={params.accountId} />;
  }

  return <OrganizationOverviewRouteScreen />;
}