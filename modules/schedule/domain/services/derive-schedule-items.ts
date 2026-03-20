import type {
  WorkspaceFinanceScheduleSnapshot,
  WorkspaceScheduleItem,
} from "../entities/ScheduleItem";

const SCHEDULE_DATE_LOCALE = "zh-TW";
const SCHEDULE_COPY = {
  pendingDate: "待排定",
  onboardingDetail: "工作區已建立，可持續補齊營運設定。",
  paymentReceivedDetail: "收款節點已完成。",
  profileFollowupTimeLabel: "啟用前",
  profileFollowupDetail: "地址與主要聯絡角色尚未完全就位。",
  betaReviewTimeLabel: "本週",
  betaReviewDetail: "beta capability 需要 QA / acceptance 同步檢查。",
} as const;

function getPaymentTermDetail(stage: string) {
  return `目前 finance stage：${stage}`;
}

export interface ScheduleWorkspaceSnapshot {
  readonly createdAt: Date;
  readonly addressComplete: boolean;
  readonly assignedPersonnelCount: number;
  readonly hasBetaCapability: boolean;
  readonly finance: WorkspaceFinanceScheduleSnapshot | null;
}

export interface ScheduleWorkspaceSnapshotSource {
  readonly createdAt: Date;
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
  readonly hasBetaCapability: boolean;
  readonly finance: WorkspaceFinanceScheduleSnapshot | null;
}

function hasCompleteAddress(source: ScheduleWorkspaceSnapshotSource) {
  return Boolean(
    source.address?.street?.trim() &&
      source.address?.city?.trim() &&
      source.address?.country?.trim(),
  );
}

function countAssignedPersonnel(source: ScheduleWorkspaceSnapshotSource) {
  return [
    source.personnel?.managerId,
    source.personnel?.supervisorId,
    source.personnel?.safetyOfficerId,
  ].filter((value) => Boolean(value?.trim())).length;
}

function getDateLabel(value: string | number | Date | null | undefined) {
  if (!value) {
    return SCHEDULE_COPY.pendingDate;
  }

  try {
    return new Intl.DateTimeFormat(SCHEDULE_DATE_LOCALE, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  } catch {
    return typeof value === "string" ? value : SCHEDULE_COPY.pendingDate;
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

export function createScheduleWorkspaceSnapshot(
  source: ScheduleWorkspaceSnapshotSource,
): ScheduleWorkspaceSnapshot {
  return {
    createdAt: source.createdAt,
    addressComplete: hasCompleteAddress(source),
    assignedPersonnelCount: countAssignedPersonnel(source),
    hasBetaCapability: source.hasBetaCapability,
    finance: source.finance,
  };
}

function toStartOfWeekISO(): string {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust to Monday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

export function deriveScheduleItems(
  workspace: ScheduleWorkspaceSnapshot,
): readonly WorkspaceScheduleItem[] {
  const items: WorkspaceScheduleItem[] = [
    {
      id: "schedule-onboarding",
      title: "Workspace onboarding",
      timeLabel: getDateLabel(workspace.createdAt),
      startAtISO: workspace.createdAt.toISOString(),
      type: "milestone",
      status: "completed",
      detail: SCHEDULE_COPY.onboardingDetail,
    },
  ];

  if (workspace.finance?.paymentTermStartAtISO) {
    items.push({
      id: "schedule-payment-term",
      title: "Payment term window",
      timeLabel: getDateLabel(workspace.finance.paymentTermStartAtISO),
      startAtISO: workspace.finance.paymentTermStartAtISO,
      type: "milestone",
      status: workspace.finance.paymentReceivedAtISO ? "completed" : "scheduled",
      detail: getPaymentTermDetail(workspace.finance.stage),
    });
  }

  if (workspace.finance?.paymentReceivedAtISO) {
    items.push({
      id: "schedule-payment-received",
      title: "Payment received",
      timeLabel: getDateLabel(workspace.finance.paymentReceivedAtISO),
      startAtISO: workspace.finance.paymentReceivedAtISO,
      type: "milestone",
      status: "completed",
      detail: SCHEDULE_COPY.paymentReceivedDetail,
    });
  }

  if (!workspace.addressComplete || workspace.assignedPersonnelCount < 2) {
    items.push({
      id: "schedule-profile-followup",
      title: "Complete workspace profile",
      timeLabel: SCHEDULE_COPY.profileFollowupTimeLabel,
      startAtISO: null,
      type: "follow-up",
      status: "upcoming",
      detail: SCHEDULE_COPY.profileFollowupDetail,
    });
  }

  if (workspace.hasBetaCapability) {
    items.push({
      id: "schedule-beta-review",
      title: "Beta capability review",
      timeLabel: SCHEDULE_COPY.betaReviewTimeLabel,
      startAtISO: toStartOfWeekISO(),
      type: "maintenance",
      status: "scheduled",
      detail: SCHEDULE_COPY.betaReviewDetail,
    });
  }

  return sortByStatus(items, ["upcoming", "scheduled", "completed"]);
}
