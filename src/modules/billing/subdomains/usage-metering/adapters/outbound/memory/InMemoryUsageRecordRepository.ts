import type { UsageRecordSnapshot, UsageUnit } from "../../../domain/entities/UsageRecord";
import type { UsageRecordRepository, UsageQuery } from "../../../domain/repositories/UsageRecordRepository";

export class InMemoryUsageRecordRepository implements UsageRecordRepository {
  private readonly store = new Map<string, UsageRecordSnapshot>();

  async save(snapshot: UsageRecordSnapshot): Promise<void> {
    this.store.set(snapshot.id, snapshot);
  }

  async findById(id: string): Promise<UsageRecordSnapshot | null> {
    return this.store.get(id) ?? null;
  }

  async query(params: UsageQuery): Promise<UsageRecordSnapshot[]> {
    let results = Array.from(this.store.values());
    if (params.contextId) results = results.filter((r) => r.contextId === params.contextId);
    if (params.featureKey) results = results.filter((r) => r.featureKey === params.featureKey);
    if (params.unit) results = results.filter((r) => r.unit === (params.unit as UsageUnit));
    if (params.fromDate) results = results.filter((r) => r.recordedAtISO >= params.fromDate!);
    if (params.toDate) results = results.filter((r) => r.recordedAtISO <= params.toDate!);
    return results.slice(0, params.limit ?? 1000);
  }

  async sumQuantity(featureKey: string, contextId: string, fromDate?: string, toDate?: string): Promise<number> {
    const records = await this.query({ featureKey, contextId, fromDate, toDate });
    return records.reduce((acc, r) => acc + r.quantity, 0);
  }
}
