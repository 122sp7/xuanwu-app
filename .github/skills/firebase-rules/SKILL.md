---
name: firebase-rules
description: >-
  Firebase architecture skillbook for Xuanwu. Use when designing or reviewing Firebase SDK boundaries,
  Firestore collection ownership, Storage path patterns, Security Rules, Cloud Functions vs py_fn split,
  and domain adapter patterns. Covers Authentication, Firestore, Cloud Storage, and Cloud Functions governance.
user-invocable: true
disable-model-invocation: false
---

# Firebase Architecture Rules

Use this skill when the task involves Firebase service boundaries, Firestore schema, Storage path design,
security rules, or the split between Next.js Cloud Functions and py_fn worker pipelines.

## Research Basis

Context7-verified + Xuanwu-specific:

- Firebase SDK is an infrastructure concern — it must never appear in domain or application layers.
- Firestore is a NoSQL document store; collection ownership must map 1:1 to a bounded context.
- Security Rules are the authoritative access control layer for Firestore and Storage — they are not a secondary fallback.
- Cloud Functions (TS) and py_fn (Python) serve different runtime profiles and must not be mixed.

## Working Synthesis

Firebase in Xuanwu means:

1. Every Firebase service is wrapped in an infrastructure adapter; `domain/` and `application/` never import Firebase SDK.
2. Firestore collection ownership maps to bounded context boundaries — non-owners read via API or events, never direct queries.
3. Security Rules enforce tenant and workspace isolation at the storage layer, independent of application-layer checks.
4. Cloud Functions (TS) handle lightweight triggers; py_fn handles heavy, retryable computation pipelines.

---

## Firebase SDK Boundary Rules

### Who May Import Firebase SDK

| Layer / Location | Allowed? |
|---|---|
| `platform/infrastructure/` | ✅ Primary owner |
| Any bounded context `infrastructure/` | ✅ Read-only Firestore queries only |
| Any `domain/` | ❌ Absolute prohibition |
| Any `application/` | ❌ Absolute prohibition (use injected repository port) |
| Any `interfaces/` Server Action | ❌ Prohibited (call use case instead) |

### Port + Adapter Pattern for Firebase

```typescript
// domain/repositories/WorkspaceRepository.ts  (Port — no Firebase)
export interface WorkspaceRepository {
  findById(id: WorkspaceId): Promise<Workspace | null>;
  save(workspace: Workspace): Promise<void>;
  delete(id: WorkspaceId): Promise<void>;
}

// infrastructure/FirebaseWorkspaceRepository.ts  (Adapter — Firebase here)
import { getFirestore } from 'firebase-admin/firestore';
import { WorkspaceRepository } from '../../domain/repositories/WorkspaceRepository';

export class FirebaseWorkspaceRepository implements WorkspaceRepository {
  private db = getFirestore();

  async findById(id: WorkspaceId): Promise<Workspace | null> {
    const doc = await this.db.collection('workspace_workspaces').doc(id).get();
    if (!doc.exists) return null;
    const raw = doc.data();
    // Always validate Firestore data with Zod before mapping
    const validated = FirestoreWorkspaceSchema.parse(raw);
    return Workspace.reconstitute(validated);
  }
}
```

---

## Firebase Authentication Rules

- Auth session adapters are now owned by `modules/iam/subdomains/identity/infrastructure/`.
- Server Actions resolve Actor identity via `platform.api` or `iam.api` capabilities — never call `getAuth()` directly.
- `actorId` is the domain identity token; it is derived from the Firebase Auth UID in the adapter but never equals the UID in domain language.
- Client-side `onAuthStateChanged` is for UI login state only — not for domain authorization decisions.

```typescript
// ✅ Correct: Server Action resolves actor via platform API
import { resolveActor } from '@/modules/platform/api';
const actor = await resolveActor();

// ❌ Wrong: direct Firebase Auth in Server Action
import { getAuth } from 'firebase-admin/auth';
const decoded = await getAuth().verifyIdToken(token);
```

---

## Firestore — Collection Ownership and Query Rules

### Collection Naming and Ownership

Collections are named with a bounded-context prefix to make ownership visible:

| Prefix | Owner |
|---|---|
| `platform_*` | platform |
| `workspace_*` | workspace |
| `notion_*` | notion |
| `notebooklm_*` | notebooklm |

A bounded context may only write to its own collections. To access another context's data, call that context's `api/` or subscribe to its domain events.

### Query Scope (Mandatory Filter)

Every Firestore query must carry at least one scope filter:

```typescript
// ✅ Correct: scoped query
const docs = await db.collection('notion_knowledge_artifacts')
  .where('workspaceId', '==', workspaceId)
  .where('lifecycle', '==', 'active')
  .get();

// ❌ Wrong: unscoped collection scan
const all = await db.collection('notion_knowledge_artifacts').get();
```

Required scope: `workspaceId`, `organizationId`, or `tenantId`.

### Schema Validation on Read (Mandatory)

Every Firestore document read must pass through a Zod schema before being mapped to a domain entity:

```typescript
const raw = (await docRef.get()).data();
const validated = FirestoreWorkspaceSchema.parse(raw);   // throws if schema drifted
return Workspace.reconstitute(validated);

// ❌ Wrong: cast without validation
return raw as WorkspaceData;
```

### Schema Migration Rules

- Breaking schema changes (rename or remove a field) require an explicit migration step.
- New fields must be optional to maintain backward compatibility.
- `firestore.indexes.json` must be updated when new query patterns require composite indexes.

---

## Cloud Storage — Path and Metadata Rules

### Storage Path Format

```
{tenantId}/{workspaceId}/{ownerId}/{fileId}
```

Every segment has semantic meaning. Generic paths like `uploads/{random}.pdf` are prohibited.

### Metadata Document (Mandatory)

Every Storage object must have a corresponding Firestore metadata document at `platform_files/{fileId}`:

| Field | Type | Purpose |
|---|---|---|
| `fileId` | `string` (UUID) | = Storage path `fileId` segment |
| `tenantId` | `string` | Tenant isolation key |
| `workspaceId` | `string` | Collaboration scope |
| `ownerId` | `string` | Resource owner |
| `path` | `string` | Full Storage path |
| `mimeType` | `string` | Content type |
| `sizeBytes` | `number` | File size |
| `lifecycle` | `'active' \| 'archived' \| 'deleted'` | Lifecycle state |
| `createdAt` | `string` (ISO) | Creation timestamp |

Firestore metadata is the source of truth. If Storage object metadata is lost, Firestore document survives.

---

## Security Rules Design

### Core Principles

1. `request.auth.uid` is the only trusted identity source — never trust client-supplied `userId` fields.
2. Workspace access requires membership verification against the members collection.
3. Tenant isolation requires `tenantId` scope on all cross-tenant-sensitive paths.
4. `allow read, write: if true` and any unconditional allow rule are prohibited in production.
5. Rule changes must be paired with scenario-based validation tests.

```
// firestore.rules — example workspace access
match /workspace_workspaces/{workspaceId} {
  allow read: if request.auth != null
    && exists(/databases/$(database)/documents/workspace_members/$(request.auth.uid + '_' + workspaceId));

  allow write: if request.auth != null
    && get(/databases/$(database)/documents/workspace_members/$(request.auth.uid + '_' + workspaceId)).data.role == 'owner';
}
```

---

## Cloud Functions (TS) vs py_fn Split

| Task | Runtime |
|---|---|
| Auth trigger (new user onboarding) | Cloud Functions (TS) |
| Firestore onCreate/onUpdate (lightweight side effect) | Cloud Functions (TS) |
| HTTP webhook (integration callback) | Cloud Functions (TS) |
| Large file parsing / cleaning / chunking | py_fn |
| Embedding generation | py_fn |
| Vector index maintenance | py_fn |
| Requires Python ecosystem (NLTK, spaCy, PyMuPDF) | py_fn |

Next.js accepts requests and triggers events; py_fn handles heavy computation and writes results to Firestore; Next.js or Firestore triggers handle downstream processing. Next.js never blocks waiting for py_fn completion.

---

## Red Flags

- `import { getFirestore }` in any `domain/` or `application/` file.
- `application/` calling Firestore directly instead of injecting a repository port.
- Firestore query without `workspaceId` or `tenantId` scope filter.
- Storage object without a corresponding Firestore metadata document.
- `/{random}.pdf` or other unstructured Storage paths.
- `allow read, write: if true` in security rules.
- Non-platform bounded context writing to `platform_*` collections.
- Firestore data cast with `as SomeType` without Zod validation.

## Review Loop

1. Confirm which bounded context owns the collection being read or written.
2. Verify Firebase SDK import is only in `infrastructure/` adapter files.
3. Verify Firestore reads use Zod validation before mapping to domain.
4. Verify Storage path follows `{tenantId}/{workspaceId}/{ownerId}/{fileId}`.
5. Verify Security Rules enforce actor identity and workspace/tenant scope.
6. Verify Cloud Functions vs py_fn split follows the runtime responsibility table.

## Output Contract

When this skill is used, provide:

1. Boundary violation findings (Firebase SDK in wrong layer, missing Zod validation),
2. Collection ownership assessment,
3. Storage path and metadata corrections,
4. Security rules assessment,
5. Required migration or index changes.
