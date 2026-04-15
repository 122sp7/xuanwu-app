import type { MetricSnapshot, MetricType } from "../entities/Metric";

export interface MetricQuery {
  readonly name?: string;
  readonly type?: MetricType;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly limit?: number;
}

export interface MetricRepository {
  save(snapshot: MetricSnapshot): Promise<void>;
  findById(id: string): Promise<MetricSnapshot | null>;
  query(params: MetricQuery): Promise<MetricSnapshot[]>;
  sumByName(name: string, params?: MetricQuery): Promise<number>;
  avgByName(name: string, params?: MetricQuery): Promise<number>;
}
