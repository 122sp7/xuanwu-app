"use client";

import type { WorkspaceEntity } from "../../../contracts";
import { WorkspaceFeedWorkspaceView } from "@/modules/workspace/api/ui";

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
