import type { WorkspaceEntity } from "@/modules/workspace";
import { getWorkspaceAcceptanceGates } from "@/modules/workspace/domain/entities/WorkspaceOperationalSignals";

import type { AcceptanceGate } from "../../domain/entities/AcceptanceGate";
import type {
  AcceptanceRepository,
  AcceptanceScope,
} from "../../domain/repositories/AcceptanceRepository";

export class LegacyWorkspaceAcceptanceRepository implements AcceptanceRepository {
  constructor(private readonly workspace: WorkspaceEntity) {}

  listByWorkspace(scope: AcceptanceScope): readonly AcceptanceGate[] {
    if (scope.workspaceId !== this.workspace.id) {
      return [];
    }

    return getWorkspaceAcceptanceGates(this.workspace);
  }
}
