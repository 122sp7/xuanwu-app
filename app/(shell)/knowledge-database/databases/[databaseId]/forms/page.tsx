"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";

export default function DatabaseFormsPageRoute() {
  const params = useParams<{ databaseId: string }>();
  const router = useRouter();
  const { accountId, workspaceId } = useWorkspaceOrchestrationContext();

  useEffect(() => {
    if (!accountId || !workspaceId || !params?.databaseId) {
      return;
    }
    router.replace(
      `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}/knowledge-database/databases/${encodeURIComponent(params.databaseId)}/forms`,
    );
  }, [accountId, workspaceId, params?.databaseId, router]);

  return null;
}
