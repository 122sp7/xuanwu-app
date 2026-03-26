"use client";

import type { WorkspaceEntity } from "../../domain/entities/Workspace";
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
