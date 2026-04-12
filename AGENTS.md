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