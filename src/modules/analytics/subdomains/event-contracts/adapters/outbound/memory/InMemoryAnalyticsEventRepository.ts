import type { AnalyticsEventSnapshot } from "../../../domain/entities/AnalyticsEvent";
import type {
  AnalyticsEventRepository,
  AnalyticsEventQuery,
} from "../../../domain/repositories/AnalyticsEventRepository";

export class InMemoryAnalyticsEventRepository implements AnalyticsEventRepository {
  private readonly store = new Map<string, AnalyticsEventSnapshot>();

  async save(snapshot: AnalyticsEventSnapshot): Promise<void> {
    this.store.set(snapshot.id, snapshot);
  }

  async findById(id: string): Promise<AnalyticsEventSnapshot | null> {
    return this.store.get(id) ?? null;
  }

  async query(params: AnalyticsEventQuery): Promise<AnalyticsEventSnapshot[]> {
    let results = Array.from(this.store.values());
    if (params.name) results = results.filter((e) => e.name === params.name);
    if (params.source) results = results.filter((e) => e.source === params.source);
    if (params.actorId) results = results.filter((e) => e.actorId === params.actorId);
    if (params.workspaceId) results = results.filter((e) => e.workspaceId === params.workspaceId);
    if (params.organizationId) results = results.filter((e) => e.organizationId === params.organizationId);
    if (params.fromDate) results = results.filter((e) => e.occurredAt >= params.fromDate!);
    if (params.toDate) results = results.filter((e) => e.occurredAt <= params.toDate!);
    const offset = params.offset ?? 0;
    const limit = params.limit ?? 100;
    return results.slice(offset, offset + limit);
  }

  async countByName(name: string, fromDate?: string, toDate?: string): Promise<number> {
    return (await this.query({ name, fromDate, toDate, limit: 100000 })).length;
  }
}
