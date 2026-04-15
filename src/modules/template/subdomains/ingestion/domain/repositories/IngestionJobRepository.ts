import type { IngestionJob } from '../entities/IngestionJob';
import type { IngestionId } from '../value-objects/IngestionId';

/**
 * IngestionJobRepository — Domain Repository Interface
 */
export interface IngestionJobRepository {
  findById(id: IngestionId): Promise<IngestionJob | null>;
  save(job: IngestionJob): Promise<void>;
  delete(id: IngestionId): Promise<void>;
}
