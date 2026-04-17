import type { MetricSnapshot, MetricType } from "../../../domain/entities/Metric";
import type { MetricRepository, MetricQuery } from "../../../domain/repositories/MetricRepository";

export class InMemoryMetricRepository implements MetricRepository {
  private readonly store = new Map<string, MetricSnapshot>();

  async save(snapshot: MetricSnapshot): Promise<void> {
    this.store.set(snapshot.id, snapshot);
  }

  async findById(id: string): Promise<MetricSnapshot | null> {
    return this.store.get(id) ?? null;
  }

  async query(params: MetricQuery): Promise<MetricSnapshot[]> {
    let results = Array.from(this.store.values());
    if (params.name) results = results.filter((m) => m.name === params.name);
    if (params.type) results = results.filter((m) => m.type === (params.type as MetricType));
    if (params.workspaceId) results = results.filter((m) => m.workspaceId === params.workspaceId);
    if (params.organizationId) results = results.filter((m) => m.organizationId === params.organizationId);
    if (params.fromDate) results = results.filter((m) => m.timestampISO >= params.fromDate!);
    if (params.toDate) results = results.filter((m) => m.timestampISO <= params.toDate!);
    return results.slice(0, params.limit ?? 1000);
  }

  async sumByName(name: string, params?: MetricQuery): Promise<number> {
    const metrics = await this.query({ ...params, name });
    return metrics.reduce((acc, m) => acc + m.value, 0);
  }

  async avgByName(name: string, params?: MetricQuery): Promise<number> {
    const metrics = await this.query({ ...params, name });
    if (metrics.length === 0) return 0;
    return metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length;
  }
}
