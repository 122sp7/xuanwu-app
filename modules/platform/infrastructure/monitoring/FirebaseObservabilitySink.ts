/**
 * FirebaseObservabilitySink — Monitoring Adapter (Driven Adapter)
 *
 * Implements: ObservabilitySink
 * Emits observability signals as structured console telemetry suitable for
 * Cloud Logging ingestion. Extend with a provider SDK (Datadog, GCM, etc.) as needed.
 */

import type { ObservabilitySink } from "../../domain/ports/output";

export class FirebaseObservabilitySink implements ObservabilitySink {
async emit(signal: Record<string, unknown>): Promise<void> {
const entry = { type: "observability", ...signal, emittedAt: new Date().toISOString() };
if (process.env.NODE_ENV !== "test") {
console.info("[ObservabilitySink]", JSON.stringify(entry));
}
}
}
