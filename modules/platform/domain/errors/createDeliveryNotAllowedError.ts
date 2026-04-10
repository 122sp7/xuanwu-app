/**
 * createDeliveryNotAllowedError — Error Factory
 *
 * Creates a typed domain error for the case where an integration delivery
 * or notification dispatch is blocked by policy or contract state.
 *
 * Error fields:
 *   code            — "DELIVERY_NOT_ALLOWED"
 *   deliveryTarget  — the recipient or integration contract reference
 *   blockingReason  — policy rule reference or contract state that caused the block
 *   contextId       — the platform scope
 *
 * @see shared/constants/PlatformErrorCodeConstants.ts
 * @see domain/services/IntegrationCompatibilityService.ts
 * @see domain/services/NotificationRoutingPolicy.ts
 */

// TODO: implement createDeliveryNotAllowedError factory function
