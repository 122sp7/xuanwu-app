<!-- Purpose: Subdomain scaffold overview for platform 'integration'. -->

## Overview

The **integration** subdomain handles external system collaboration boundaries and cross-platform data synchronization within the platform domain.

### Core Responsibilities

- Define and manage integration contracts with third-party systems
- Route integration requests and coordinate external API calls
- Transform external data models into internal domain representations
- Track integration health, rate limits, and error states
- Manage OAuth/API key credentials and secret rotation
- Publish integration events for downstream subscribers

### Key Aggregates

- **Integration** — Integration configuration, status, and metadata
- **IntegrationCredential** — Encrypted secrets and authentication details
- **IntegrationSync** — Synchronization state and last-sync timestamp
- **IntegrationError** — Integration failure records and retry logic

### Bounded Context Map

| Upstream | Relationship | Downstream |
|----------|--------------|-----------|
| `platform:content` | Publishes content updates for external sync | — |
| `platform:notification` | Subscribes to integration events | — |
| `notion:*` | Supplies knowledge models for external export | — |
| `notebooklm:*` | Supplies conversation data for external sync | — |

### API Boundary

Cross-module access via `modules/platform/subdomains/integration/api`:

```typescript
// ✅ Correct
import { FindIntegrationUseCase } from '@/modules/platform/subdomains/integration/api';

// ❌ Avoid
import { FindIntegrationUseCase } from '@/modules/platform/subdomains/integration/application/use-cases/find-integration';
```

### Related Documentation

- [`ubiquitous-language.md`](./ubiquitous-language.md) — Integration terminology
- [`aggregates.md`](./aggregates.md) — Aggregate root definitions
- [`domain-events.md`](./domain-events.md) — Integration domain events
- [`repositories.md`](./repositories.md) — Repository contracts
- [`application-services.md`](./application-services.md) — Use cases
- [`context-map.md`](./context-map.md) — Cross-context boundaries
