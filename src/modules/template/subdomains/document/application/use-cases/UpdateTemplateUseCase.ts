import { TemplateId } from '../../domain/value-objects/TemplateId';
import { TemplateName } from '../../domain/value-objects/TemplateName';
import type { UpdateTemplateDTO } from '../dto/UpdateTemplateDTO';
import type { TemplateResponseDTO } from '../dto/TemplateResponseDTO';
import type { TemplateRepositoryPort } from '../ports/outbound/TemplateRepositoryPort';

/**
 * Use case: Update a Template aggregate.
 */
export class UpdateTemplateUseCase {
  constructor(private readonly repository: TemplateRepositoryPort) {}

  async execute(input: UpdateTemplateDTO): Promise<TemplateResponseDTO> {
    const id = TemplateId.create(input.id);
    const template = await this.repository.findById(id);
    if (!template) {
      throw new Error(`Template not found: ${input.id}`);
    }

    if (input.name !== undefined) {
      template.rename(TemplateName.create(input.name));
    }
    if (input.description !== undefined) {
      template.changeDescription(input.description);
    }

    await this.repository.save(template);

    return {
      id: template.id.toString(),
      name: template.name.toString(),
      description: template.description,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    };
  }
}
