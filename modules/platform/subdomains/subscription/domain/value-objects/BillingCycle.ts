export type BillingCycle = "monthly" | "annual" | "lifetime";

export function cycleMonths(cycle: BillingCycle): number | null {
  if (cycle === "monthly") return 1;
  if (cycle === "annual") return 12;
  return null; // lifetime
}
