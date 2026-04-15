// ingestion subdomain — application stub
// Add use-cases, DTOs, and ports for source-document ingestion flows here.

export { StartIngestionUseCase } from './use-cases/StartIngestionUseCase';

export type { StartIngestionDTO } from './dto/StartIngestionDTO';
export type { IngestionJobResponseDTO } from './dto/IngestionJobResponseDTO';

export type { StartIngestionPort } from './ports/inbound/StartIngestionPort';
export type { IngestionRepositoryPort } from './ports/outbound/IngestionRepositoryPort';
export type { StoragePort } from './ports/outbound/StoragePort';
