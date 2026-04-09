/**
 * createEntitlementDeniedError — Error Factory
 *
 * Creates a typed domain error for the case where a capability action
 * is rejected because current entitlements do not permit it.
 *
 * Error fields:
 *   code       — "ENTITLEMENT_DENIED" (from PlatformErrorCodeConstants)
 *   capabilityKey — the capability that was denied
 *   planCode      — the current plan code at time of denial
 *   contextId     — the platform scope where denial occurred
 *
 * @see shared/constants/PlatformErrorCodeConstants.ts
 * @see domain/services/CapabilityEntitlementPolicy.ts
 */

// TODO: implement createEntitlementDeniedError factory function
