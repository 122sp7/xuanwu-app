import type { AnalyticsEventSnapshot } from "../entities/AnalyticsEvent";

export interface AnalyticsEventQuery {
  readonly name?: string;
  readonly source?: string;
  readonly actorId?: string;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly limit?: number;
  readonly offset?: number;
}

export interface AnalyticsEventRepository {
  save(snapshot: AnalyticsEventSnapshot): Promise<void>;
  findById(id: string): Promise<AnalyticsEventSnapshot | null>;
  query(params: AnalyticsEventQuery): Promise<AnalyticsEventSnapshot[]>;
  countByName(name: string, fromDate?: string, toDate?: string): Promise<number>;
}
