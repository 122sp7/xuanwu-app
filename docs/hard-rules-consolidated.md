# 50 Hard Rules — Consolidated Architecture Guardrails

**Status**: Consolidated from user request (2026-04-12)  
**Authority**: AGENTS.md (strategic) + module AGENT.md (tactical)  
**Purpose**: Prevent late-stage architectural breakage; enforce non-negotiable boundaries

---

## 🗂️ Document Placement Strategy

| Rule Category | Count | Primary Location | Secondary Location |
|---|---|---|---|
| **Strategic Ownership** (1, 5-10, 28) | 9 | `AGENTS.md` § Module Ownership | — |
| **Dependency Direction** (2, 6-7, 49) | 4 | `AGENTS.md` § Anti-Patterns | `eslint.config.mjs` |
| **Layer Responsibility** (11-13, 21-23) | 7 | `.github/instructions/architecture-core.instructions.md` | Module AGENT.md |
| **Data Flow & Events** (4, 9, 34-36) | 5 | `.github/instructions/event-driven-state.instructions.md` | RAG docs |
| **File / Storage / IO** (3, 29-32, 39) | 6 | `.github/instructions/security-rules.instructions.md` | Firestore schema docs |
| **Permission / Security** (37-38, 40) | 3 | `.github/instructions/security-rules.instructions.md` | Platform docs |
| **Cross-Module Contracts** (24-27) | 4 | `docs/context-map.md` | Module AGENT.md |
| **Feature Toggles / Independence** (17) | 1 | Platform feature-flag docs | — |
| **Anti-Patterns** (46-50) | 5 | `AGENTS.md` § Anti-Patterns | Module AGENT.md |

**Total**: 50 rules consolidated into 8 homes

---

## 📍 LOCATION 1: `AGENTS.md` (Strategic Rules)

### Add to § "Module Ownership Guardrails"

```markdown
## Strategic Ownership Rules (Hard Constraints)

### Rule 1: Platform is Unique Infrastructure Gateway
- ✅ platform owns Firebase, Genkit, external AI routing, cross-domain auth
- ❌ notion, notebooklm NEVER own infra (except local read-only access)
- ✅ workspace NEVER touches Firebase/Storage/Genkit directly

### Rule 5: Workspace is Orchestration Only
- ✅ workspace composes module APIs and next.js routing
- ❌ workspace NEVER contains domain business logic
- ❌ workspace NEVER makes direct DB/permission decisions

### Rule 6: Cross-Module Access Prohibition
- ✅ module A imports module B only via `@/modules/b/api`
- ❌ NO direct imports of domain/, application/, infrastructure/, interfaces/
- ✅ ALL data sharing via events or published language tokens

### Rule 7: Mandatory Single Entry Point (API Boundary)
- ✅ Every module must export `api/index.ts` 
- ✅ `api/` exposes only public surface; hides internals
- ❌ NO imports from internal module paths outside module

### Rule 8: Platform is Only Infrastructure Layer
- ✅ Firebase, Genkit, Auth, File Storage, Queue: platform owns
- ✅ Cross-domain coordination, routing, governance: platform owns
- ❌ Notion NEVER owns persistence (uses platform.infrastructure APIs)
- ❌ Notebooklm NEVER owns embedding infra (uses platform.infrastructure APIs)

### Rule 9: Cross-Module Data Flow MUST Use Events or API
- ✅ When module A needs data from module B: A calls B.api or subscribes to B.event
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
```

### Add to § "Anti-Patterns"

```markdown
### Hard Anti-Patterns (Will Cause Refactors)

- ❌ **Rule 46**: workspace directly calls Firestore (`firestore.collection().get()`)
  - Fix: Use `@/modules/platform/api` (FileAPI, PermissionAPI, etc.)

- ❌ **Rule 47**: notebooklm implements its own permission logic
  - Fix: Call `@/modules/platform/api → PermissionAPI.can()`

- ❌ **Rule 48**: notion directly invokes AI/Genkit
  - Fix: Notion emits event; platform routes to notebooklm via AI API

- ❌ **Rule 49**: Module imports another module's internal (domain/application/infrastructure)
  - Fix: Use `@/modules/<target>/api` only

- ❌ **Rule 50**: Business logic written in React component (workspace UI)
  - Fix: Move to application/ use-case; UI only composes and calls
```

---

## 📍 LOCATION 2: `.github/instructions/architecture-core.instructions.md`

### Add Section: "Layer Responsibility Rules"

```markdown
## Layer Responsibility Rules (Hard Constraints)

### Rule 11: Application Layer = Transaction Boundary + Use Case Orchestration
- ✅ application/ coordinates domain behavior + transaction boundaries
- ✅ application/ handles command/query DTO translation
- ✅ application/ publishes domain events
- ❌ application/ NEVER contains business rules (write in domain/)
- ❌ application/ NEVER directly calls UI frameworks
- ✅ Use cases orchestrate only; rules stay in domain

### Rule 12: Repositories Hidden Behind Module Boundary
- ✅ Repository interface defined in domain/repositories/
- ✅ Repository implementation hidden in infrastructure/
- ❌ NO other module calls a module's repository directly
- ✅ If another module needs aggregate data: call module.api or use events

### Rule 13: DTO ≠ Domain Model
- ✅ DTO lives in application/dtos/ (structural change contract)
- ✅ Domain model lives in domain/entities/, domain/aggregates/ (business rules)
- ❌ NEVER return domain model directly in API response
- ✅ Map domain → DTO before crossing module boundary

### Rule 16: Firestore Schema Driven by Domain, Not UI
- ✅ domain/entities define what data exists (invariants, validation)
- ✅ infrastructure/persistence maps domain → Firestore
- ❌ UI changes NEVER drive schema changes directly
- ✅ If UI needs new data: propose to domain; domain approves; schema follows

### Rule 21: UI Layer (workspace + interfaces/) = Zero Business Logic
- ✅ interfaces/ composes routes, actions, UI components
- ✅ interfaces/ calls application/ use-cases or services
- ❌ NO if (business rule) in UI
- ❌ NO NO permission judgment in UI
- ❌ NO NO transaction logic in UI
- ✅ All decisions made server-side; UI only displays result

### Rule 22: Application Layer = Use-Case Driven, Testable
- ✅ Every use-case has: actor, goal, main scenario, extensions
- ✅ Use-case can be tested without UI/framework
- ✅ Use-case has no database import (uses injected repository)
- ❌ NO generic utility classes masquerading as use-cases

### Rule 23: Domain Layer = Pure, Side-Effect Free
- ✅ domain/ contains rules, validation, state transitions
- ✅ domain/ can be tested in isolation with no async
- ❌ domain/ NEVER makes I/O calls
- ❌ domain/ NEVER calls external services
- ✅ domain events emitted; orchestration in application/
```

---

## 📍 LOCATION 3: `.github/instructions/event-driven-state.instructions.md`

### Add Section: "Event Bus Requirement & Data Flow"

```markdown
## Event Bus Requirement & Async Data Flow (Hard Constraints)

### Rule 4: Event Bus is Mandatory (Not Optional)
- ✅ Platform.event-bus/ subdomain must exist and be fully implemented
- ✅ All cross-module async flows go through event bus
- ✅ All domain events emitted with: id, timestamp, source, payload schema
- ❌ NEVER use Queue/RabbitMQ without event schema registry

### Rule 34: Ingestion & Embedding Must Be Async
- ✅ File upload triggers event; worker processes async
- ✅ Embedding generation async; client polls or subscribes
- ❌ NEVER block request until embedding complete
- ✅ Store job ID; allow client to check status later

### Rule 35: Long Tasks Must Use Queue/Event
- ✅ AI orchestration, embedding, chunking: async with queue
- ✅ Non-blocking request → store task ID → return immediately
- ❌ NEVER setTimeout/promise without proper queue
- ✅ Task must be retryable and idempotent

### Rule 36: Event Schema is Non-Negotiable
- ✅ Every event has: id (UUID), timestamp (ISO), source (module), payload
- ✅ Event schema registered before emission
- ✅ Event can be replayed from audit log
- ❌ NO unstructured event payload (use discriminant + payload schema)

### Rule 9: Cross-Module Data Flow = Events or API
- ✅ When B needs to know about A's change: A emits event; B subscribes
- ✅ When B needs data from A: B calls A.api (synchronous)
- ❌ NO B reading A's Firestore collection directly
- ✅ Events enable loose coupling; API enables strongcontract
```

---

## 📍 LOCATION 4: `.github/instructions/security-rules.instructions.md`

### Add Section: "File Lifecycle, Metadata, Ownership"

```markdown
## File & Data Ownership Rules (Hard Constraints)

### Rule 3: File Metadata is Non-Negotiable
- ✅ EVERY file in Storage has metadata in Firestore
- ✅ Metadata includes: ownerId, workspaceId, createdAt, lifecycle (active/archived/deleted)
- ✅ `ownerId` = resource owner identifier；`workspaceId` = collaboration scope identifier；兩者都不等於 shell route 的 `accountId`
- ❌ NEVER store-only URL without DB entry
- ✅ Firestore entry is source of truth for permissions & lifecycle

### Rule 29: File Lifecycle is Explicit
- ✅ File states: upload → used → archived → deleted
- ✅ Transitions logged; each state has timestamp
- ✅ Archived files not deleted immediately (async cleanup after retention)
- ❌ NO orphaned files (every file must be referenced)

### Rule 30: File Metadata in Database, Not Storage Headers Only
- ✅ Firestore/Storage both contain metadata; DB is canonical
- ✅ If Storage Object's custom metadata lost, DB entry remains
- ❌ NEVER rely on Storage object metadata alone
- ✅ Schema: collections/files/{fileId} → {ownerId, workspaceId, path, size, ...}

### Rule 31: AI Input Traceability
- ✅ Every AI request logged: [timestamp, source, input, model, params]
- ✅ Logging in application/ service before sending to platform.ai
- ❌ NEVER lose context (prompt + source + groundings)
- ✅ Can replay prompts; deterministic when possible

### Rule 32: AI Output Reconstructibility
- ✅ AI output + input + timestamp + model version all stored
- ✅ Deterministic flow: same input + params → same output (for embedding)
- ✅ Snapshot stored so rerank/re-retrieval uses same data
- ❌ NEVER lose ability to rewind/re-generate

### Rule 33: Embedding & Index Reconstructibility
- ✅ Embeddings stored with source chunk ID + hash
- ✅ Vector index can be rebuilt from source + embedding service
- ❌ Vector index is NOT source of truth
- ✅ Source of truth: Firestore (chunks) + embedding service (vectors)

### Rule 37: Every Resource Has an Owner
- ✅ Every knowledge artifact, conversation, notebook: {ownerId, workspaceId}
- ✅ Permission check before access: does request.user == resource.owner | member
- ❌ NEVER expose resource without owner scope
- ✅ Cross-workspace access: explicit ACL check

### Rule 38: Permission NEVER Hard-Coded in UI
- ✅ All permission checks happen server-side
- ✅ UI conditionally rendered based on server permission response
- ❌ NEVER hide UI element expecting client-side security
- ✅ always fallback: permission denied → error message

### Rule 39: Storage Path Contains Scope (Leak Prevention)
- ✅ Storage paths: `{tenantId}/{workspaceId}/{ownerId}/{fileId}`
- ✅ `tenantId` = tenant isolation key；不是 `workspaceId`、`accountId` 或 `ownerId` 的別名
- ✅ Firestore rules prevent cross-tenant access
- ❌ NEVER path like `storage/uploads/{random}.pdf` (breaks isolation)
- ✅ Scope visible in path; admins can audit

### Rule 40: All Queries Must Include Scope
- ✅ Firestore query: `collection.where('workspaceId', '==', workspace).get()`
- ✅ Database query: `select * from resources where workspace_id = ?`
- ❌ NEVER query without workspace/tenant filter
- ✅ Scope enforced in both application and Firestore rules
```

---

## 📍 LOCATION 5: `docs/context-map.md`

### Add or Extend Section: "Cross-Module Data Contracts"

```markdown
## Cross-Module Data Flow Rules (Hard Constraints)

### Rule 24: Notebooklm Cannot Direct-Read Firestore
- ✅ notebooklm reads knowledge artifacts via `@/modules/notion/api`
- ❌ NEVER: `firestore.collection('notion_pages').get()`
- ✅ Decouples notebooklm from notion's persistence model

### Rule 25: Notebooklm Data Requests = Via Notion API
- ✅ If notebooklm.retrieval needs knowledge: calls `notion.api.getKnowledgeArtifacts()`
- ✅ Notion controls schema; notebooklm consumes contract only
- ❌ NEVER notebooklm queries notion's Firestore directly

### Rule 26: Notion is Completely Unaware of AI
- ✅ notion/ has zero imports from notebooklm/
- ✅ notion/ does not know AI exists
- ✅ If AI needs notion data: calls notion.api
- ❌ NO coupling from notion to AI/notebooklm

### Rule 27: Workspace Cannot Direct-Call AI
- ✅ workspace orchestrates; notebooklm synthesizes
- ✅ workspace calls notebooklm.api; notebooklm handles AI routing
- ❌ NEVER workspace imports platform.ai or genkit directly
- ✅ Decouples UI from AI complexity
```

---

## 📍 LOCATION 6: Module-Level `AGENT.md` Files

Each module should have its own constraints section, such as:

### **`modules/platform/AGENT.md`** (Add Section)

```markdown
## Platform-Specific Hard Rules

1. **Rule 1**: Platform infra (Firebase, Genkit, Auth) never directly exposed; wrapped in semantic APIs
2. **Rule 2**: All consumers access platform via Service API layer only (FileAPI, AIAPI, PermissionAPI, AuthAPI)
3. **Rule 8**: Platform is only module allowed to import Firebase SDK, Genkit SDK, external AI APIs
4. **Rule 28**: Platform.api can emit events to downstream; platform.domain never imports downstream modules
```

### **`modules/workspace/AGENT.md`** (Add Section)

```markdown
## Workspace-Specific Hard Rules

1. **Rule 5**: Workspace is pure orchestration (routes, actions); zero domain business logic
2. **Rule 21**: UI components in workspace.interfaces/ NEVER contain business decision logic
3. **Rule 27**: Workspace never directly calls AI; always goes through notebooklm or platform
4. **Rule 17**: Workspace feature toggles ensure modules can be disabled; no hard dependencies
```

### **`modules/notion/AGENT.md`** (Add Section)

```markdown
## Notion-Specific Hard Rules

1. **Rule 26**: Notion is agnostic of AI systems; zero imports from notebooklm or platform.ai
2. **Rule 24-25**: Notion owns knowledge artifact authoring; others access via notion.api only
3. **Rule 24**: Notion controls persistence schema; downstream modules don't query Firestore
```

### **`modules/notebooklm/AGENT.md`** (Add Section)

```markdown
## NotebookLM-Specific Hard Rules

1. **Rule 24-25**: All knowledge data requests via notion.api; never direct Firestore
2. **Rule 27**: Workspace calls notebooklm.api; notebooklm routes to platform.ai internally
3. **Rule 31-32**: All AI prompts/outputs logged with full traceability metadata
4. **Rule 34**: Retrieval + synthesis always async; non-blocking to request
```

---

## 📍 LOCATION 7: ESLint Config (`eslint.config.mjs`)

### Add Custom Rule Enforcement

```javascript
// Enforce hard rule 2, 6, 49: No cross-module internal imports
{
  rules: {
    "@custom/no-cross-module-internal-import": {
      enabled: true,
      allowedPaths: ["api/", "index.ts"],  // Only api/ and root exports allowed
      blockedPaths: ["domain/", "application/", "infrastructure/", "interfaces/"]
    },
    
    // Enforce hard rule 1, 8: No direct Firebase/Genkit imports outside platform
    "@custom/no-direct-firebase-outside-platform": {
      enabled: true,
      allowedModules: ["platform"],
      blockedImports: ["firebase", "@google-cloud/genkit"]
    }
  }
}
```

### Design Smell Guardrails

以下 guardrails 用來把 design smell 變成持續可見的 warning signal，而不是等到大型 convergence 才發現。

#### 1300 Cyclic Dependency

- 禁止把 `require()` 當成正常的 composition 模式。
- 若真的因既有循環鏈暫時保留 lazy require，必須把它侷限在單點並標明循環來源。
- lint signal: `no-restricted-syntax` on `CallExpression[callee.name='require']`。

#### 1400 Dependency Leakage

- `api/index.ts` 不得用 `export * from "../application"` 或 `export * from "../interfaces"` 洩漏內層。
- API boundary 應只精確 export 穩定 capability、service facade 與必要 DTO / type contract。
- lint signal: `no-restricted-syntax` on `ExportAllDeclaration` selectors。

#### 3100 Low Cohesion

- `api/` 檔案若同時混入 infrastructure、service、subdomain business API、UI hooks/components，視為低內聚風險。
- 優先拆分為 capability boundary，而不是繼續把 root barrel 做大。
- lint signal: `max-lines` on module `api/` files as early warning.

#### 5200 Cognitive Load

- fat screen 不是單純行數問題，而是單一畫面同時承接 cross-module orchestration、panel wiring 與流程判斷。
- 超過閾值時先檢查是否可以抽出 focused composition、helper 或 facade。
- lint signal: `max-lines` on `interfaces/**/components/screens/**`.

#### Enforcement Posture

- lint 使用 warning 等級，目的是持續暴露 smell 壓力，不是把既有技術債一次性升級成 build blocker。
- smell 是否成立，以對應 ADR 的 context、decision、conflict resolution 為準；lint 只是入口訊號。

---

## 🎯 Summary: Where Each Rule Lives

| Rules | Location | File |
|---|---|---|
| 1, 5-10, 28 | AGENTS.md | Strategic ownership |
| 2, 6-7, 49 | AGENTS.md + eslint | Dependency direction |
| 11-13, 21-23 | architecture-core.instructions.md | Layer responsibility |
| 4, 9, 34-36 | event-driven-state.instructions.md | Event bus & async |
| 3, 29-32, 37-40 | security-rules.instructions.md | File/data/permission |
| 24-27 | context-map.md | Cross-module contracts |
| 17 | Platform feature-flag docs | Feature independence |
| 46-50 | AGENTS.md | Anti-patterns |
| All | Module AGENT.md | Tactical enforcement |

---

## ✅ Enforcement Checklist

### Before Each Merge:
- [ ] No cross-module imports outside `api/`
- [ ] No Firebase/Genkit outside platform
- [ ] All async flows use event bus with schema
- [ ] File metadata in Firestore
- [ ] Permission checks server-side only
- [ ] Domain layer has zero external deps
- [ ] Application layer orchestrates, not rules

### Before Each Release:
- [ ] All rules reviewed in relevant AGENT.md
- [ ] ESLint boundary checks passing
- [ ] Zero anti-pattern violations (46-50)
- [ ] Event schemas registered & consistent

---

## 📚 Document Network

- [AGENTS.md](../AGENTS.md) — Strategic ownership & anti-patterns
- [.github/instructions/architecture-core.instructions.md](../.github/instructions/architecture-core.instructions.md) — Layer responsibility
- [.github/instructions/event-driven-state.instructions.md](../.github/instructions/event-driven-state.instructions.md) — Event bus & async
- [.github/instructions/security-rules.instructions.md](../.github/instructions/security-rules.instructions.md) — File/data/permission
- [docs/context-map.md](./context-map.md) — Cross-module contracts
- [modules/platform/AGENT.md](../modules/platform/AGENT.md) — Platform constraints
- [modules/workspace/AGENT.md](../modules/workspace/AGENT.md) — Workspace constraints
- [modules/notion/AGENT.md](../modules/notion/AGENT.md) — Notion constraints
- [modules/notebooklm/AGENT.md](../modules/notebooklm/AGENT.md) — NotebookLM constraints
