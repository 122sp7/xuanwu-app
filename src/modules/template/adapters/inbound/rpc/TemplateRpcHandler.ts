import type { CreateTemplateUseCase } from '../../../application/use-cases/CreateTemplateUseCase';
import type { UpdateTemplateUseCase } from '../../../application/use-cases/UpdateTemplateUseCase';
import type { DeleteTemplateUseCase } from '../../../application/use-cases/DeleteTemplateUseCase';
import type { CreateTemplateDTO } from '../../../application/dto/CreateTemplateDTO';
import type { UpdateTemplateDTO } from '../../../application/dto/UpdateTemplateDTO';

/**
 * RPC inbound adapter — exposes use cases as procedure handlers
 * (e.g. tRPC procedures, Firebase callables).
 */
export class TemplateRpcHandler {
  constructor(
    private readonly createUC: CreateTemplateUseCase,
    private readonly updateUC: UpdateTemplateUseCase,
    private readonly deleteUC: DeleteTemplateUseCase,
  ) {}

  createTemplate(input: CreateTemplateDTO) {
    return this.createUC.execute(input);
  }

  updateTemplate(input: UpdateTemplateDTO) {
    return this.updateUC.execute(input);
  }

  deleteTemplate(input: { id: string }) {
    return this.deleteUC.execute(input.id);
  }
}
