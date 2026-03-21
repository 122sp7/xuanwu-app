/**
 * Module: namespace
 * Layer: interfaces/api
 * Purpose: HTTP/controller facade delegating all namespace actions to the application layer.
 * Dependency Direction: interfaces -> application -> domain <- infrastructure
 */
import { RegisterNamespaceDTO, RegisterNamespaceUseCase } from '../../application/use-cases/register-namespace.use-case'
import { ResolveNamespaceDTO, ResolveNamespaceUseCase } from '../../application/use-cases/resolve-namespace.use-case'

export class NamespaceController {
  constructor(
    private readonly registerNamespace: RegisterNamespaceUseCase,
    private readonly resolveNamespace: ResolveNamespaceUseCase,
  ) {}

  async register(input: RegisterNamespaceDTO) {
    return this.registerNamespace.execute(input)
  }

  async resolve(input: ResolveNamespaceDTO) {
    return this.resolveNamespace.execute(input)
  }
}
