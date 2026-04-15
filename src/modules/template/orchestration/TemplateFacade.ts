import type { CreateTemplateUseCase } from '../subdomains/document/application/use-cases/CreateTemplateUseCase';
import type { UpdateTemplateUseCase } from '../subdomains/document/application/use-cases/UpdateTemplateUseCase';
import type { DeleteTemplateUseCase } from '../subdomains/document/application/use-cases/DeleteTemplateUseCase';
import type { CreateTemplateDTO } from '../subdomains/document/application/dto/CreateTemplateDTO';
import type { UpdateTemplateDTO } from '../subdomains/document/application/dto/UpdateTemplateDTO';
import type { TemplateResponseDTO } from '../subdomains/document/application/dto/TemplateResponseDTO';

/**
 * TemplateFacade
 *
 * Unified public entry point for the template module.
 * Delegates each operation to the owning subdomain use case.
 * External callers (Server Actions, controllers, other modules) should
 * depend on this facade rather than individual use cases.
 *
 * Add new methods here as new subdomains activate.
 */
export class TemplateFacade {
  constructor(
    private readonly create: CreateTemplateUseCase,
    private readonly update: UpdateTemplateUseCase,
    private readonly remove: DeleteTemplateUseCase,
  ) {}

  createTemplate(input: CreateTemplateDTO): Promise<TemplateResponseDTO> {
    return this.create.execute(input);
  }

  updateTemplate(input: UpdateTemplateDTO): Promise<TemplateResponseDTO> {
    return this.update.execute(input);
  }

  deleteTemplate(id: string): Promise<void> {
    return this.remove.execute(id);
  }
}
