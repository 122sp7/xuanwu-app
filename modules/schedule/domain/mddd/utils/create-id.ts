// Fallback path is only used where Web Crypto randomUUID is unavailable.
export function createMdddId(prefix: string, scope?: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return scope ? `${prefix}_${scope}_${crypto.randomUUID()}` : `${prefix}_${crypto.randomUUID()}`;
  }

  const random = Math.random().toString(36).slice(2, 10);
  const timestamp = Date.now().toString(36);
  const runtimeEntropy =
    typeof process !== "undefined" ? `${process.pid.toString(36)}_${process.hrtime.bigint().toString(36)}` : "runtime";

  return scope
    ? `${prefix}_${scope}_${timestamp}_${runtimeEntropy}_${random}`
    : `${prefix}_${timestamp}_${runtimeEntropy}_${random}`;
}
