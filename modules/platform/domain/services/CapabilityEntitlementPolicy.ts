/**
 * CapabilityEntitlementPolicy — Domain Service
 *
 * Evaluates whether a platform capability can be activated given the
 * current SubscriptionAgreement entitlements.
 *
 * Inputs:  PlatformCapability, SubscriptionAgreement
 * Returns: DeliveryAllowance | PlanConstraint (never a loose boolean)
 *
 * Cross-aggregate rule: spans PlatformContext and SubscriptionAgreement.
 * Stateless — all inputs supplied by application service via output ports.
 *
 * @see docs/domain-services.md — Domain Services 清單
 */

// TODO: implement CapabilityEntitlementPolicy domain service
