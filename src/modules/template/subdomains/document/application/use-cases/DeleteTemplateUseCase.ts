import { TemplateId } from '../../domain/value-objects/TemplateId';
import type { TemplateRepositoryPort } from '../ports/outbound/TemplateRepositoryPort';

/**
 * Use case: Delete a Template aggregate by id.
 */
export class DeleteTemplateUseCase {
  constructor(private readonly repository: TemplateRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const templateId = TemplateId.create(id);
    await this.repository.delete(templateId);
  }
}
