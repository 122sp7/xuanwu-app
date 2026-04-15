// entities
export { EntitlementGrant } from './entities/EntitlementGrant';
export type { EntitlementGrantSnapshot, CreateEntitlementGrantInput } from './entities/EntitlementGrant';

// value-objects
export { EntitlementIdSchema, createEntitlementId } from './value-objects/EntitlementId';
export type { EntitlementId } from './value-objects/EntitlementId';
export {
  ENTITLEMENT_STATUSES,
  canSuspend,
  canRevoke,
  isActiveStatus,
} from './value-objects/EntitlementStatus';
export type { EntitlementStatus } from './value-objects/EntitlementStatus';
export { FeatureKeySchema, createFeatureKey } from './value-objects/FeatureKey';
export type { FeatureKey } from './value-objects/FeatureKey';

// events
export type {
  EntitlementGrantDomainEvent,
  EntitlementGrantedEvent,
  EntitlementSuspendedEvent,
  EntitlementRevokedEvent,
  EntitlementExpiredEvent,
  EntitlementGrantDomainEventType,
} from './events/EntitlementGrantDomainEvent';

// repositories
export type { EntitlementGrantRepository } from './repositories/EntitlementGrantRepository';
