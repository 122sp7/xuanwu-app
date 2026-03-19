import type { WorkspaceEntity } from "@/modules/workspace";

import type { AcceptanceGate } from "../../domain/entities/AcceptanceGate";
import {
  type AcceptanceWorkspaceSnapshotSource,
  createAcceptanceWorkspaceSnapshot,
  deriveAcceptanceGates,
} from "../../domain/services/derive-acceptance-gates";
import type {
  AcceptanceRepository,
  AcceptanceScope,
} from "../../domain/repositories/AcceptanceRepository";

function toAcceptanceSnapshotSource(
  workspace: WorkspaceEntity,
): AcceptanceWorkspaceSnapshotSource {
  return {
    lifecycleState: workspace.lifecycleState,
    address: workspace.address,
    personnel: workspace.personnel,
    capabilityCount: workspace.capabilities.length,
    locationCount: workspace.locations?.length ?? 0,
  };
}

export class DefaultWorkspaceAcceptanceRepository implements AcceptanceRepository {
  constructor(private readonly workspace: WorkspaceEntity) {}

  listByWorkspace(scope: AcceptanceScope): readonly AcceptanceGate[] {
    if (scope.workspaceId !== this.workspace.id) {
      return [];
    }

    return deriveAcceptanceGates(
      createAcceptanceWorkspaceSnapshot(toAcceptanceSnapshotSource(this.workspace)),
    );
  }
}
