"use client";

import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import { WorkspaceWikiBetaView } from "./WorkspaceWikiBetaView";

interface WorkspaceWikiTabProps {
  readonly workspace: WorkspaceEntity;
}

/**
 * Workspace tab entrypoint delegates rendering to workspace owned view.
 */
export function WorkspaceWikiTab({ workspace }: WorkspaceWikiTabProps) {
  return <WorkspaceWikiBetaView workspace={workspace} />;
}
