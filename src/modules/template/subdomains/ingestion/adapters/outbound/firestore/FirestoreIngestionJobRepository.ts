import type { IngestionJobRepository } from '../../../domain/repositories/IngestionJobRepository';
import type { IngestionId } from '../../../domain/value-objects/IngestionId';
import { IngestionJob } from '../../../domain/entities/IngestionJob';

interface FirestoreLike {
  get(path: string): Promise<Record<string, unknown> | null>;
  set(path: string, data: Record<string, unknown>): Promise<void>;
  delete(path: string): Promise<void>;
}

const toData = (job: IngestionJob): Record<string, unknown> => ({
  id: job.id.toString(),
  sourceUrl: job.sourceUrl,
  status: job.status,
  createdAt: job.createdAt.toISOString(),
  completedAt: job.completedAt?.toISOString() ?? null,
});

const COLLECTION = 'ingestion_jobs';

/**
 * FirestoreIngestionJobRepository — Outbound Firestore Adapter
 */
export class FirestoreIngestionJobRepository implements IngestionJobRepository {
  constructor(private readonly db: FirestoreLike) {}

  async findById(id: IngestionId): Promise<IngestionJob | null> {
    const data = await this.db.get(`${COLLECTION}/${id.toString()}`);
    if (!data) return null;
    return IngestionJob.create({
      id,
      sourceUrl: data['sourceUrl'] as string,
    });
  }

  async save(job: IngestionJob): Promise<void> {
    await this.db.set(`${COLLECTION}/${job.id.toString()}`, toData(job));
  }

  async delete(id: IngestionId): Promise<void> {
    await this.db.delete(`${COLLECTION}/${id.toString()}`);
  }
}
