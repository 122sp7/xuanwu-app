/**
 * Upstash Redis — singleton client.
 *
 * HTTP/REST-based Redis client optimised for serverless and edge runtimes.
 * Safe to import from Server Components, Server Actions, Route Handlers,
 * and Cloud Functions.
 *
 * Environment requirements:
 *   UPSTASH_REDIS_REST_URL   — REST endpoint
 *   UPSTASH_REDIS_REST_TOKEN — bearer token
 */

import "server-only";

import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  throw new Error(
    "Missing required environment variables: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set.",
  );
}

export const redis = new Redis({ url, token });
