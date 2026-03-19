import type { WorkspaceAcceptanceSummary } from "../../domain/entities/AcceptanceGate";
import type {
  AcceptanceRepository,
  AcceptanceScope,
} from "../../domain/repositories/AcceptanceRepository";

export class ListWorkspaceAcceptanceGatesUseCase {
  constructor(private readonly acceptanceRepository: AcceptanceRepository) {}

  execute(scope: AcceptanceScope): WorkspaceAcceptanceSummary {
    const workspaceId = scope.workspaceId.trim();
    if (!workspaceId) {
      return {
        gates: [],
        readyCount: 0,
        overallReady: false,
      };
    }

    const gates = this.acceptanceRepository.listByWorkspace({ workspaceId });
    const readyCount = gates.filter((gate) => gate.status === "ready").length;

    return {
      gates,
      readyCount,
      overallReady: gates.length > 0 && readyCount === gates.length,
    };
  }
}
