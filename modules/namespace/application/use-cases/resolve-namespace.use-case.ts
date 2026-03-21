/**
 * Module: namespace
 * Layer: application/use-case
 * Purpose: Read-side orchestration for resolving a slug to its Namespace record.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { Namespace, NamespaceKind } from '../../domain/entities/namespace.entity'
import { INamespaceRepository } from '../../domain/repositories/inamespace.repository'

export interface ResolveNamespaceDTO {
  slug: string
  kind: NamespaceKind
}

export class ResolveNamespaceUseCase {
  constructor(private readonly namespaceRepo: INamespaceRepository) {}

  async execute(dto: ResolveNamespaceDTO): Promise<Namespace | null> {
    return this.namespaceRepo.findBySlug(dto.slug, dto.kind)
  }
}
