# Aggregates — source

## 聚合根：SourceDocument（File.ts）

### 職責
管理文件的上傳生命週期，從上傳初始化到完成確認，以及版本快照與保留政策。

### 生命週期狀態機
```
pending_upload ──[upload_complete]──► uploaded ──[archive]──► archived
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 文件主鍵 |
| `name` | `string` | 檔案名稱 |
| `organizationId` | `string` | 所屬組織 |
| `workspaceId` | `string \| null` | 所屬工作區 |
| `status` | `FileStatus` | `pending_upload \| uploaded \| archived` |
| `versions` | `FileVersion[]` | 版本列表 |
| `retentionPolicy` | `RetentionPolicy \| null` | 保留政策 |
| `permissionSnapshot` | `PermissionSnapshot` | 上傳時授權快照 |

---

## 聚合根：WikiLibrary

### 職責
RAG 文件的邏輯集合容器，對應使用者在 UI 看到的「知識庫」概念。

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `FileVersion` | 版本快照（versionId, fileUrl, createdAt） |
| `RetentionPolicy` | 保留規則（retainDays, deleteAfterExpiry） |
| `PermissionSnapshot` | 上傳時的授權快照（不可變） |
| `AuditRecord` | 操作稽核記錄（append-only） |

---

## Ports（Hexagonal Architecture）

| Port | 說明 |
|------|------|
| `ActorContextPort` | 解析操作者身分與授權 |
| `OrganizationPolicyPort` | 查詢組織層級政策 |
| `WorkspaceGrantPort` | 驗證工作區授權 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `FileRepository` | `save()`, `findById()`, `listByWorkspace()` |
| `RagDocumentRepository` | `save()`, `findByDocumentId()` |
| `WikiLibraryRepository` | `save()`, `findByWorkspaceId()` |
