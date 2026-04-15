import type { CreateTemplateUseCase } from '../../../application/use-cases/CreateTemplateUseCase';
import type { UpdateTemplateUseCase } from '../../../application/use-cases/UpdateTemplateUseCase';
import type { DeleteTemplateUseCase } from '../../../application/use-cases/DeleteTemplateUseCase';
import type { CreateTemplateDTO } from '../../../application/dto/CreateTemplateDTO';
import type { UpdateTemplateDTO } from '../../../application/dto/UpdateTemplateDTO';

/**
 * HTTP inbound adapter — translates HTTP requests into application calls.
 */
export class TemplateController {
  constructor(
    private readonly createUC: CreateTemplateUseCase,
    private readonly updateUC: UpdateTemplateUseCase,
    private readonly deleteUC: DeleteTemplateUseCase,
  ) {}

  async create(body: CreateTemplateDTO) {
    return this.createUC.execute(body);
  }

  async update(body: UpdateTemplateDTO) {
    return this.updateUC.execute(body);
  }

  async delete(id: string) {
    await this.deleteUC.execute(id);
    return { success: true };
  }
}
