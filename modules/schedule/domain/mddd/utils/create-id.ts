let fallbackCounter = 0;

// Fallback path is only used where Web Crypto randomUUID is unavailable.
// In those environments this process-local counter adds entropy alongside time/random.
export function createMdddId(prefix: string, scope?: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return scope ? `${prefix}_${scope}_${crypto.randomUUID()}` : `${prefix}_${crypto.randomUUID()}`;
  }

  fallbackCounter += 1;
  const random = Math.random().toString(36).slice(2, 10);
  const timestamp = Date.now().toString(36);
  const counter = fallbackCounter.toString(36);

  return scope
    ? `${prefix}_${scope}_${timestamp}_${counter}_${random}`
    : `${prefix}_${timestamp}_${counter}_${random}`;
}
