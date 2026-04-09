/**
 * Workspace Read Queries — thin wrappers exposing read operations for React components/hooks.
 */

import type { WorkspaceEntity } from "./contracts";
import {
  GetWorkspaceByIdForAccountUseCase,
  GetWorkspaceByIdUseCase,
  ListWorkspacesForAccountUseCase,
  SubscribeToWorkspacesForAccountUseCase,
} from "../../application/use-cases/workspace-query.use-cases";
import { FirebaseWorkspaceRepository } from "../../infrastructure/firebase/FirebaseWorkspaceRepository";
import { FirebaseWorkspaceQueryRepository } from "../../infrastructure/firebase/FirebaseWorkspaceQueryRepository";

const workspaceRepo = new FirebaseWorkspaceRepository();
const workspaceQueryRepo = new FirebaseWorkspaceQueryRepository();
const listWorkspacesForAccountUseCase = new ListWorkspacesForAccountUseCase(workspaceRepo);
const subscribeToWorkspacesForAccountUseCase = new SubscribeToWorkspacesForAccountUseCase(
  workspaceQueryRepo,
);
const getWorkspaceByIdUseCase = new GetWorkspaceByIdUseCase(workspaceRepo);
const getWorkspaceByIdForAccountUseCase = new GetWorkspaceByIdForAccountUseCase(workspaceRepo);

export async function getWorkspacesForAccount(accountId: string): Promise<WorkspaceEntity[]> {
  return listWorkspacesForAccountUseCase.execute(accountId);
}

export function subscribeToWorkspacesForAccount(
  accountId: string,
  onUpdate: (workspaces: WorkspaceEntity[]) => void,
) {
  return subscribeToWorkspacesForAccountUseCase.execute(accountId, onUpdate);
}

export async function getWorkspaceById(workspaceId: string): Promise<WorkspaceEntity | null> {
  return getWorkspaceByIdUseCase.execute(workspaceId);
}

export async function getWorkspaceByIdForAccount(
  accountId: string,
  workspaceId: string,
): Promise<WorkspaceEntity | null> {
  return getWorkspaceByIdForAccountUseCase.execute(accountId, workspaceId);
}
