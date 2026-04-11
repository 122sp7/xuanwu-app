/**
 * Module: workspace
 * Layer: application/queries
 * Purpose: Workspace read query handlers — pure reads with input normalization.
 *
 * DDD Rule 5:  Pure reads without business logic → Query, not Use Case.
 * DDD Rule 13: Read → queries/
 * DDD Rule 16: GetXxxUseCase → should be Query.
 * DDD Rule 18: Use Case wrapping a single call → over-design.
 */

import type { WorkspaceEntity } from "../../domain/aggregates/Workspace";
import type { WorkspaceRepository } from "../../domain/ports/output/WorkspaceRepository";
import type {
  Unsubscribe,
  WorkspaceQueryRepository,
} from "../../domain/ports/output/WorkspaceQueryRepository";

// ─── Input Normalization ──────────────────────────────────────────────────────

function normalizeId(value: string): string {
  return value.trim();
}

// ─── Query Handlers ───────────────────────────────────────────────────────────

export function listWorkspacesForAccount(
  workspaceRepo: WorkspaceRepository,
  accountId: string,
): Promise<WorkspaceEntity[]> {
  const normalized = normalizeId(accountId);
  if (!normalized) return Promise.resolve([]);
  return workspaceRepo.findAllByAccountId(normalized);
}

export function subscribeToWorkspacesForAccount(
  workspaceQueryRepo: WorkspaceQueryRepository,
  accountId: string,
  onUpdate: (workspaces: WorkspaceEntity[]) => void,
): Unsubscribe {
  const normalized = normalizeId(accountId);
  if (!normalized) {
    onUpdate([]);
    return () => {};
  }
  return workspaceQueryRepo.subscribeToWorkspacesForAccount(normalized, onUpdate);
}

export function getWorkspaceById(
  workspaceRepo: WorkspaceRepository,
  workspaceId: string,
): Promise<WorkspaceEntity | null> {
  const normalized = normalizeId(workspaceId);
  if (!normalized) return Promise.resolve(null);
  return workspaceRepo.findById(normalized);
}

export function getWorkspaceByIdForAccount(
  workspaceRepo: WorkspaceRepository,
  accountId: string,
  workspaceId: string,
): Promise<WorkspaceEntity | null> {
  const normalizedAccountId = normalizeId(accountId);
  const normalizedWorkspaceId = normalizeId(workspaceId);
  if (!normalizedAccountId || !normalizedWorkspaceId) return Promise.resolve(null);
  return workspaceRepo.findByIdForAccount(normalizedAccountId, normalizedWorkspaceId);
}