export interface DailyDigestItem {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly type: string;
  readonly read: boolean;
  readonly timestamp: number;
  readonly workspaceId: string | null;
}

export interface DailyDigestSummary {
  readonly total: number;
  readonly unread: number;
}

export interface WorkspaceDailyDigestEntity {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly summary: DailyDigestSummary;
  readonly items: DailyDigestItem[];
}

export interface OrganizationDailyDigestEntity {
  readonly organizationId: string;
  readonly summary: DailyDigestSummary;
  readonly items: DailyDigestItem[];
}
