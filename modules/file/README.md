# File Module MDDD + Hexagonal Implementation Plan

**核心原則：檔案模組只擁有檔案生命週期、版本、授權快照與保留策略的業務規則，account / workspace / organization 只提供身分、協作情境與治理政策，所有存取判斷一律經由 file application use case 透過 ports 解算。**

---

## 1) 問題陳述與目標 / 非目標

### 問題陳述
目前 `modules/file` 已完成第一階段解耦，但仍缺少完整生命週期能力：

- `WorkspaceFilesTab` 已走 file module query，不再依賴 workspace projection
- 讀取路徑已從 workspace 衍生訊號拆離，但 canonical write-side / lifecycle（upload/download/version/retention）仍未完整落地
- account、workspace、organization 在檔案領域的責任邊界尚未被明確建模
- 檔案權限、版本、保留、稽核、下載連結生命週期都沒有正式 aggregate / port / use case
- 如果直接在 app/router 或 UI 補功能，會進一步惡化 coupling，違反本專案的 MDDD + Hexagonal 依賴方向

### 目標
1. 將 `modules/file` 定義為正式 bounded context，具備可演進的 `domain / application / infrastructure / interfaces` 分層。
2. 一次釐清 account、workspace、organization、file 四者在檔案領域的責任邊界。
3. 建立最小可行資料模型，支援：
   - upload-init / upload-complete
   - list-files
   - get-download-url
   - archive-file / restore-file
   - versioning / audit / retention
4. 明確定義權限解算優先序與 default deny 原則。
5. 提供可直接開工的 migration plan，先拆掉目前 `WorkspaceOperationalSignals` 對檔案顯示的耦合。
6. 確保所有外部依賴（Firebase / Firestore / Storage / signed URL / notification / audit）只存在 infrastructure。

### 非目標
1. 本次方案**不**直接實作完整 Document AI / Parser / RAG ingestion pipeline；那是 parser / py_fn 的責任。
2. 本次方案**不**定義新的 UI 視覺設計系統；UI 僅需接正式 query / action。
3. 本次方案**不**讓 account / workspace / organization 模組去「接管」檔案生命週期。
4. 本次方案**不**在第一個 PR 就完成全文檢索、DLP、病毒掃描、跨區域複寫。
5. 本次方案**不**把權限規則散落在 router、server action、React component、Firebase Rules 各處重複實作。

---

## 2) account / workspace / organization / file 職責矩陣

| 邊界 | 擁有資料 | 可執行行為 | 禁止責任 |
| --- | --- | --- | --- |
| `account` | `accountId`、身份狀態、角色指派結果、成員資格、使用者偏好 | 發起 upload / download / archive / restore 請求；作為 actor 被授權；持有 personal scope 的擁有者資訊 | 不可擁有 organization 檔案政策；不可直接決定 workspace 檔案可見性；不可實作檔案生命週期規則 |
| `workspace` | `workspaceId`、協作情境、成員關係、workspace grants、檔案掛載上下文 | 定義檔案與某個 workspace 的協作歸屬；提供 workspace-level grant；決定哪些檔案在該 workspace 被列出 | 不可擁有 blob/storage path；不可實作版本規則；不可繞過 organization policy 發放權限 |
| `organization` | `organizationId`、租戶邊界、治理政策、保留政策基線、分類基線、legal hold / compliance policy | 提供 tenant boundary；定義最高優先權 hard deny / retention baseline / classification baseline | 不可直接持有檔案版本資料；不可把檔案列表實作成 organization page fan-out 邏輯；不可在 UI 內解權限 |
| `file` | 檔案 metadata、版本、storage pointer、permission snapshot、retention outcome、download token issuance、audit payload | 管理 upload session、版本建立、列檔、下載連結、封存、還原、軟刪除、權限快照、稽核事件發送 | 不可成為 identity source；不可管理 organization/team/workspace lifecycle；不可直接 import 他模組 domain 來解決規則 |

### 邊界補充
- `organization` 是**租戶與治理邊界**。
- `workspace` 是**協作與掛載邊界**。
- `account` 是**actor 與主體邊界**。
- `file` 是**檔案生命週期與存取決策邊界**。

---

## 3) 10 條不可違反架構規則

1. `app/` 與 route handler / server action 只能協調輸入輸出，不得實作檔案業務規則。
2. `modules/file/interfaces/*` 只能呼叫 `application/use-cases`，不得直接存取 Firebase / Firestore / Storage。
3. `modules/file/application/*` 不得 import Firebase SDK、Next.js runtime API、React hook、UI component。
4. `modules/file/domain/*` 必須保持 pure TypeScript，不得 import `workspace` / `organization` / `account` 的 domain symbols。
5. 檔案權限判斷只能在 file application + domain 內完成，且必須 default deny。
6. 任何下載連結、上傳 URL、Storage path、metadata 寫入只能由 infrastructure adapter 產生。
7. 檔案版本是 immutable；更新內容只能新增 `FileVersion`，不可原地改寫舊版本 metadata。
8. `archive / restore / soft delete / purge` 只能透過 `File` aggregate 狀態轉移，UI 不可直接 patch status。
9. 與 account / workspace / organization / audit / notification 的互動只能透過 ports，不能直接跨模組 repository 實作或 domain import。
10. 任何跨租戶請求只要 `organizationId` 不一致，必須在最外層 use case 直接拒絕，不能依賴 UI 過濾或 Storage path 猜測。

---

## 4) file module 分層目錄草案與檔案命名建議

```text
modules/file/
├── README.md
├── index.ts
├── domain/
│   ├── entities/
│   │   ├── File.ts
│   │   ├── FileVersion.ts
│   │   ├── PermissionSnapshot.ts
│   │   ├── RetentionPolicy.ts
│   │   └── AuditRecord.ts
│   ├── value-objects/
│   │   ├── FileId.ts
│   │   ├── FileScope.ts
│   │   ├── FileStatus.ts
│   │   ├── FilePermission.ts
│   │   └── StorageObjectPath.ts
│   ├── repositories/
│   │   ├── FileRepository.ts
│   │   ├── FileVersionRepository.ts
│   │   ├── UploadSessionRepository.ts
│   │   └── PermissionSnapshotRepository.ts
│   └── ports/
│       ├── ActorContextPort.ts
│       ├── WorkspaceGrantPort.ts
│       ├── OrganizationPolicyPort.ts
│       ├── BlobStoragePort.ts
│       ├── DownloadUrlSignerPort.ts
│       ├── AuditSinkPort.ts
│       └── NotificationPort.ts
├── application/
│   ├── dto/
│   │   ├── init-upload.dto.ts
│   │   ├── complete-upload.dto.ts
│   │   ├── list-files.dto.ts
│   │   ├── get-download-url.dto.ts
│   │   ├── archive-file.dto.ts
│   │   └── restore-file.dto.ts
│   └── use-cases/
│       ├── init-file-upload.use-case.ts
│       ├── complete-file-upload.use-case.ts
│       ├── list-workspace-files.use-case.ts
│       ├── list-organization-files.use-case.ts
│       ├── get-file-download-url.use-case.ts
│       ├── archive-file.use-case.ts
│       ├── restore-file.use-case.ts
│       └── resolve-file-permissions.use-case.ts
├── infrastructure/
│   ├── firebase/
│   │   ├── FirebaseFileRepository.ts
│   │   ├── FirebaseFileVersionRepository.ts
│   │   ├── FirebaseUploadSessionRepository.ts
│   │   ├── FirebasePermissionSnapshotRepository.ts
│   │   ├── FirebaseBlobStorageAdapter.ts
│   │   ├── FirebaseDownloadUrlSigner.ts
│   │   └── mappers/
│   │       ├── file-document.mapper.ts
│   │       ├── file-version-document.mapper.ts
│   │       ├── permission-snapshot-document.mapper.ts
│   │       └── retention-policy-document.mapper.ts
│   ├── integration/
│   │   ├── AccountActorContextAdapter.ts
│   │   ├── WorkspaceGrantAdapter.ts
│   │   ├── OrganizationPolicyAdapter.ts
│   │   ├── AuditSinkAdapter.ts
│   │   └── NotificationAdapter.ts
├── interfaces/
│   ├── _actions/
│   │   └── file.actions.ts
│   ├── queries/
│   │   └── file.queries.ts
│   ├── components/
│   │   ├── WorkspaceFilesTab.tsx
│   │   └── OrganizationFilesTab.tsx
│   └── presenters/
│       └── file.presenter.ts
```

### 檔名命名原則
- entity：名詞單數，直接反映 aggregate / entity 名稱
- use case：`verb-object.use-case.ts`
- Firebase adapter：`Firebase<Thing>Repository.ts` / `Firebase<Thing>Adapter.ts`
- DTO：`<command>.dto.ts`
- interface entry：集中在 `file.actions.ts` / `file.queries.ts`
- legacy bridge：只能暫存於 `infrastructure/legacy/`，禁止長期存在

---

## 5) 最小可行資料模型

> 原則：檔案 metadata 與權限 / 保留 / 稽核是 file module 的 canonical source；organization / workspace / account 只提供 reference 與 policy input。

### `File`

```ts
interface File {
  id: string;
  organizationId: string;
  workspaceId?: string;
  ownerAccountId: string;
  createdByAccountId: string;
  currentVersionId: string;
  currentVersionNumber: number;
  name: string;
  normalizedName: string;
  extension?: string;
  contentType: string;
  sizeBytes: number;
  checksumSha256: string;
  status: "INITIATED" | "UPLOADING" | "AVAILABLE" | "ARCHIVED" | "SOFT_DELETED" | "PURGED";
  visibility: "PRIVATE" | "WORKSPACE" | "ORGANIZATION";
  classification: "INTERNAL" | "RESTRICTED" | "CONFIDENTIAL";
  tags: string[];
  permissionSnapshotId: string;
  retentionPolicyId: string;
  legalHold: boolean;
  archivedAt?: Timestamp;
  deletedAt?: Timestamp;
  purgeAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `File` 狀態機

```text
INITIATED -> UPLOADING -> AVAILABLE -> ARCHIVED -> AVAILABLE
AVAILABLE -> SOFT_DELETED -> AVAILABLE
SOFT_DELETED -> PURGED
INITIATED -> PURGED     (expired upload session cleanup)
```

#### 狀態規則
- `INITIATED`: 已發 upload-init，但 blob 尚未確認完成
- `UPLOADING`: 已取得 upload target，尚未 complete
- `AVAILABLE`: 可列出、可下載（前提是權限解算通過）
- `ARCHIVED`: 不出現在預設列表，但可 restore
- `SOFT_DELETED`: 對 UI 隱藏，可在保留期內 restore
- `PURGED`: 終態；metadata 可保留精簡 tombstone，但 blob 與版本不可再使用

### `FileVersion`

```ts
interface FileVersion {
  id: string;
  fileId: string;
  organizationId: string;
  workspaceId?: string;
  versionNumber: number;
  storagePath: string;
  storageBucket: string;
  objectGeneration?: string;
  sizeBytes: number;
  contentType: string;
  checksumSha256: string;
  sourceFileName: string;
  uploadedByAccountId: string;
  status: "PENDING_UPLOAD" | "STORED" | "ACTIVE" | "SUPERSEDED" | "PURGED";
  createdAt: Timestamp;
}
```

#### `FileVersion` 狀態機
```text
PENDING_UPLOAD -> STORED -> ACTIVE -> SUPERSEDED
ACTIVE -> PURGED
SUPERSEDED -> PURGED
```

### `PermissionSnapshot`

```ts
interface PermissionSnapshot {
  id: string;
  fileId: string;
  organizationId: string;
  workspaceId?: string;
  defaultEffect: "DENY";
  organizationPolicyVersion: number;
  workspaceGrantVersion?: number;
  actorContextVersion: number;
  allowedPermissions: string[];
  deniedPermissions: string[];
  computedAt: Timestamp;
}
```

### `RetentionPolicy`

```ts
interface RetentionPolicy {
  id: string;
  organizationId: string;
  workspaceId?: string;
  scope: "ORGANIZATION" | "WORKSPACE" | "FILE";
  archiveAfterDays?: number;
  deleteAfterDays?: number;
  purgeAfterDays?: number;
  legalHold: boolean;
  policyVersion: number;
  inheritedFromId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `AuditRecord`

```ts
interface AuditRecord {
  id: string;
  organizationId: string;
  workspaceId?: string;
  fileId: string;
  versionId?: string;
  actorAccountId: string;
  action:
    | "UPLOAD_INIT"
    | "UPLOAD_COMPLETE"
    | "LIST"
    | "DOWNLOAD_URL_ISSUED"
    | "ARCHIVE"
    | "RESTORE"
    | "DELETE"
    | "PURGE";
  result: "SUCCESS" | "DENIED" | "FAILED";
  reason?: string;
  correlationId: string;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
  occurredAt: Timestamp;
}
```

### Firestore collection 建議

```text
fileDocuments/{fileId}
fileDocuments/{fileId}/versions/{versionId}
filePermissionSnapshots/{snapshotId}
fileRetentionPolicies/{policyId}
fileUploadSessions/{uploadSessionId}
fileAuditRecords/{auditRecordId}
```

### 索引建議

1. `fileDocuments`: `(organizationId, workspaceId, status, updatedAt desc)`
2. `fileDocuments`: `(organizationId, ownerAccountId, status, createdAt desc)`
3. `fileDocuments`: `(organizationId, classification, status, updatedAt desc)`
4. `versions`: `(fileId, versionNumber desc)`
5. `fileAuditRecords`: `(organizationId, workspaceId, occurredAt desc)`
6. `fileAuditRecords`: `(fileId, occurredAt desc)`
7. `fileRetentionPolicies`: `(organizationId, scope, policyVersion desc)`
8. `fileUploadSessions`: `(organizationId, expiresAt asc, status)` for cleanup

---

## 6) 權限解算演算法

### 解算輸入
- `organization policy`
- `workspace grants`（若檔案綁定 workspace）
- `account role / membership`
- `file visibility / classification / legalHold`
- `requested permission`（`READ`, `DOWNLOAD`, `WRITE`, `ARCHIVE`, `RESTORE`, `DELETE`, `MANAGE_RETENTION`, `SHARE`）

### 優先序
1. **Tenant boundary**：`organizationId` 不一致立即 deny
2. **Organization policy explicit deny**：最高優先權，任何其他 allow 都不能覆蓋
3. **Legal hold / retention hard rule**：若 action 觸犯保留規則，直接 deny
4. **Workspace explicit deny**：只能在 organization 允許範圍內進一步收斂
5. **Account role capability**：actor 必須擁有執行該 action 的 role capability
6. **Workspace allow / organization allow**：至少需要一個顯式 allow，否則 default deny
7. **File visibility filter**：若檔案是 `PRIVATE`，額外要求 owner 或具 delegated privilege

### 衝突處理原則
- `deny > allow`
- `organization deny > workspace allow`
- `workspace deny > account role allow`
- `account role` 只提供 capability，不單獨成為 allow 來源
- 沒有 explicit allow 時一律 `DENY`

### 偽程式碼

```ts
function resolvePermission(input: ResolvePermissionInput): PermissionDecision {
  const {
    actor,
    file,
    requestedPermission,
    organizationPolicy,
    workspaceGrant,
  } = input;

  if (actor.organizationId !== file.organizationId) {
    return deny("FILE_CROSS_TENANT_ACCESS", "Actor and file belong to different organizations");
  }

  if (organizationPolicy.denies(requestedPermission, file.classification)) {
    return deny("FILE_ORG_POLICY_DENY", "Organization policy denied permission");
  }

  if (file.legalHold && requestedPermission === "DELETE") {
    return deny("FILE_LEGAL_HOLD_ACTIVE", "File is under legal hold");
  }

  if (workspaceGrant?.denies(requestedPermission, actor.accountId)) {
    return deny("FILE_WORKSPACE_GRANT_DENY", "Workspace grant denied permission");
  }

  if (!actor.capabilities.includes(mapPermissionToCapability(requestedPermission))) {
    return deny("FILE_ACCOUNT_CAPABILITY_MISSING", "Actor role does not include required capability");
  }

  const orgAllows = organizationPolicy.allows(requestedPermission, file.visibility, file.classification);
  const workspaceAllows = file.workspaceId
    ? workspaceGrant?.allows(requestedPermission, actor.accountId) ?? false
    : false;

  const visibilityAllows = checkVisibilityRule(file, actor, requestedPermission);

  if (!visibilityAllows) {
    return deny("FILE_VISIBILITY_RESTRICTED", "File visibility rule rejected permission");
  }

  if (orgAllows || workspaceAllows) {
    return allow();
  }

  return deny("FILE_DEFAULT_DENY", "No explicit allow matched");
}
```

---

## 7) 端到端流程設計

### 共用錯誤碼

| 錯誤碼 | 說明 |
| --- | --- |
| `FILE_NOT_FOUND` | 找不到 file 或 version |
| `FILE_PERMISSION_DENIED` | 權限解算拒絕 |
| `FILE_INVALID_STATE` | 狀態轉移不合法 |
| `FILE_CROSS_TENANT_ACCESS` | 跨 organization 邊界 |
| `FILE_UPLOAD_SESSION_EXPIRED` | upload session 過期 |
| `FILE_IDEMPOTENCY_CONFLICT` | 同一 idempotency key 但 payload 不同 |
| `FILE_STORAGE_WRITE_FAILED` | Storage 寫入失敗 |
| `FILE_STORAGE_OBJECT_MISSING` | upload-complete 時找不到 blob |
| `FILE_DOWNLOAD_URL_EXPIRED` | 嘗試使用過期下載 URL |
| `FILE_RETENTION_BLOCKED` | retention / legal hold 阻擋 |

### A. `upload-init`

#### Input DTO
```ts
interface InitFileUploadInput {
  organizationId: string;
  workspaceId?: string;
  actorAccountId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  checksumSha256: string;
  visibility: "PRIVATE" | "WORKSPACE" | "ORGANIZATION";
  classification?: "INTERNAL" | "RESTRICTED" | "CONFIDENTIAL";
  tags?: string[];
  idempotencyKey: string;
}
```

#### Output DTO
```ts
interface InitFileUploadOutput {
  fileId: string;
  versionId: string;
  uploadSessionId: string;
  uploadUrl: string;
  uploadHttpMethod: "PUT";
  storagePath: string;
  expiresAt: string;
}
```

#### Idempotency
- key scope: `(organizationId, actorAccountId, idempotencyKey, command=upload-init)`
- same key + same payload -> 回傳先前結果
- same key + different payload -> `FILE_IDEMPOTENCY_CONFLICT`

### B. `upload-complete`

#### Input DTO
```ts
interface CompleteFileUploadInput {
  organizationId: string;
  workspaceId?: string;
  actorAccountId: string;
  fileId: string;
  versionId: string;
  uploadSessionId: string;
  checksumSha256: string;
  sizeBytes: number;
  storageObjectGeneration?: string;
  idempotencyKey: string;
}
```

#### Output DTO
```ts
interface CompleteFileUploadOutput {
  fileId: string;
  versionId: string;
  status: "AVAILABLE";
}
```

#### Idempotency
- key scope: `(organizationId, fileId, uploadSessionId, idempotencyKey, command=upload-complete)`
- 若 session 已完成且 checksum 相同 -> 回傳 success
- 若 blob metadata 與 session 不符 -> `FILE_STORAGE_OBJECT_MISSING` 或 `FILE_INVALID_STATE`

### C. `list-files`

#### Input DTO
```ts
interface ListFilesInput {
  organizationId: string;
  workspaceId?: string;
  actorAccountId: string;
  statuses?: Array<"AVAILABLE" | "ARCHIVED" | "SOFT_DELETED">;
  search?: string;
  tags?: string[];
  page: number;
  limit: number;
}
```

#### Output DTO
```ts
interface ListFilesOutput {
  data: Array<{
    id: string;
    name: string;
    status: string;
    currentVersionNumber: number;
    contentType: string;
    sizeBytes: number;
    visibility: string;
    classification: string;
    updatedAt: string;
  }>;
  total: number;
  page: number;
  limit: number;
}
```

#### Idempotency
- query，不需要 idempotency key
- server-side 一律重新解權限，不可使用前端快取直接信任

### D. `get-download-url`

#### Input DTO
```ts
interface GetFileDownloadUrlInput {
  organizationId: string;
  workspaceId?: string;
  actorAccountId: string;
  fileId: string;
  versionId?: string;
  reason?: string;
  idempotencyKey: string;
}
```

#### Output DTO
```ts
interface GetFileDownloadUrlOutput {
  fileId: string;
  versionId: string;
  downloadUrl: string;
  expiresAt: string;
}
```

#### Idempotency
- 若同一 key 在有效時間內重放，可回傳相同 URL 或重新簽發但寫同一 audit correlationId
- URL TTL 建議 5~15 分鐘，過期必須重新申請

### E. `archive-file`

#### Input DTO
```ts
interface ArchiveFileInput {
  organizationId: string;
  workspaceId?: string;
  actorAccountId: string;
  fileId: string;
  reason?: string;
  idempotencyKey: string;
}
```

#### Output DTO
```ts
interface ArchiveFileOutput {
  fileId: string;
  status: "ARCHIVED";
}
```

#### Idempotency
- 同一 file 已是 `ARCHIVED` 視為成功重放
- archive 不搬移 blob，只更新 metadata / audit / notification

### F. `restore-file`

#### Input DTO
```ts
interface RestoreFileInput {
  organizationId: string;
  workspaceId?: string;
  actorAccountId: string;
  fileId: string;
  reason?: string;
  idempotencyKey: string;
}
```

#### Output DTO
```ts
interface RestoreFileOutput {
  fileId: string;
  status: "AVAILABLE";
}
```

#### Idempotency
- 同一 file 已是 `AVAILABLE` 視為成功重放
- 若已 `PURGED`，不得 restore，回 `FILE_INVALID_STATE`

---

## 8) Storage path 與檔名命名規範

### 核心規範
1. 第一層一定是 tenant boundary，不允許 accountId 當第一層。
2. storage path 必須 immutable；archive / restore 不移動 blob。
3. 人類可讀檔名只能放最後一段，且前面必須先有 canonical IDs。
4. 不允許單純使用原始檔名當 object key。
5. 必須包含 version segment，避免覆寫。
6. 必須帶 checksum short hash 或 nonce，防碰撞且可稽核。

### 建議 path

#### Temporary upload session
```text
tenants/{organizationId}/upload-sessions/{uploadSessionId}/incoming/{nonce}
```

#### Final blob path
```text
tenants/{organizationId}/workspaces/{workspaceIdOr_org}/files/{fileId}/versions/v{versionNumber}/{versionId}_{checksum12}_{slugifiedName}
```

#### 範例
```text
tenants/org_123/workspaces/ws_456/files/file_789/versions/v3/ver_003_a1b2c3d4e5f6_design-spec.pdf
```

### 檔名規範
- `slugifiedName` 只能保留小寫英數、短橫線、最後副檔名
- 長度上限建議 96 chars（不含前綴 IDs）
- 原始檔名完整值保留在 Firestore metadata `sourceFileName`
- storage path 只用於定位，不用於顯示名稱權威來源

### 可稽核要求
- 每個 `FileVersion` 必須保存 `storageBucket + storagePath + objectGeneration + checksumSha256`
- 每次簽發下載連結必須寫入 `AuditRecord`

---

## 9) interfaces 層契約草案

### Server Actions

```ts
// modules/file/interfaces/_actions/file.actions.ts
export async function initFileUpload(input: InitFileUploadInput): Promise<CommandResult>
export async function completeFileUpload(input: CompleteFileUploadInput): Promise<CommandResult>
export async function archiveFile(input: ArchiveFileInput): Promise<CommandResult>
export async function restoreFile(input: RestoreFileInput): Promise<CommandResult>
```

### Query Wrappers

```ts
// modules/file/interfaces/queries/file.queries.ts
export async function getWorkspaceFiles(input: ListFilesInput): Promise<ListFilesOutput>
export async function getOrganizationFiles(input: ListFilesInput): Promise<ListFilesOutput>
export async function getFileDownloadUrl(input: GetFileDownloadUrlInput): Promise<GetFileDownloadUrlOutput>
```

### `CommandResult` 格式範例

```ts
// success
{
  success: true,
  aggregateId: "file_789",
  version: 3,
}

// failure
{
  success: false,
  error: {
    code: "FILE_PERMISSION_DENIED",
    message: "Actor is not allowed to archive this file",
    context: {
      fileId: "file_789",
      requestedPermission: "ARCHIVE",
    },
  },
}
```

### REST 對外映射（若未來需要 route handlers）
- `POST /api/files/upload-init`
- `POST /api/files/upload-complete`
- `GET /api/files`
- `POST /api/files/:fileId/download-url`
- `POST /api/files/:fileId/archive`
- `POST /api/files/:fileId/restore`

> Route handler 只做 transport mapping；真正規則仍在 file application use cases。

---

## 10) 與既有模組整合方式（只能透過哪些 port）

| 既有模組 | file module 可依賴的 port | 允許取得的資訊 | 禁止方式 |
| --- | --- | --- | --- |
| `account / identity` | `ActorContextPort` | actor accountId、organization membership、role capabilities、account status | 禁止 import `modules/account/domain/*` 或 `modules/identity/domain/*` |
| `workspace` | `WorkspaceGrantPort` | workspace 是否存在、所屬 organization、workspace grants、member scope | 禁止從 `WorkspaceOperationalSignals` 直接取衍生檔案資料 |
| `organization` | `OrganizationPolicyPort` | retention baseline、classification baseline、hard deny / hard allow policy、legal hold policy | 禁止直接 fan-out organization 頁面資料作為 canonical policy source |
| `audit` | `AuditSinkPort` | append-only audit 寫入口 | 禁止 file module 自行寫 organization 頁 UI read model |
| `notification` | `NotificationPort` | 非同步通知發送（例如 upload 完成、封存、還原） | 禁止在 use case 內直接 import notification repository |

### 明確整合原則
- file application 只知道 port interface，不知道他模組具體 repository / Firebase adapter。
- cross-module read model 一律由 file infrastructure 的 adapter 包裝。
- 目前 active read path 已不再依賴 legacy workspace projection；若後續仍需過渡 adapter，必須明確標記 phase-out 並避免重新掛回 `WorkspaceOperationalSignals`。

---

## 11) 三階段 Migration Plan

## Phase 1 — 模組骨架 + UI 解耦（先拆 coupling）

### 變更範圍
- 建立 `modules/file/domain / application / infrastructure / interfaces` 正式骨架
- 建立 `list-workspace-files.use-case.ts` 與 `file.queries.ts`
- 將 `WorkspaceFilesTab` 從 `getWorkspaceFileAssets(workspace)` 改為 `getWorkspaceFiles(...)`
- 目前 read path 已由 `FirebaseFileRepository` 提供，舊 bridge 已可移除

### 風險
- 讀取結果與既有 UI 顯示不一致
- 在 canonical Firestore model 完成前，既有 metadata 映射策略可能需要持續校正

### 回滾
- 回退 `WorkspaceFilesTab` 對 `getWorkspaceFiles` 的使用，改回上一版 file query implementation（不重掛 workspace projection）

### 驗證命令
- `npm run lint`
- `npm run build`

### 完成定義
- `WorkspaceFilesTab` 不再直接 import `WorkspaceOperationalSignals`
- file module 擁有自己的 query entrypoint
- 所有 file 顯示路徑已經從 UI -> file interfaces -> file application -> file infrastructure 走通

---

## Phase 2 — Canonical Firestore model + upload/download lifecycle

### 變更範圍
- 落地 `File / FileVersion / UploadSession / PermissionSnapshot` Firestore collections
- 實作 `init-file-upload.use-case.ts`、`complete-file-upload.use-case.ts`、`get-file-download-url.use-case.ts`
- 實作 Firebase Storage adapter 與 signer
- 延續清理與 canonical model 衝突的舊 metadata 轉接邏輯（`LegacyWorkspaceFileAssetBridge` 已移除）

### 風險
- signed URL 與 metadata 寫入不一致
- upload-complete 可能遇到 blob 已存在但 metadata 未提交的半完成狀態

### 回滾
- 停用新 upload actions，保留 read-only 查詢
- upload session collection 可用 TTL cleanup 回收未完成資料
- 保留 legacy read bridge 作為 fallback，直到 canonical collection 穩定

### 驗證命令
- `npm run lint`
- `npm run build`

### 完成定義
- 檔案 metadata 已由 file module 自己持有
- workspace file list 改讀 `fileDocuments`
- download URL 只由 file module signer 發放

---

## Phase 3 — governance / retention / archive / restore / organization aggregation

### 變更範圍
- 實作 `archive-file.use-case.ts`、`restore-file.use-case.ts`
- 實作 organization-level list query 與 retention policy resolution
- 串接 audit / notification ports
- 將 organization / workspace file lists 統一切到 file read model

### 風險
- policy resolution 與 UI 預期不一致
- archive / restore / soft delete 對歷史版本顯示造成混淆

### 回滾
- archive / restore actions 可 feature-flag 關閉
- organization list 可暫時回退為只讀 workspace aggregation，但 canonical policy 不回退

### 驗證命令
- `npm run lint`
- `npm run build`

### 完成定義
- organization file list 顯示的是該 organization 底下所有 workspace / org-scope files 的正式聚合結果
- 權限、保留、稽核、通知都經由 file module ports
- legacy bridge 完全移除

---

## 12) 測試策略矩陣

> 目前 `package.json` 尚無 test script；以下矩陣是正式模組落地時必須補齊的測試面，工具選型需遵循當下 repo 標準，不在本方案內新增測試框架決策。

| Layer | 主要測試標的 | 必測案例 |
| --- | --- | --- |
| `domain` | `File` / `FileVersion` / `RetentionPolicy` 狀態與不變式 | 狀態衝突、版本不可覆寫、軟刪除後不可直接下載、purged 不可 restore |
| `application` | use cases + permission resolution | 權限衝突（org deny vs workspace allow）、default deny、跨租戶隔離、legal hold 阻擋 delete、版本回朔時 currentVersion 不被污染 |
| `interfaces` | action/query contract | DTO validation、錯誤碼映射、CommandResult shape、過期下載連結要求重新簽發 |
| `infrastructure` | Firestore / Storage adapters | storage path 命名、防碰撞、metadata round-trip、signed URL TTL、upload session 冪等重放 |

### 至少要覆蓋的情境
1. **權限衝突**：organization deny + workspace allow -> deny
2. **跨租戶隔離**：actor.organizationId != file.organizationId -> deny
3. **過期下載連結**：過期後重新申請成功，舊連結不可再信任
4. **版本回朔**：恢復到舊版本時不覆寫歷史 version record，而是切換 currentVersion pointer 或新增 restore version
5. **軟刪除與還原**：soft delete 後預設列表不可見，restore 後重新可見
6. **封存與還原**：archive 不移動 blob，只改 metadata；restore 成功後列表重新出現

---

## 13) 第一個 PR 就能做的任務拆解清單

> 目標：先把 `modules/file` 從 interface-only 變成正式模組骨架，並優先拆掉 `WorkspaceOperationalSignals` 對檔案 UI 的耦合。

### P0 — 建立正式模組骨架
1. **新增** `modules/file/domain/entities/File.ts`
   - Symbol: `File`, `FileStatus`, `archive()`, `restore()`
   - 驗收：有明確狀態轉移規則，禁止非法 transition
2. **新增** `modules/file/domain/entities/FileVersion.ts`
   - Symbol: `FileVersion`, `FileVersionStatus`
   - 驗收：版本 immutable，只有 status 可從 pending -> stored -> active/superseded
3. **新增** `modules/file/domain/repositories/FileRepository.ts`
   - Symbol: `FileRepository`
   - 驗收：至少定義 `findById`, `listByWorkspace`, `save`
4. **新增** `modules/file/domain/ports/ActorContextPort.ts`
   - Symbol: `ActorContextPort`
   - 驗收：可提供 account role / org membership 的最小 contract
5. **新增** `modules/file/domain/ports/WorkspaceGrantPort.ts`
   - Symbol: `WorkspaceGrantPort`
   - 驗收：可提供 workspace 所屬 organization 與 grants contract
6. **新增** `modules/file/domain/ports/OrganizationPolicyPort.ts`
   - Symbol: `OrganizationPolicyPort`
   - 驗收：可提供 retention / classification / deny policy contract

### P1 — 落地 read-side 最小 use case
7. **新增** `modules/file/application/use-cases/list-workspace-files.use-case.ts`
   - Symbol: `ListWorkspaceFilesUseCase`
   - 驗收：不 import Firebase / React / Next.js
8. **移除** `modules/file/infrastructure/legacy/LegacyWorkspaceFileAssetBridge.ts`
   - Symbol: `LegacyWorkspaceFileAssetBridge`
   - 驗收：不再保留對 `WorkspaceOperationalSignals` 的檔案投影依賴
9. **新增** `modules/file/interfaces/queries/file.queries.ts`
   - Symbol: `getWorkspaceFiles`
   - 驗收：對外回傳 stable DTO，供 UI 使用
10. **更新** `modules/file/index.ts`
   - Symbol export：`WorkspaceFilesTab` + `getWorkspaceFiles`
   - 驗收：file module 有自己的 public API

### P2 — 拆掉 UI 對 workspace domain signal 的直連
11. **更新** `modules/file/interfaces/components/WorkspaceFilesTab.tsx`
   - 變更：移除 `getWorkspaceFileAssets(workspace)` import
   - 改為：呼叫 `getWorkspaceFiles({ organizationId, workspaceId, actorAccountId, ... })`
   - 驗收：UI 不再直連 workspace domain signal
12. **必要時新增** `modules/file/interfaces/presenters/file.presenter.ts`
   - Symbol: `toWorkspaceFileCardViewModel`
   - 驗收：UI 格式轉換不留在 use case / infrastructure

### 第一個 PR 驗收條件
- `modules/file` 不再是 interface-only 模組
- `WorkspaceFilesTab` 不再 import `WorkspaceOperationalSignals`
- file 模組具備至少一條正式 read path：UI -> file query -> file use case -> file infra bridge
- `npm run lint` 通過
- `npm run build` 通過

---

## 建議的第一個實作切片（結論）

**先做 read-side 解耦，不先做 upload command。**

原因：
- 目前最嚴重的架構問題不是少一個上傳 API，而是 file UI 還掛在 workspace domain 衍生函式上。
- 先拆 coupling，才能讓後續 upload / version / permission / retention 都有正確落點。
- 這也是最小、最安全、最符合本專案 MDDD 遷移順序的第一個 PR。
