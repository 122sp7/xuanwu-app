"use client";

import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import { WorkspaceWikiView } from "./WorkspaceWikiView";

interface WorkspaceWikiTabProps {
  readonly workspace: WorkspaceEntity;
}

/**
 * Workspace tab entrypoint delegates rendering to workspace owned view.
 */
export function WorkspaceWikiTab({ workspace }: WorkspaceWikiTabProps) {
  return <WorkspaceWikiView workspace={workspace} />;
}
