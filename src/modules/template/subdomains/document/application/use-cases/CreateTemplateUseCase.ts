import { Template } from '../../domain/entities/Template';
import { TemplateName } from '../../domain/value-objects/TemplateName';
import type { CreateTemplateDTO } from '../dto/CreateTemplateDTO';
import type { TemplateResponseDTO } from '../dto/TemplateResponseDTO';
import type { CreateTemplatePort } from '../ports/inbound/CreateTemplatePort';
import type { TemplateRepositoryPort } from '../ports/outbound/TemplateRepositoryPort';

/**
 * Use case: Create a new Template aggregate and persist it.
 */
export class CreateTemplateUseCase implements CreateTemplatePort {
  constructor(private readonly repository: TemplateRepositoryPort) {}

  async execute(input: CreateTemplateDTO): Promise<TemplateResponseDTO> {
    const name = TemplateName.create(input.name);
    const template = Template.create({
      name,
      description: input.description,
    });

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
