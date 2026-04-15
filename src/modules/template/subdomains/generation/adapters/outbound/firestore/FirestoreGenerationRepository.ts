import { GeneratedTemplate } from '../../../domain/entities/GeneratedTemplate';
import { GenerationId } from '../../../domain/value-objects/GenerationId';
import type { GenerationRepository } from '../../../domain/repositories/GenerationRepository';

/**
 * Minimal Firestore-compatible interface used to keep this adapter
 * free from direct Firebase SDK imports.
 * The real Firestore client satisfies this shape at runtime.
 */
interface FirestoreLike {
  get<T>(path: string): Promise<T | null>;
  set<T>(path: string, data: T): Promise<void>;
  delete(path: string): Promise<void>;
}

/**
 * FirestoreGenerationRepository
 * Outbound adapter that implements GenerationRepository using Firestore.
 */
export class FirestoreGenerationRepository implements GenerationRepository {
  private readonly collection = 'generated_templates';

  constructor(private readonly db: FirestoreLike) {}

  async findById(id: GenerationId): Promise<GeneratedTemplate | null> {
    const raw = await this.db.get<GeneratedTemplateDoc>(
      `${this.collection}/${id.toString()}`,
    );
    if (!raw) return null;
    return GenerationMapper.toDomain(raw);
  }

  async save(generated: GeneratedTemplate): Promise<void> {
    await this.db.set(
      `${this.collection}/${generated.id.toString()}`,
      GenerationMapper.toPersistence(generated),
    );
  }

  async delete(id: GenerationId): Promise<void> {
    await this.db.delete(`${this.collection}/${id.toString()}`);
  }
}

/**
 * Persistence document shape (Firestore document).
 */
export interface GeneratedTemplateDoc {
  id: string;
  sourceTemplateId: string;
  content: string;
  createdAt: string;
}

/**
 * GenerationMapper — maps between domain and persistence representations.
 */
export const GenerationMapper = {
  toPersistence(entity: GeneratedTemplate): GeneratedTemplateDoc {
    return {
      id: entity.id.toString(),
      sourceTemplateId: entity.sourceTemplateId,
      content: entity.content,
      createdAt: entity.createdAt.toISOString(),
    };
  },

  toDomain(doc: GeneratedTemplateDoc): GeneratedTemplate {
    return GeneratedTemplate.create({
      id: GenerationId.create(doc.id),
      sourceTemplateId: doc.sourceTemplateId,
      content: doc.content,
    });
  },
};
