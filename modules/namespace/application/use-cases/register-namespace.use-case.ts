/**
 * Module: namespace
 * Layer: application/use-case
 * Purpose: Write-side orchestration for registering a new namespace slug.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { Namespace, NamespaceKind } from '../../domain/entities/namespace.entity'
import { NamespaceSlug } from '../../domain/value-objects/namespace-slug.vo'
import { INamespaceRepository } from '../../domain/repositories/inamespace.repository'

export interface RegisterNamespaceDTO {
  id: string
  slug: string
  kind: NamespaceKind
  ownerAccountId: string
  organizationId: string
}

export class RegisterNamespaceUseCase {
  constructor(private readonly namespaceRepo: INamespaceRepository) {}

  async execute(dto: RegisterNamespaceDTO): Promise<Namespace> {
    const slug = NamespaceSlug.create(dto.slug)

    const existing = await this.namespaceRepo.existsBySlug(slug.value, dto.kind)
    if (existing) {
      throw new Error(`Namespace slug "${slug.value}" is already taken for kind "${dto.kind}"`)
    }

    const namespace = new Namespace(
      dto.id,
      slug,
      dto.kind,
      dto.ownerAccountId,
      dto.organizationId,
      'active',
      new Date(),
      new Date(),
    )

    await this.namespaceRepo.save(namespace)
    return namespace
  }
}
