/**
 * FirebaseObservabilitySink — Monitoring Adapter (Driven Adapter)
 *
 * Implements: ObservabilitySink
 *
 * Emits observability signals (metrics, traces, alerts) to a monitoring
 * backend (e.g., Google Cloud Monitoring, Datadog, or custom sink).
 *
 * Responsibilities:
 *   - Receive a normalised ObservabilitySignal domain type
 *   - Translate to the provider-specific format
 *   - Emit via configured monitoring SDK
 *
 * Rules:
 *   - Must not expose monitoring provider types outside this file
 *   - Signal enrichment (labels, resource attributes) is handled here
 *
 * @see ports/output/index.ts — ObservabilitySink interface
 * @see subdomains/observability/ — observability subdomain
 */

// TODO: implement FirebaseObservabilitySink
