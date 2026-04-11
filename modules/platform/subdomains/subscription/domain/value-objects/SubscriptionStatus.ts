export const SUBSCRIPTION_STATUSES = [
  "trialing",
  "active",
  "past_due",
  "cancelled",
  "expired",
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export function canCancel(status: SubscriptionStatus): boolean {
  return status === "active" || status === "trialing" || status === "past_due";
}

export function canRenew(status: SubscriptionStatus): boolean {
  return status === "active" || status === "past_due";
}

export function isActive(status: SubscriptionStatus): boolean {
  return status === "active" || status === "trialing";
}
