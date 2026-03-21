# integration-http

## Purpose

Axios-based HTTP client integration for calling external APIs. Provides a singleton Axios instance with pre-configured base URL, timeout, headers, and interceptors for authentication and error handling.

## Belongs to Module

Infrastructure — used by modules that need to call external REST APIs.

## Public API

| Export | Description |
|--------|-------------|
| `httpClient` | Pre-configured Axios instance |

### Configuration

| Setting | Value |
|---------|-------|
| Base URL | `NEXT_PUBLIC_API_BASE_URL` env var, or `/api` |
| Timeout | 10 seconds |
| Content-Type | `application/json` |

## Dependencies

- `axios` — HTTP client library

## Example

```typescript
import { httpClient } from "@integration-http";

const response = await httpClient.get<User[]>("/users");
const user = await httpClient.post<User>("/users", { name: "Alice" });
```

## Rules

- Do not configure additional Axios instances — use this singleton
- Auth token attachment is handled in the request interceptor
- For Firebase/Firestore operations, use `@integration-firebase` instead
