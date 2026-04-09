<!-- Purpose: Subdomain scaffold overview for platform 'platform-config'. -->

## Overview

The **platform-config** subdomain owns configuration profile management, dynamic setting updates, and tenant-scoped preference storage for the Xuanwu platform.

### Core Responsibility

- Manage configuration profiles and schemas across workspaces
- Enable dynamic feature toggles and tenant-specific settings
- Persist and retrieve platform configuration state
- Enforce configuration validation and schema compliance

### Key Aggregates

- **ConfigProfile** — Immutable configuration snapshot tied to a workspace/tenant
- **ConfigSchema** — Schema definition for available configuration keys and constraints
- **ConfigValue** — Individual setting entry with type validation

### Bounded Context Map

**Upstream (Depends on):**
- `platform/access-control` — Authorization for config read/write operations
- `platform/platform-flag` — Feature flag integration for conditional config behavior

**Downstream (Depended on by):**
- `workspace` — Applies workspace-scoped configuration profiles
- `notion` — Reads content rendering and collaboration settings
- `notebooklm` — Reads AI model and synthesis configuration

### Cross-Context Contracts

- **Published Event:** `ConfigProfileUpdated` — Emitted when configuration changes
- **API Boundary:** `modules/platform/subdomains/platform-config/api` — Configuration read/write facade
