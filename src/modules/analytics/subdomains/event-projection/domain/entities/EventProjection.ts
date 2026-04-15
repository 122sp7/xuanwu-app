export interface EventProjection {
  readonly id: string;
  readonly name: string;
  readonly filter: Record<string, unknown>;
  readonly aggregation: "count" | "sum" | "avg" | "distinct";
  readonly metricName?: string;
  readonly windowSeconds?: number;
  readonly result?: number;
  readonly computedAtISO?: string;
  readonly createdAtISO: string;
}

export interface EventProjectionRepository {
  save(projection: EventProjection): Promise<void>;
  findById(id: string): Promise<EventProjection | null>;
  findByName(name: string): Promise<EventProjection | null>;
  listAll(): Promise<EventProjection[]>;
}
