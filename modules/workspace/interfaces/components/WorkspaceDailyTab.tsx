"use client";

import type { WorkspaceEntity } from "@/modules/workspace";
import { WorkspaceFeedWorkspaceView } from "@/modules/workspace-feed";

interface WorkspaceDailyTabProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceDailyTab({ workspace }: WorkspaceDailyTabProps) {
  return (
    <WorkspaceFeedWorkspaceView
      accountId={workspace.accountId}
      workspaceId={workspace.id}
      workspaceName={workspace.name}
    />
  );
}
