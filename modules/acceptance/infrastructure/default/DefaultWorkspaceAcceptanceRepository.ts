import type { WorkspaceEntity } from "@/modules/workspace";

import type { AcceptanceGate } from "../../domain/entities/AcceptanceGate";
import type {
  AcceptanceRepository,
  AcceptanceScope,
} from "../../domain/repositories/AcceptanceRepository";

function hasAddress(workspace: WorkspaceEntity) {
  return Boolean(
    workspace.address?.street?.trim() &&
      workspace.address?.city?.trim() &&
      workspace.address?.country?.trim(),
  );
}

function assignedPersonnelCount(workspace: WorkspaceEntity) {
  return [
    workspace.personnel?.managerId,
    workspace.personnel?.supervisorId,
    workspace.personnel?.safetyOfficerId,
  ].filter((value) => Boolean(value?.trim())).length;
}

function toAcceptanceGates(workspace: WorkspaceEntity): readonly AcceptanceGate[] {
  return [
    {
      id: "lifecycle-state",
      label: "Lifecycle state",
      status: workspace.lifecycleState === "active" ? "ready" : "attention",
      detail:
        workspace.lifecycleState === "active"
          ? "工作區已進入 active 狀態。"
          : "建議先完成 preparatory 階段的資料補齊，再進入正式 acceptance。",
    },
    {
      id: "workspace-profile",
      label: "Workspace profile completeness",
      status: hasAddress(workspace) && assignedPersonnelCount(workspace) >= 2 ? "ready" : "attention",
      detail:
        hasAddress(workspace) && assignedPersonnelCount(workspace) >= 2
          ? "地址與主要聯絡角色已備妥。"
          : "地址或主要聯絡角色仍有缺漏。",
    },
    {
      id: "capability-readiness",
      label: "Capability readiness",
      status: workspace.capabilities.length > 0 ? "ready" : "attention",
      detail:
        workspace.capabilities.length > 0
          ? `已掛載 ${workspace.capabilities.length} 個 capability，可進入功能驗收。`
          : "尚未掛載 capability，暫時沒有可驗收功能。",
    },
    {
      id: "operational-scope",
      label: "Operational scope",
      status: (workspace.locations?.length ?? 0) > 0 ? "ready" : "attention",
      detail:
        (workspace.locations?.length ?? 0) > 0
          ? "地點與作業範圍已建立。"
          : "請先建立至少一個 location，讓 acceptance 有明確邊界。",
    },
  ];
}

export class DefaultWorkspaceAcceptanceRepository implements AcceptanceRepository {
  constructor(private readonly workspace: WorkspaceEntity) {}

  listByWorkspace(scope: AcceptanceScope): readonly AcceptanceGate[] {
    if (scope.workspaceId !== this.workspace.id) {
      return [];
    }

    return toAcceptanceGates(this.workspace);
  }
}
