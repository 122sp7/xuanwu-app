export type PolicyEffect = "allow" | "deny";

export function isAllow(effect: PolicyEffect): boolean {
  return effect === "allow";
}
