import type { StartIngestionPort } from '../ports/inbound/StartIngestionPort';
import type { IngestionRepositoryPort } from '../ports/outbound/IngestionRepositoryPort';
import type { StartIngestionDTO } from '../dto/StartIngestionDTO';
import type { IngestionJobResponseDTO } from '../dto/IngestionJobResponseDTO';
import { IngestionJob } from '../../domain/entities/IngestionJob';
import { IngestionId } from '../../domain/value-objects/IngestionId';
import { IngestionDomainService } from '../../domain/services/IngestionDomainService';

/**
 * StartIngestionUseCase
 * Creates a new IngestionJob and queues it for background processing.
 */
export class StartIngestionUseCase implements StartIngestionPort {
  private readonly domainService = new IngestionDomainService();

  constructor(private readonly repository: IngestionRepositoryPort) {}

  async execute(input: StartIngestionDTO): Promise<IngestionJobResponseDTO> {
    this.domainService.validateSourceUrl(input.sourceUrl);

    const job = IngestionJob.create({
      id: IngestionId.generate(),
      sourceUrl: input.sourceUrl,
    });

    await this.repository.save(job);

    return {
      jobId: job.id.toString(),
      sourceUrl: job.sourceUrl,
      status: job.status,
      createdAt: job.createdAt.toISOString(),
    };
  }
}
