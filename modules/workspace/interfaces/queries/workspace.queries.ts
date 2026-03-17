/**
 * Workspace Read Queries — thin wrappers exposing read operations for React components/hooks.
 */

import type { WorkspaceEntity } from "../../domain/entities/Workspace";
import { FirebaseWorkspaceRepository } from "../../infrastructure/firebase/FirebaseWorkspaceRepository";

export async function getWorkspacesForAccount(accountId: string): Promise<WorkspaceEntity[]> {
  const normalizedAccountId = accountId.trim();
  if (!normalizedAccountId) return [];
  const workspaceRepo = new FirebaseWorkspaceRepository();
  return workspaceRepo.findAllByAccountId(normalizedAccountId);
}

export async function getWorkspaceById(workspaceId: string): Promise<WorkspaceEntity | null> {
  const normalizedWorkspaceId = workspaceId.trim();
  if (!normalizedWorkspaceId) return null;
  const workspaceRepo = new FirebaseWorkspaceRepository();
  return workspaceRepo.findById(normalizedWorkspaceId);
}
