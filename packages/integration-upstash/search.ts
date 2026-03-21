/**
 * Upstash Search — AI-powered full-text + semantic search client.
 *
 * HTTP/REST-based search service that combines full-text and semantic
 * search capabilities over named indexes.  Built on top of Upstash Vector,
 * it handles embedding, indexing, and retrieval automatically.
 *
 * Environment requirements:
 *   UPSTASH_SEARCH_REST_URL   — REST endpoint (e.g. https://...upstash.io)
 *   UPSTASH_SEARCH_REST_TOKEN — bearer token
 *
 * Usage — create a typed index and search:
 *   import { search } from "@integration-upstash";
 *
 *   type DocContent = { title: string; body: string };
 *   type DocMeta    = { module: string; status: string };
 *
 *   const idx = search.index<DocContent, DocMeta>("wiki-docs");
 *   await idx.upsert({ id: "doc-1", content: { title: "…", body: "…" }, metadata: { module: "wiki", status: "ready" } });
 *   const results = await idx.search({ query: "how to reset password", limit: 10 });
 *
 * Usage — list all indexes:
 *   const indexes = await search.listIndexes();
 */

import "server-only";

import { Search } from "@upstash/search";

/** Singleton Search client backed by env-based credentials. */
export const search = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL!,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN!,
});
