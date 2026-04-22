# Firebase Architecture

Firebase 是本系統的 backend runtime 基線。所有 Firebase 服務（Auth、Firestore、Storage、Cloud Functions）視為外部基礎設施，統一由 `platform` 主域的 infrastructure 層治理。任何 `domain/` 核心不直接依賴 Firebase SDK。

## 服務職責分工

| 服務 | 職責 |
|---|---|
| **Firebase Auth** | 身份驗證與登入狀態；Actor 的 auth session |
| **Firestore** | 結構化資料持久化；所有 domain aggregate 的正典儲存 |
| **Cloud Storage** | 二進制檔案與附件；不儲存業務結構化資料 |
| **Cloud Functions (TS)** | 輕量 webhook、Firestore trigger、Auth trigger |
| **fn (Python Cloud Functions)** | 重量級、可重試的非同步 pipeline（ingestion、chunking、embedding） |

---

## 邊界規則：誰可以碰 Firebase SDK

| 層 / 模組 | 可直接使用 Firebase SDK？ |
|---|---|
| `platform/infrastructure/` | ✅ 唯一允許的位置 |
| `platform/subdomains/*/infrastructure/` | ✅ 允許（在 mini-module gate 成立時） |
| `notebooklm/`, `notion/`, `workspace/` 的 infrastructure | ✅ 只限 **read-only** Firestore query，不得寫入 platform-owned collection |
| 任何 `domain/` | ❌ 絕對禁止 |
| 任何 `application/` | ❌ 絕對禁止（透過 repository port） |
| `interfaces/`（Server Action / route） | ❌ 禁止（透過 use case 呼叫） |

---

## Firebase Auth — 邊界規則

- Auth adapter 實作收斂在 `src/modules/iam/subdomains/identity/adapters/outbound/`
- Next.js Server Action 驗證 session 時，呼叫 `platform.api` 或 `iam.api` 的 auth capability，不直接呼叫 `getAuth()`
- `actorId` 由 IAM identity capability 解析後，以 published language token 傳遞給下游主域
- Client side 的 `onAuthStateChanged` 只用於 UI 登入狀態反映，不作為 domain 授權決策依據

```typescript
// ✅ 正確：Server Action 透過 platform port 取得 actor
import { resolveActor } from '@/modules/platform';  // 透過 module index.ts 公開邊界

export async function createWorkspaceAction(input: unknown) {
  const actor = await resolveActor();  // platform 封裝 auth，不是直接 getAuth()
  // ...
}

// ❌ 錯誤：Server Action 直接使用 Firebase Auth SDK
import { getAuth } from 'firebase-admin/auth';
const user = await getAuth().verifyIdToken(token);
```

---

## Firestore — Schema 與 Collection 所有權

### Collection 所有權規則

每個 Firestore collection 歸屬單一 bounded context 的 infrastructure 層：

| Collection 前綴 | 所有者主域 |
|---|---|
| `platform_*` | platform |
| `workspace_*` | workspace |
| `notion_*` | notion |
| `notebooklm_*` | notebooklm |

- 非所有者主域不得直接寫入他人的 collection
- 非所有者需要資料時，透過所有者的 `api/` 或訂閱 domain event

### Query Scope 硬性規則

所有 Firestore query 必須帶有 scope filter，禁止無條件全集合查詢：

```typescript
// ✅ 正確：帶 workspaceId scope
const workspaceDocs = await db
  .collection('notion_knowledge_artifacts')
  .where('workspaceId', '==', workspaceId)
  .where('lifecycle', '==', 'active')
  .get();

// ❌ 錯誤：無 scope filter
const allDocs = await db.collection('notion_knowledge_artifacts').get();
```

必要 scope filter（至少其一）：
- `workspaceId` — 協作容器範疇
- `organizationId` — 組織範疇
- `tenantId` — 租戶隔離（multi-tenant 場景）

### Schema 版本管理

- Schema 以 domain entity 為主，不以 UI 需求為主
- 破壞性變更（rename / remove field）必須有 migration step，不可直接改 collection 結構
- 新欄位盡量 optional，保持向下相容

---

## Cloud Storage — 路徑規範與 Metadata 規則

### Storage Path 格式

```
{tenantId}/{workspaceId}/{ownerId}/{fileId}
```

- `tenantId`：租戶隔離鍵，不等於 `workspaceId` 或 `accountId`
- `workspaceId`：協作容器識別碼
- `ownerId`：資源所有者識別碼
- `fileId`：檔案 metadata 主鍵

路徑中的每個 segment 都有語意，禁止使用 `uploads/{random}.pdf` 等無結構路徑。

### Metadata 硬性規則

每個 Storage object 在 Firestore 中必須有對應的 metadata document：

```typescript
// Firestore metadata document schema（位於 platform_files/{fileId}）
interface FileMetadata {
  fileId: string;       // = Storage object 的 fileId segment
  tenantId: string;
  workspaceId: string;
  ownerId: string;
  path: string;         // = 完整 Storage path
  mimeType: string;
  sizeBytes: number;
  lifecycle: 'active' | 'archived' | 'deleted';
  createdAt: string;    // ISO string
  archivedAt?: string;
  deletedAt?: string;
}
```

- Firestore metadata 是檔案存在與權限的正典來源，不是 Storage object headers
- 若 Storage object metadata 遺失，Firestore document 仍完整
- 沒有 Firestore metadata 的 Storage object 視為 orphan，不得被業務邏輯引用

---

## Cloud Functions (TS) vs fn 分工

| 任務類型 | 歸屬 |
|---|---|
| Auth trigger（新用戶 onboarding）| Cloud Functions (TS) |
| Firestore onCreate/onUpdate trigger（輕量 side effect）| Cloud Functions (TS) |
| HTTP webhook（integration callback）| Cloud Functions (TS) |
| 大型文件 parse、clean、chunk | fn |
| Embedding 生成（呼叫 embedding model）| fn |
| Vector index 維護 | fn |
| 需要 Python 生態套件（NLTK、spaCy、PyMuPDF 等）| fn |

**規則**：Next.js 負責接收請求並觸發事件，`fn` 處理重量計算，結果寫回 Firestore，Next.js 或 Firestore trigger 再後續處理。Next.js 不等待 fn 完成（非阻塞）。

---

## Security Rules 設計原則

Firestore 與 Storage security rules 必須：

1. 以 `request.auth.uid` 做 actor 身份驗證，不信任 client 傳入的 `userId` 欄位
2. 以 resource 的 `workspaceId` + membership 做 scope 驗證
3. 以 resource 的 `tenantId` 做租戶隔離
4. 禁止 `allow read, write: if true` 或任何無條件允許規則
5. 規則異動必須附帶對應的 scenario-based 測試

```
// firestore.rules 範例片段（workspace collection）
match /workspace_workspaces/{workspaceId} {
  allow read: if request.auth != null
    && exists(/databases/$(database)/documents/workspace_members/$(request.auth.uid + '_' + workspaceId));

  allow write: if request.auth != null
    && get(/databases/$(database)/documents/workspace_members/$(request.auth.uid + '_' + workspaceId)).data.role == 'owner';
}
```

---

## 禁止模式

- ❌ `domain/` 中 `import { getFirestore }` 或任何 firebase-admin / firebase client SDK
- ❌ `application/` 直接呼叫 Firestore（透過 repository port）
- ❌ 無 scope filter 的 Firestore collection query
- ❌ Storage object 沒有 Firestore metadata document
- ❌ `/{random}` 的無結構 Storage path
- ❌ Security rules `allow read, write: if true`
- ❌ 非 platform 主域直接寫入 platform-owned collection

---

## Document Network

- [genkit-flow-standards.md](../genkit/genkit-flow-standards.md)
- [event-driven-design.md](../../01-architecture/domain/event-driven-design.md)
- [`../.github/instructions/firestore-schema.instructions.md`](../../../.github/instructions/firestore-schema.instructions.md)
- [`../.github/instructions/security-rules.instructions.md`](../../../.github/instructions/security-rules.instructions.md)
- [`docs/01-architecture/system/hard-rules-consolidated.md`](../../01-architecture/system/hard-rules-consolidated.md)
