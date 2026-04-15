import type { StartIngestionDTO } from '../../dto/StartIngestionDTO';
import type { IngestionJobResponseDTO } from '../../dto/IngestionJobResponseDTO';

/** StartIngestionPort — Inbound Port for the StartIngestionUseCase. */
export interface StartIngestionPort {
  execute(input: StartIngestionDTO): Promise<IngestionJobResponseDTO>;
}
