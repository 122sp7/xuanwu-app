import type { GeneratedTemplate } from '../entities/GeneratedTemplate';
import type { GenerationId } from '../value-objects/GenerationId';

/**
 * GenerationRepository — Domain Repository Interface
 * Abstract persistence contract for GeneratedTemplate aggregates.
 */
export interface GenerationRepository {
  findById(id: GenerationId): Promise<GeneratedTemplate | null>;
  save(generated: GeneratedTemplate): Promise<void>;
  delete(id: GenerationId): Promise<void>;
}
