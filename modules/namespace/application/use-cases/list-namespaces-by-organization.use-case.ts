/**
 * Module: namespace
 * Layer: application/use-case
 * Purpose: Read-side orchestration for listing namespaces by organization scope.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { Namespace } from '../../domain/entities/namespace.entity'
import { INamespaceRepository } from '../../domain/repositories/inamespace.repository'

export interface ListNamespacesByOrganizationDTO {
  organizationId: string
}

export class ListNamespacesByOrganizationUseCase {
  constructor(private readonly namespaceRepo: INamespaceRepository) {}

  async execute(dto: ListNamespacesByOrganizationDTO): Promise<Namespace[]> {
    return this.namespaceRepo.findByOrganization(dto.organizationId)
  }
}
