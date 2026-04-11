/**
 * QStashWorkflowDispatcher — Messaging Adapter (Driven Adapter)
 *
 * Implements: WorkflowDispatcherPort
 * Dispatches workflow triggers via Upstash QStash.
 */

import type { WorkflowDispatcherPort } from "../../domain/ports/output";
import type { PlatformCommandResult } from "../../domain/ports/input";

const QSTASH_ENDPOINT = "https://qstash.upstash.io/v2/publish/";

export class QStashWorkflowDispatcher implements WorkflowDispatcherPort {
constructor(
private readonly workflowBaseUrl: string = process.env.WORKFLOW_BASE_URL ?? "",
private readonly token: string = process.env.QSTASH_TOKEN ?? "",
) {}

async dispatch(triggerKey: string, payload: Record<string, unknown>): Promise<PlatformCommandResult> {
if (!this.workflowBaseUrl || !this.token) {
if (process.env.NODE_ENV !== "production") {
console.warn(
`[QStashWorkflowDispatcher] WORKFLOW_BASE_URL or QSTASH_TOKEN not set. ` +
`Skipping workflow dispatch for key '${triggerKey}'.`,
);
}
return { ok: true, code: "WORKFLOW_DISPATCHED_NOOP", metadata: { triggerKey } };
}

const destinationUrl = `${this.workflowBaseUrl}/api/workflows/${encodeURIComponent(triggerKey)}`;
const response = await fetch(`${QSTASH_ENDPOINT}${encodeURIComponent(destinationUrl)}`, {
method: "POST",
headers: {
Authorization: `Bearer ${this.token}`,
"Content-Type": "application/json",
"Upstash-Retries": "3",
},
body: JSON.stringify({ triggerKey, ...payload }),
});

if (!response.ok) {
const text = await response.text().catch(() => response.statusText);
return { ok: false, code: "WORKFLOW_DISPATCH_FAILED", message: `HTTP ${response.status}: ${text}` };
}

return { ok: true, code: "WORKFLOW_DISPATCHED", metadata: { triggerKey } };
}
}
