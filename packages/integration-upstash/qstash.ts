/**
 * Upstash QStash — message queue client and request receiver.
 *
 * Use qstash to publish messages or manage schedules.
 * Use qstashReceiver to verify incoming QStash webhook signatures in
 * Route Handlers before processing the payload.
 *
 * Environment requirements:
 *   QSTASH_TOKEN                   — publisher / management token
 *   QSTASH_CURRENT_SIGNING_KEY     — current signing key (webhook verification)
 *   QSTASH_NEXT_SIGNING_KEY        — next signing key   (webhook verification)
 */

import "server-only";

import { Client, Receiver } from "@upstash/qstash";

const token = process.env.QSTASH_TOKEN;
const currentSigningKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY;

if (!token) {
  throw new Error("Missing required environment variable: QSTASH_TOKEN must be set.");
}
if (!currentSigningKey || !nextSigningKey) {
  throw new Error(
    "Missing required environment variables: QSTASH_CURRENT_SIGNING_KEY and QSTASH_NEXT_SIGNING_KEY must be set.",
  );
}

/** Publisher / management client. */
export const qstash = new Client({ token });

/** Receiver used to verify incoming QStash webhook signatures. */
export const qstashReceiver = new Receiver({
  currentSigningKey,
  nextSigningKey,
});
