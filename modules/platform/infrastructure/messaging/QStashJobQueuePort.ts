/**
 * QStashJobQueuePort — Messaging Adapter (Driven Adapter)
 *
 * Implements: JobQueuePort
 * Transport:  Upstash QStash job queue
 */

import type { JobQueuePort } from "../../domain/ports/output";
import type { PlatformCommandResult } from "../../domain/ports/input";

const QSTASH_ENDPOINT = "https://qstash.upstash.io/v2/publish/";

export class QStashJobQueuePort implements JobQueuePort {
constructor(
private readonly jobWorkerUrl: string = process.env.JOB_WORKER_URL ?? "",
private readonly token: string = process.env.QSTASH_TOKEN ?? "",
) {}

async enqueue(job: Record<string, unknown>): Promise<PlatformCommandResult> {
const jobType = typeof job.jobType === "string" ? job.jobType : "unknown";

if (!this.jobWorkerUrl || !this.token) {
if (process.env.NODE_ENV !== "production") {
console.warn(
`[QStashJobQueuePort] JOB_WORKER_URL or QSTASH_TOKEN not set. ` +
`Skipping enqueue of job '${jobType}'.`,
);
}
return { ok: true, code: "JOB_ENQUEUED_NOOP", metadata: { jobType } };
}

const destinationUrl = `${this.jobWorkerUrl}/api/jobs/${encodeURIComponent(jobType)}`;
const response = await fetch(`${QSTASH_ENDPOINT}${encodeURIComponent(destinationUrl)}`, {
method: "POST",
headers: {
Authorization: `Bearer ${this.token}`,
"Content-Type": "application/json",
"Upstash-Retries": "3",
},
body: JSON.stringify(job),
});

if (!response.ok) {
const text = await response.text().catch(() => response.statusText);
return { ok: false, code: "JOB_ENQUEUE_FAILED", message: `HTTP ${response.status}: ${text}` };
}

return { ok: true, code: "JOB_ENQUEUED", metadata: { jobType } };
}
}
