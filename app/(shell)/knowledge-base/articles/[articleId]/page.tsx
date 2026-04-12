"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useWorkspaceOrchestrationContext } from "@/modules/workspace/api";

export default function ArticleDetailPageRoute() {
  const params = useParams<{ articleId: string }>();
  const router = useRouter();
  const { accountId, workspaceId } = useWorkspaceOrchestrationContext();

  useEffect(() => {
    if (!accountId || !workspaceId || !params?.articleId) {
      return;
    }
    router.replace(
      `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}/knowledge-base/articles/${encodeURIComponent(params.articleId)}`,
    );
  }, [accountId, workspaceId, params?.articleId, router]);

  return null;
}
