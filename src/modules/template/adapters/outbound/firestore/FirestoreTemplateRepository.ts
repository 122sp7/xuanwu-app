import type { Template } from '../../../domain/entities/Template';
import type { TemplateId } from '../../../domain/value-objects/TemplateId';
import type { TemplateRepository } from '../../../domain/repositories/TemplateRepository';
import { FirestoreMapper, type TemplateDocument } from './FirestoreMapper';

/**
 * Minimal Firestore client surface required by this repository.
 * Keeps the adapter decoupled from any specific SDK version.
 */
export interface FirestoreLike {
  get(collection: string, id: string): Promise<TemplateDocument | null>;
  set(collection: string, id: string, data: TemplateDocument): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
}

/**
 * Firestore implementation of TemplateRepository.
 */
export class FirestoreTemplateRepository implements TemplateRepository {
  private readonly collection = 'templates';

  constructor(private readonly db: FirestoreLike) {}

  async findById(id: TemplateId): Promise<Template | null> {
    const doc = await this.db.get(this.collection, id.toString());
    return doc ? FirestoreMapper.toDomain(doc) : null;
  }

  async save(template: Template): Promise<void> {
    const doc = FirestoreMapper.toDocument(template);
    await this.db.set(this.collection, doc.id, doc);
  }

  async delete(id: TemplateId): Promise<void> {
    await this.db.delete(this.collection, id.toString());
  }
}
