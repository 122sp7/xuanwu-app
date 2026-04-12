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

# Four Main Domains

## Strategic Overview

| Main Domain | Strategic Role | Baseline Subdomains | Recommended Gap | Active Status |
|---|---|---|---|---|
| **platform** | 治理與營運支撐 | identity, account, account-profile, organization, access-control, security-policy, platform-config, feature-flag, onboarding, compliance, billing, subscription, referral, ai, integration, workflow, notification, background-job, content, search, audit-log, observability, analytics, support (23) | tenant, entitlement, secret-management, consent (4) | ✅ 23 baseline + 4 gap |
| **workspace** | 協作容器與 scope | audit, feed, scheduling, workspace-workflow (4) | lifecycle, membership, sharing, presence (4) | ✅ 4 baseline + 4 gap |
| **notion** | 正典知識內容 | knowledge, authoring, collaboration, database, attachments, knowledge-versioning (6) | taxonomy, relations, publishing (3) | ✅ 6 baseline + 3 gap |
| **notebooklm** | 對話與推理 | conversation, note, notebook, source, synthesis (5) | ingestion, retrieval, grounding, evaluation (4) | ✅ 5 baseline + 4 gap |

---

## Ubiquitous Language

### Domain Key Terms

| Domain | Cardinal Terms | Published Language |
|---|---|---|
| **platform** | Actor, Tenant, Entitlement, Consent, Secret | Defines all upstream concepts; all downstream must translate through these |
| **workspace** | Workspace, Membership, ShareScope, ActivityFeed, AuditTrail | Consumes: actor reference, organization scope, access decision, entitlement signal |
| **notion** | KnowledgeArtifact, Taxonomy, Relation, Publication | Consumes: actor reference, organization scope, entitlement signal, ai capability signal |
| **notebooklm** | Notebook, Ingestion, Retrieval, Grounding, Synthesis, Evaluation | Consumes: actor reference, organization scope, entitlement signal, ai capability signal |

### Context Map (Upstream → Downstream)

```text
platform
  ├→ workspace        (actor, organization scope, access decision, entitlement signal)
  ├→ notion           (actor, organization scope, entitlement signal, ai capability signal)
  └→ notebooklm       (actor, organization scope, entitlement signal, ai capability signal)

workspace
  ├→ notion           (workspaceId, membership scope, share scope)
  └→ notebooklm       (workspaceId, membership scope, share scope)

notion
  └→ notebooklm       (knowledge artifact reference, attachment reference, taxonomy hint)
```

### Published Language Token Glossary

| Token | Canonical Domain | Constraint |
|---|---|---|
| actor reference | platform.Actor | Never mix with Membership |
| organization scope | platform.Tenant / organization boundary | Never equals Workspace scope |
| access decision | platform.access-control result | Pass decision only, not internal policy model |
| entitlement signal | platform.entitlement / subscription capability | Never mix with feature-flag payload |
| ai capability signal | platform.ai shared capability (only) | notion & notebooklm CONSUME only, never OWN `ai` subdomain |
| workspaceId | workspace.Workspace identifier | Never replaces local knowledge/notebook primary key |
| membership scope | workspace.Membership constraint | Never mixes with actor identity language |
| share scope | workspace.ShareScope constraint | Never mixes with general permission fields |
| knowledge artifact reference | notion.KnowledgeArtifact reference | Reference only, no ownership transfer |
| attachment reference | notion / notebooklm attachment ref | Traceable reference, never leaked storage impl |
| taxonomy hint | notebooklm retrieval hint (only) | Never overrides notion's canonical taxonomy |

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
- ❌ notebooklm defining its own `ai` subdomain (belongs exclusively to platform)
- ❌ Mixing Actor + Membership terminology (Actor = identity, Membership = workspace participation)
- ❌ Treating notion's KnowledgeArtifact as writable by other domains (reference only)

---

## Module Ownership Guardrails

| Concern | Owner | Never Owned By |
|---|---|---|
| Identity, authentication, session | platform | workspace, notion, notebooklm |
| Permission, entitlement, access control | platform | workspace, notion, notebooklm |
| Tenant isolation, organization scope | platform | workspace, notion, notebooklm |
| AI capability routing, model policy, safety | platform | notion, notebooklm (consumers only) |
| Workspace creation, archival, lifecycle | workspace | notion, notebooklm, platform |
| Knowledge artifact authoring, versioning | notion | platform, workspace, notebooklm |
| Conversation, retrieval, synthesis | notebooklm | platform, workspace, notion (notion→notebooklm: reference only) |
| Cross-module security rules, audit | platform | all others apply, never contradict |