"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";

export default function KnowledgePageDetailPageRoute() {
  const params = useParams<{ pageId: string }>();
  const router = useRouter();
  const { accountId, activeWorkspaceId } = useWorkspaceOrchestrationContext();

  useEffect(() => {
    if (!accountId || !activeWorkspaceId || !params?.pageId) {
      return;
    }
    router.replace(
      `/${encodeURIComponent(accountId)}/${encodeURIComponent(activeWorkspaceId)}/knowledge/pages/${encodeURIComponent(params.pageId)}`,
    );
  }, [accountId, activeWorkspaceId, params?.pageId, router]);

  return null;
}
