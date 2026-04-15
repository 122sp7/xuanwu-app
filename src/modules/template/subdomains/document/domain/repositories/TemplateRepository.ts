import { Template } from '../entities/Template';
import { TemplateId } from '../value-objects/TemplateId';

/**
 * TemplateRepository — Domain Repository Interface
 * Abstract persistence contract owned by the domain layer.
 */
export interface TemplateRepository {
  findById(id: TemplateId): Promise<Template | null>;
  save(template: Template): Promise<void>;
  delete(id: TemplateId): Promise<void>;
}
