/**
 * SubscriptionService — Backward-compatibility re-export shim.
 *
 * Composition logic has been relocated to
 * interfaces/composition/subscription-service.ts to fix the
 * infrastructure → application dependency direction violation.
 */
export { subscriptionService } from "../interfaces/composition/subscription-service";
