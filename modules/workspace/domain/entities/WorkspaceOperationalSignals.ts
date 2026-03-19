import type { WorkspaceEntity } from "./Workspace";

export type WorkspaceActivityType = "info" | "alert" | "success" | "warning";

export interface WorkspaceActivitySignal {
  readonly title: string;
  readonly message: string;
  readonly type: WorkspaceActivityType;
  readonly read: boolean;
  readonly timestamp: number;
  readonly sourceEventType?: string;
  readonly metadata?: Record<string, unknown>;
}

export interface WorkspaceOperationalTask {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: "pending" | "in-progress" | "completed";
  readonly owner: string;
  readonly dueLabel: string;
  readonly source: "configuration" | "notification" | "capability";
}

export interface WorkspaceQualityCheck {
  readonly id: string;
  readonly label: string;
  readonly status: "pass" | "warn" | "fail";
  readonly detail: string;
}

export interface WorkspaceIssueSignal {
  readonly id: string;
  readonly title: string;
  readonly severity: "low" | "medium" | "high";
  readonly status: "open" | "monitoring" | "resolved";
  readonly detail: string;
  readonly source: "configuration" | "notification" | "capability";
}

export interface WorkspaceFileAsset {
  readonly id: string;
  readonly name: string;
  readonly kind: "image" | "manifest" | "record";
  readonly status: "available" | "derived";
  readonly source: string;
  readonly detail: string;
  readonly href?: string;
}

export interface WorkspaceParserSummary {
  readonly supportedSources: number;
  readonly readyAssetCount: number;
  readonly blockedReasons: string[];
  readonly nextActions: string[];
}

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

function getDateLabel(value: string | number | Date | null | undefined) {
  if (!value) {
    return "待排定";
  }

  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  } catch {
    return typeof value === "string" ? value : "待排定";
  }
}

function sortByStatus<T extends { status: string }>(items: readonly T[], order: readonly string[]) {
  const orderIndex = new Map(order.map((status, index) => [status, index]));

  return [...items].sort(
    (left, right) =>
      (orderIndex.get(left.status) ?? Number.MAX_SAFE_INTEGER) -
      (orderIndex.get(right.status) ?? Number.MAX_SAFE_INTEGER),
  );
}

export function getWorkspaceOperationalTasks(
  workspace: WorkspaceEntity,
  signals: readonly WorkspaceActivitySignal[] = [],
): WorkspaceOperationalTask[] {
  const tasks: WorkspaceOperationalTask[] = [];

  tasks.push({
    id: "workspace-profile",
    title: "校正工作區基本資料",
    description: hasAddress(workspace)
      ? "地址資料已建立，可持續維護細節。"
      : "補齊地址資訊，避免後續排程與驗收無法對應實體場域。",
    status: hasAddress(workspace) ? "completed" : "pending",
    owner: "Workspace admin",
    dueLabel: "本輪設定",
    source: "configuration",
  });

  const personnelReady = assignedPersonnelCount(workspace) >= 2;
  tasks.push({
    id: "workspace-personnel",
    title: "確認聯絡角色與現場責任人",
    description: personnelReady
      ? "主要聯絡角色已配置，可持續補齊其餘責任分工。"
      : "至少指定 manager / supervisor / safety officer 其中兩個角色。",
    status: personnelReady ? "completed" : "pending",
    owner: "Operations lead",
    dueLabel: "啟用前",
    source: "configuration",
  });

  const locationsReady = (workspace.locations?.length ?? 0) > 0;
  tasks.push({
    id: "workspace-locations",
    title: "建立工作區 locations",
    description: locationsReady
      ? `目前已配置 ${workspace.locations?.length ?? 0} 個 location。`
      : "補上可服務地點或作業區域，讓排程、QA 與驗收有明確範圍。",
    status: locationsReady ? "completed" : "pending",
    owner: "Facility coordinator",
    dueLabel: "啟用前",
    source: "configuration",
  });

  const capabilityCount = workspace.capabilities.length;
  tasks.push({
    id: "workspace-capabilities",
    title: "檢視 capability 掛載",
    description:
      capabilityCount > 0
        ? `目前已掛載 ${capabilityCount} 個 capability。`
        : "尚未掛載任何 capability，工作區功能仍不完整。",
    status: capabilityCount > 0 ? "in-progress" : "pending",
    owner: "Product owner",
    dueLabel: "本週",
    source: "capability",
  });

  if (workspace.capabilities.some((capability) => capability.status === "beta")) {
    tasks.push({
      id: "workspace-beta-capabilities",
      title: "追蹤 beta capability 上線風險",
      description: "存在 beta capability，建議安排 QA 與驗收確認流程。",
      status: "in-progress",
      owner: "QA owner",
      dueLabel: "發版前",
      source: "capability",
    });
  }

  signals
    .filter((signal) => signal.type === "alert" || signal.type === "warning")
    .slice(0, 3)
    .forEach((signal, index) => {
      tasks.push({
        id: `notification-${index}`,
        title: signal.title,
        description: signal.message,
        status: signal.read ? "completed" : signal.type === "alert" ? "pending" : "in-progress",
        owner: "Workspace inbox",
        dueLabel: getDateLabel(signal.timestamp),
        source: "notification",
      });
    });

  return sortByStatus(tasks, ["pending", "in-progress", "completed"]);
}

export function getWorkspaceQualityChecks(workspace: WorkspaceEntity): WorkspaceQualityCheck[] {
  const checks: WorkspaceQualityCheck[] = [
    {
      id: "capability-coverage",
      label: "Capability coverage",
      status: workspace.capabilities.length > 0 ? "pass" : "fail",
      detail:
        workspace.capabilities.length > 0
          ? `已配置 ${workspace.capabilities.length} 個 capability。`
          : "尚未配置 capability，無法驗證工作區實際功能面。",
    },
    {
      id: "location-mapping",
      label: "Location mapping",
      status: (workspace.locations?.length ?? 0) > 0 ? "pass" : "warn",
      detail:
        (workspace.locations?.length ?? 0) > 0
          ? `已配置 ${workspace.locations?.length ?? 0} 個 location。`
          : "尚未建立 location，排程與驗收的範圍會不明確。",
    },
    {
      id: "personnel-ownership",
      label: "Personnel ownership",
      status: assignedPersonnelCount(workspace) >= 2 ? "pass" : "warn",
      detail:
        assignedPersonnelCount(workspace) >= 2
          ? "主要聯絡角色已就位。"
          : "請至少指定兩個責任角色，避免異常處理沒有 owner。",
    },
    {
      id: "access-controls",
      label: "Access controls",
      status: workspace.grants.length > 0 || workspace.teamIds.length > 0 ? "pass" : "warn",
      detail:
        workspace.grants.length > 0 || workspace.teamIds.length > 0
          ? "已有 team 或 direct grant。"
          : "尚未建立 grant 或 team access，協作風險較高。",
    },
    {
      id: "address-record",
      label: "Address record",
      status: hasAddress(workspace) ? "pass" : "warn",
      detail: hasAddress(workspace)
        ? "工作區地址資料齊全。"
        : "地址資訊尚未完整，實體場域追蹤不足。",
    },
  ];

  return sortByStatus(checks, ["fail", "warn", "pass"]);
}

export function getWorkspaceIssueSignals(
  workspace: WorkspaceEntity,
  signals: readonly WorkspaceActivitySignal[] = [],
): WorkspaceIssueSignal[] {
  const issues: WorkspaceIssueSignal[] = [];

  if (!hasAddress(workspace)) {
    issues.push({
      id: "issue-missing-address",
      title: "地址資訊尚未完成",
      severity: "high",
      status: "open",
      detail: "缺少地址會讓排程、QA 與驗收的現場資訊不完整。",
      source: "configuration",
    });
  }

  if ((workspace.locations?.length ?? 0) === 0) {
    issues.push({
      id: "issue-missing-location",
      title: "尚未建立任何 location",
      severity: "high",
      status: "open",
      detail: "沒有 location 會讓工作區無法建立清楚的服務/作業範圍。",
      source: "configuration",
    });
  }

  if (workspace.capabilities.some((capability) => capability.status === "beta")) {
    issues.push({
      id: "issue-beta-capability",
      title: "存在 beta capability",
      severity: "medium",
      status: "monitoring",
      detail: "beta capability 需要額外 QA 與 acceptance 驗證。",
      source: "capability",
    });
  }

  signals
    .filter((signal) => signal.type === "alert" || signal.type === "warning")
    .slice(0, 4)
    .forEach((signal, index) => {
      issues.push({
        id: `notification-issue-${index}`,
        title: signal.title,
        severity: signal.type === "alert" ? "high" : "medium",
        status: signal.read ? "resolved" : "open",
        detail: signal.message,
        source: "notification",
      });
    });

  return sortByStatus(issues, ["open", "monitoring", "resolved"]);
}

export function getWorkspaceFileAssets(workspace: WorkspaceEntity): WorkspaceFileAsset[] {
  const assets: WorkspaceFileAsset[] = [];

  if (workspace.photoURL) {
    assets.push({
      id: "workspace-avatar",
      name: "workspace-avatar",
      kind: "image",
      status: "available",
      source: "workspace photoURL",
      detail: "目前已註冊的工作區視覺資產。",
      href: workspace.photoURL,
    });
  }

  assets.push({
    id: "workspace-profile-manifest",
    name: "workspace-profile.json",
    kind: "manifest",
    status: "derived",
    source: "workspace metadata",
    detail: `可從目前工作區設定導出名稱、可見性與 lifecycle 狀態。`,
  });

  if (workspace.capabilities.length > 0) {
    assets.push({
      id: "workspace-capabilities-manifest",
      name: "capabilities.json",
      kind: "manifest",
      status: "derived",
      source: "capability bindings",
      detail: `可導出 ${workspace.capabilities.length} 個 capability 綁定。`,
    });
  }

  if (workspace.grants.length > 0 || workspace.teamIds.length > 0) {
    assets.push({
      id: "workspace-access-policy",
      name: "access-policy.json",
      kind: "record",
      status: "derived",
      source: "workspace grants",
      detail: `可整理 ${workspace.grants.length} 筆 grant 與 ${workspace.teamIds.length} 個 team access。`,
    });
  }

  if ((workspace.locations?.length ?? 0) > 0) {
    assets.push({
      id: "workspace-locations-record",
      name: "locations.json",
      kind: "record",
      status: "derived",
      source: "workspace locations",
      detail: `可整理 ${(workspace.locations?.length ?? 0)} 個 location 進入檔案流程。`,
    });
  }

  return assets;
}

export function getWorkspaceParserSummary(
  workspace: WorkspaceEntity,
  fileAssets: readonly WorkspaceFileAsset[],
): WorkspaceParserSummary {
  const blockedReasons: string[] = [];
  const nextActions: string[] = [];

  if (fileAssets.length === 0) {
    blockedReasons.push("目前沒有任何可供解析的工作區資產。");
  }

  if (!workspace.photoURL) {
    nextActions.push("若有平面圖、報價或合約截圖，可先補上工作區封面或附件來源。");
  }

  if (workspace.capabilities.length === 0) {
    nextActions.push("先掛載 capability，讓後續文件解析結果能對應到實際流程。");
  }

  if (nextActions.length === 0) {
    nextActions.push("可以從已註冊的資產挑選來源，準備進入知識或審計流程。");
  }

  return {
    supportedSources: fileAssets.length,
    readyAssetCount: fileAssets.filter((asset) => asset.status === "available").length,
    blockedReasons: blockedReasons.map((reason) => reason.trim()).filter(Boolean),
    nextActions: nextActions.map((action) => action.trim()).filter(Boolean),
  };
}
