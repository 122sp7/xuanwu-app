# integration-upstash

## Purpose

Upstash cloud services integration package. Provides a single import path for Redis caching, vector similarity search (RAG), durable message queues (QStash), serverless workflows, and AI agent sandboxes.

## Belongs to Module

Infrastructure — used by modules that require caching, semantic search, or async job processing.

## Public API

| Export | Description |
|--------|-------------|
| `redis` | Upstash Redis client for key/value caching |
| `vectorIndex` | Upstash Vector index for semantic similarity search |
| `qstash` | QStash HTTP message queue client |
| `qstashReceiver` | QStash receiver for verifying incoming messages |
| `serve` | Upstash Workflow serve handler |
| `WorkflowClient` | Workflow client class |
| `workflowClient` | Singleton workflow client instance |
| `Box` | AI agent sandbox class |
| `Agent` | Agent configuration type |
| `ClaudeCode` | Claude code agent helper |
| `createBox` | Factory for creating sandboxed execution boxes |
| `BoxConfig` | Box configuration interface |

## Dependencies

- `@upstash/redis`
- `@upstash/vector`
- `@upstash/qstash`
- `@upstash/workflow`
- `libs/upstash/*` — internal client wrappers (do not import directly)

## Example

```typescript
import { redis, vectorIndex } from "@integration-upstash";

// Cache lookup
const cached = await redis.get("my-key");

// Semantic search
const results = await vectorIndex.query({
  vector: embeddingVector,
  topK: 5,
});
```

## Rules

- Server-only — do not import in Client Components
- Do not import `libs/upstash/*` directly — always use `@integration-upstash`
- Requires environment variables: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, etc.
