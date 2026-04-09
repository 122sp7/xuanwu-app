"use client";

import type { WorkspaceEntity } from "../../../api/contracts";
import { WorkspaceFeedWorkspaceView } from "@/modules/workspace-feed/api";

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
