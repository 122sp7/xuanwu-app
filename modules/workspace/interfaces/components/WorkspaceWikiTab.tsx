"use client";

import type { WorkspaceEntity } from "@/modules/workspace";
import { WikiBetaWorkspaceView } from "@/modules/wiki-beta";

interface WorkspaceWikiTabProps {
  readonly workspace: WorkspaceEntity;
}

/**
 * Compatibility wrapper for legacy workspace tab usage.
 * Implementation lives in wiki-beta interfaces as WikiBetaWorkspaceView.
 */
export function WorkspaceWikiTab({ workspace }: WorkspaceWikiTabProps) {
  return <WikiBetaWorkspaceView workspace={workspace} />;
}
