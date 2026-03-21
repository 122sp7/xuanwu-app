# shared-utils

## Purpose

Pure utility functions and app-wide constants. All exports are stateless and safe to import from any layer including domain, application, infrastructure, and UI.

## Belongs to Module

Cross-cutting — used across all modules.

## Public API

### Constants

| Export | Description |
|--------|-------------|
| `APP_NAME` | Application display name |
| `PAGINATION_DEFAULTS` | Default pagination values (`PAGE = 1`, `LIMIT = 20`) |

### Functions

| Export | Description |
|--------|-------------|
| `formatDate(date)` | Format `Date` as ISO date string (re-exported from `@shared-types`) |
| `generateId()` | Generate a UUID v4 string (re-exported from `@shared-types`) |

## Dependencies

- `@shared-types` — for `formatDate` and `generateId`

## Example

```typescript
import { APP_NAME, PAGINATION_DEFAULTS, formatDate } from "@shared-utils";

console.log(APP_NAME); // "Xuanwu App"
const { PAGE, LIMIT } = PAGINATION_DEFAULTS;
const dateStr = formatDate(new Date()); // "2025-01-15"
```

## Rules

- Do not add stateful code (React hooks, stores) to this package — use `@shared-hooks` instead
- Do not add Zod validators — use `@shared-validators` instead
- All functions must be pure (no side effects)
