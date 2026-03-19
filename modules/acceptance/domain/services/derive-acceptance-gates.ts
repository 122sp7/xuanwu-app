import type { AcceptanceGate } from "../entities/AcceptanceGate";

export interface AcceptanceWorkspaceSnapshot {
  readonly lifecycleState: "preparatory" | "active" | "stopped";
  readonly addressComplete: boolean;
  readonly assignedPersonnelCount: number;
  readonly capabilityCount: number;
  readonly locationCount: number;
}

export interface AcceptanceWorkspaceSnapshotSource {
  readonly lifecycleState: AcceptanceWorkspaceSnapshot["lifecycleState"];
  readonly address?: {
    readonly street?: string;
    readonly city?: string;
    readonly country?: string;
  };
  readonly personnel?: {
    readonly managerId?: string;
    readonly supervisorId?: string;
    readonly safetyOfficerId?: string;
  };
  readonly capabilityCount: number;
  readonly locationCount: number;
}

function hasCompleteAddress(source: AcceptanceWorkspaceSnapshotSource) {
  return Boolean(
    source.address?.street?.trim() &&
      source.address?.city?.trim() &&
      source.address?.country?.trim(),
  );
}

function countAssignedPersonnel(source: AcceptanceWorkspaceSnapshotSource) {
  return [
    source.personnel?.managerId,
    source.personnel?.supervisorId,
    source.personnel?.safetyOfficerId,
  ].filter((value) => Boolean(value?.trim())).length;
}

export function createAcceptanceWorkspaceSnapshot(
  source: AcceptanceWorkspaceSnapshotSource,
): AcceptanceWorkspaceSnapshot {
  return {
    lifecycleState: source.lifecycleState,
    addressComplete: hasCompleteAddress(source),
    assignedPersonnelCount: countAssignedPersonnel(source),
    capabilityCount: source.capabilityCount,
    locationCount: source.locationCount,
  };
}

export function deriveAcceptanceGates(
  workspace: AcceptanceWorkspaceSnapshot,
): readonly AcceptanceGate[] {
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
      status:
        workspace.addressComplete && workspace.assignedPersonnelCount >= 2
          ? "ready"
          : "attention",
      detail:
        workspace.addressComplete && workspace.assignedPersonnelCount >= 2
          ? "地址與主要聯絡角色已備妥。"
          : "地址或主要聯絡角色仍有缺漏。",
    },
    {
      id: "capability-readiness",
      label: "Capability readiness",
      status: workspace.capabilityCount > 0 ? "ready" : "attention",
      detail:
        workspace.capabilityCount > 0
          ? `已掛載 ${workspace.capabilityCount} 個 capability，可進入功能驗收。`
          : "尚未掛載 capability，暫時沒有可驗收功能。",
    },
    {
      id: "operational-scope",
      label: "Operational scope",
      status: workspace.locationCount > 0 ? "ready" : "attention",
      detail:
        workspace.locationCount > 0
          ? "地點與作業範圍已建立。"
          : "請先建立至少一個 location，讓 acceptance 有明確邊界。",
    },
  ];
}
