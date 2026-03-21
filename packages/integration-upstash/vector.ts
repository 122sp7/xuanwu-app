/**
 * Upstash Vector — index client.
 *
 * HTTP/REST-based vector database for semantic similarity search, RAG
 * pipelines, and embedding-based retrieval.
 *
 * Environment requirements:
 *   UPSTASH_VECTOR_REST_URL   — REST endpoint
 *   UPSTASH_VECTOR_REST_TOKEN — bearer token
 */

import "server-only";

import { Index } from "@upstash/vector";

function getVectorConfig() {
  const url = process.env.UPSTASH_VECTOR_REST_URL;
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN;
  if (!url || !token) {
    throw new Error(
      "Missing required environment variables: UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN must be set.",
    );
  }
  return { url, token };
}

/**
 * Returns a typed Index instance for the Upstash Vector database.
 * Pass a metadata type parameter for type-safe upsert / query operations.
 */
export function vectorIndex<
  Metadata extends Record<string, unknown> = Record<string, unknown>,
>() {
  return new Index<Metadata>(getVectorConfig());
}
