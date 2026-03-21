/**
 * Upstash — centralised environment variable reference.
 *
 * All Upstash service credentials MUST be read through this config object so
 * that the mapping between env-var names and runtime values is defined in
 * exactly one place.  Individual clients (redis.ts, vector.ts, qstash.ts, etc.)
 * read `process.env` directly for SDK construction, but consumers that need
 * to inspect or forward credentials should use this object.
 */
export const upstashConfig = {
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
  vector: {
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
  },
  search: {
    url: process.env.UPSTASH_SEARCH_REST_URL,
    token: process.env.UPSTASH_SEARCH_REST_TOKEN,
  },
  qstash: {
    token: process.env.QSTASH_TOKEN,
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
  },
  box: {
    apiKey: process.env.UPSTASH_BOX_API_KEY,
  },
} as const;
