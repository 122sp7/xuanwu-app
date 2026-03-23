"use client";

import type { WorkspaceEntity } from "@/modules/workspace";
import { WikiBetaWorkspaceView } from "@/modules/wiki-beta";

interface WorkspaceWikiTabProps {
  readonly workspace: WorkspaceEntity;
}

/**
 * Workspace tab entrypoint delegates rendering to wiki-beta owned view.
 */
export function WorkspaceWikiTab({ workspace }: WorkspaceWikiTabProps) {
  return <WikiBetaWorkspaceView workspace={workspace} />;
}
