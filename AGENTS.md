# API Architecture Rules

## NotionAPI & NotebookLMAPI

platform 是跨域能力中樞，must expose two API layers:

### 1. Infrastructure API (低階 / 模組內用)

**所有權**: platform  
**消費者**: notion、notebooklm (only)  
**用途**: Runtime capability contracts（不含業務決策）  

```typescript
// Firestore access contract
export interface FirestoreAPI {
  get<T>(path: string): Promise<T | null>;
  set<T>(path: string, data: T): Promise<void>;
  query<T>(collection: string, where: Query[]): Promise<T[]>;
}

// Cloud Storage access contract
export interface StorageAPI {
  upload(file: File, path: string): Promise<string>;
  getUrl(path: string): Promise<string>;
  delete(path: string): Promise<void>;
}

// Genkit AI flow orchestration contract
export interface GenkitAPI {
  runFlow<TInput, TOutput>(
    flow: string,
    input: TInput
  ): Promise<TOutput>;
}
```

**Rule**: notion、notebooklm use these for **data persistence and external tool invocation only**. No business logic should hide inside adapter calls.

---

### 2. Platform Service API (高階 / 系統級用)

**所有權**: platform  
**消費者**: workspace、notion、notebooklm (all)  
**用途**: Cross-domain capability contracts（含governance、auth、entitlement）  

```typescript
// Authentication & Session
export interface AuthAPI {
  getSession(): Promise<AuthSession>;
  requireAuth(): Promise<User>;
}

// Access Control & Entitlement
export interface PermissionAPI {
  can(userId: string, action: string, resource: string): Promise<boolean>;
}

// Semantic File Lifecycle (not raw storage)
export interface FileAPI {
  uploadUserFile(input: {
    file: File;
    ownerId: string;
  }): Promise<{ url: string; fileId: string }>;
  deleteFile(fileId: string): Promise<void>;
}

// AI capability coordination (routing & safety)
export interface AIAPI {
  summarize(text: string): Promise<string>;
  // More methods as capabilities expand
}
```

**Rule**: All modules (including notion、notebooklm) must go through Service APIs for cross-domain operations.

---

## API Call Rules

| Caller | Firestore | Storage | Genkit | Auth | Permission | File | AI |
|--------|-----------|---------|--------|------|------------|------|-----|
| workspace | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| notion | ✅ | ✅ | ✅ | ✅ | ✅ | ✅* | ✅ |
| notebooklm | ✅ | ✅ | ✅ | ✅ | ✅ | ✅* | ✅ |

**\* File API**: notion、notebooklm must use `FileAPI` (not raw `StorageAPI`) when files involve ownership, entitlement, or multi-tenant isolation.

---

## Example Flow: File Upload with Entitlement Check

```text
workspace (UI)
  → FileAPI.uploadUserFile({ file, ownerId })
  ↓
platform (FileAPI)
  → PermissionAPI.can(ownerId, "create:file", context)
  ↓
notion.createDocument(with fileId)
  → Storage.upload(...) via Infrastructure API
  ↓
Firebase Storage
```

**Key**: uploadUserFile ≠ Storage.upload
- `uploadUserFile`: semantic contract (ownership, entitlement, audit)
- `Storage.upload`: mechanism contract (how bytes move)

---

## Governance Rules

1. **platform is the unique infra gateway** — all Firebase, Genkit, external AI routing flows through platform adapters.
2. **notion、notebooklm use Infrastructure APIs for local concerns only** — persistence, embedding, synthesis.
3. **workspace never touches Infrastructure APIs** — always goes through Platform Service APIs.
4. **All cross-domain behavior routes through Platform Service APIs** — auth, permission, entitlement, file ownership, AI safety.
5. **Published Language is upstream boundary** — concepts like `Actor`, `Tenant`, `Entitlement`, `fileId` are defined in platform ubiquitous language; downstream contexts translate as needed.

---

# Strategic Domain Overview

## Strategic Overview

This repo now follows the eight-context baseline defined in the root docs:
- `iam` — identity, authentication, authorization, tenant isolation
- `billing` — subscription and entitlement governance
- `ai` — shared AI capability, routing, policy, safety
- `analytics` — metrics, dashboards, projections
- `platform` — account, organization, shared operational services
- `workspace` — collaboration scope and lifecycle
- `notion` — canonical knowledge content
- `notebooklm` — retrieval, grounding, synthesis, evaluation

Use `docs/README.md`, `docs/bounded-contexts.md`, and `docs/ubiquitous-language.md` as the strategic authority when ownership is ambiguous.

---

## Dependency Direction Rules

### Fixed Upstream → Downstream Flow

```
platform
  ↓
workspace, notion, notebooklm (all consume platform governance APIs)
  ↓
workspace ↓ notion ↓ notebooklm
(sequential consumption allowed; never reverse upstream)
```

### Anti-Patterns

- ❌ workspace calling notion.api directly (must go through published language)
- ❌ notion calling platform.domain internal models (must use Service API boundary)
- ❌ notebooklm defining its own `ai` subdomain (belongs exclusively to ai)
- ❌ Mixing Actor + Membership terminology (Actor = identity, Membership = workspace participation)
- ❌ Treating notion's KnowledgeArtifact as writable by other domains (reference only)

---

## Module Ownership Guardrails

| Concern | Owner | Never Owned By |
|---|---|---|
| Identity, authentication, session | iam | workspace, notion, notebooklm |
| Permission, access control | iam | workspace, notion, notebooklm |
| Tenant isolation | iam | workspace, notion, notebooklm |
| Organization scope | platform | workspace, notion, notebooklm |
| AI capability routing, model policy, safety | ai | notion, notebooklm (consumers only) |
| Workspace creation, archival, lifecycle | workspace | notion, notebooklm, platform |
| Knowledge artifact authoring, versioning | notion | platform, workspace, notebooklm |
| Conversation, retrieval, synthesis | notebooklm | platform, workspace, notion (notion→notebooklm: reference only) |
| Cross-module security rules, audit | platform | all others apply, never contradict |

---

# 🚫 Hard Rules (Will Cause Refactors If Violated)

## Strategic Ownership Rules (Non-Negotiable)

### Rule 1: Platform is Unique Infrastructure Gateway
- ✅ platform owns Firebase, Genkit, external AI routing, cross-domain auth
- ❌ notion, notebooklm NEVER own infra (except local read-only access)
- ❌ workspace NEVER touches Firebase/Storage/Genkit directly

### Rule 5: Workspace is Orchestration Only
- ✅ workspace composes module APIs and next.js routing
- ❌ workspace NEVER contains domain business logic
- ❌ workspace NEVER makes direct DB/permission decisions

### Rule 6: Cross-Module Access Prohibition
- ✅ module A imports module B only via `@/modules/b/index.ts`
- ❌ NO direct imports of domain/, application/, infrastructure/, interfaces/
- ✅ ALL data sharing via events or published language tokens

### Rule 7: Mandatory Single Entry Point (Public Boundary)
- ✅ Every module must export through `index.ts` at module root
- ✅ `index.ts` exposes only public surface; hides internals
- ❌ NO imports from internal module paths outside module

### Rule 8: Platform is Only Infrastructure Layer
- ✅ Firebase, Genkit, Auth, File Storage, Queue: platform owns
- ✅ Cross-domain coordination, routing, governance: platform owns
- ❌ Notion NEVER owns persistence (uses platform.infrastructure APIs)
- ❌ Notebooklm NEVER owns embedding infra (uses platform.infrastructure APIs)

### Rule 9: Cross-Module Data Flow MUST Use Events or API
- ✅ When module A needs data from module B: A calls `@/modules/b` (index.ts public boundary) or subscribes to B.event
- ❌ NO shared in-memory state
- ❌ NO direct repository access across module boundaries
- ✅ All state mutations via transaction-protected API calls

### Rule 10: Domain Layer is Externally Independent
- ✅ domain/ contains entities, value objects, rules; NO framework deps
- ❌ domain/ NEVER imports: React, Firebase SDK, HTTP client, ORM
- ❌ domain/ NEVER depends on other modules (even platform)
- ✅ All external deps injected via ports/adapters

### Rule 28: Platform Cannot Depend on Downstream
- ✅ platform → workspace | notion | notebooklm (one direction only)
- ❌ platform NEVER imports from workspace, notion, notebooklm
- ✅ If platform needs semantic data from notion/notebooklm: notion/notebooklm emit event to platform

## Anti-Patterns (Will Require Refactors)

### Rule 46: ❌ workspace directly calls Firestore
- **Wrong**: `firestore.collection('documents').get()`
- **Correct**: Use `@/modules/platform` (FileAPI, PermissionAPI, etc.)

### Rule 47: ❌ notebooklm implements its own permission logic
- **Wrong**: notebooklm checking `user.role === 'admin'`
- **Correct**: Call `@/modules/platform` → PermissionAPI.can()`

### Rule 48: ❌ notion directly invokes AI/Genkit
- **Wrong**: `notion/application/ imports Genkit`
- **Correct**: Notion emits event; platform routes to notebooklm via AI API

### Rule 49: ❌ Module imports another module's internal
- **Wrong**: `import { SomeEntity } from '@/modules/notion/domain/entities'`
- **Correct**: Use `import { ... } from '@/modules/notion'` (module root `index.ts`) only

### Rule 50: ❌ Business logic written in React component (workspace UI)
- **Wrong**: `if (user.role === 'admin') { ... }` in .tsx
- **Correct**: Move to application/ use-case; UI only composes and calls

### Rule 51: ❌ Cross-module route components read foreign context providers
- **Wrong**: notion/notebooklm route components call workspace providers directly (e.g. `useWorkspaceContext()`)
- **Correct**: workspace is the composition owner and must pass explicit scope props (`accountId`, `workspaceId`, optional `currentUserId`) through module `index.ts` boundaries

---

## Full Enforcement & Reference

See `docs/hard-rules-consolidated.md` for:
- All 51 rules with detailed explanations
- Document placement strategy (7 homes)
- Enforcement checklist
- Layer responsibility rules (11-13, 21-23)
- Event bus & async rules (4, 34-36)
- File/data/permission rules (3, 29-32, 37-40)
- Cross-module contract rules (24-27)