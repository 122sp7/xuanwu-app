// use-cases
export {
  GrantEntitlementUseCase,
  SuspendEntitlementUseCase,
  RevokeEntitlementUseCase,
  ResolveEntitlementsUseCase,
  CheckFeatureEntitlementUseCase,
} from './use-cases/EntitlementUseCases';

// dto
export type { EntitlementGrantView, EntitlementSignal } from './dto/EntitlementDTO';

// ports outbound
export type { EntitlementRepositoryPort } from './ports/outbound/EntitlementRepositoryPort';
