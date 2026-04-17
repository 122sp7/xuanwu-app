# 6120 Migration Gain — platform 新子域

- Status: Recorded
- Date: 2026-04-17
- Category: Migration Gain > platform

## Context

`xuanwu-skill`（新）在 `src/modules/platform/subdomains/` 中新增了 2 個子域，這些子域在 `xuanwu-app-skill`（舊）的 `modules/platform/subdomains/` 中不存在：`cache`、`file-storage`。

### 新增的 2 個子域

#### 1. `cache`

```
platform/subdomains/cache/
  domain/      — CacheEntry aggregate（快取條目生命週期）
  application/ — SetCache, GetCache, InvalidateCache, InvalidateByTag use cases
```

職責：platform 層級的跨域快取管理。提供帶 TTL 與 tag-based invalidation 的快取能力，供 workspace/notion/notebooklm 使用（如快取 Entitlement 決策、常用 query 結果等）。

業務不變條件：
- 快取 key 必須帶 namespace prefix 以隔離不同模組的快取空間
- TTL 到期後 entry 自動失效，不允許使用過期快取做業務決策
- tag invalidation 需保證原子性（同一 tag 的所有條目同時失效）

**注意**：此子域是 Next.js 15+ `"use cache"` 指令在 application 層的業務治理抽象，不是直接使用 Redis/Vercel KV 的 infra adapter。

#### 2. `file-storage`

```
platform/subdomains/file-storage/
  domain/
    FileAsset.ts       — 文件資產聚合根
      ← create(), publish(), delete(), setMetadata()
      ← _domainEvents: FileAssetUploaded, FileAssetDeleted
    FileMetadata.ts    — 文件後設資料 value object
    FileId.ts          — 文件 ID 品牌型別
  application/
    UploadFile.use-case.ts
    DeleteFile.use-case.ts
    GetFileUrl.use-case.ts
  ports/
    FileStoragePort.ts — 文件儲存抽象介面（對接 Firebase Storage）
```

職責：platform 層統一的文件生命週期管理。這是 `FileAPI.uploadUserFile()` 合約（ADR 6108）的 domain 實作基礎。

業務不變條件：
- 每個 FileAsset 必須有明確的 `ownerId` 和 `workspaceId` 以支援多租戶隔離
- 文件刪除需先將狀態設為 `pending-deletion`，由後台任務實際刪除 Storage 上的 bytes
- `FileId` 是 platform 層的唯一識別符，下游模組只持有 `FileId` reference，不持有 Storage URL

### 現狀

這 2 個子域目前是骨架，`file-storage` 有基本的 domain 結構，`cache` 只有 use-case stub。

## Decision

此為已規劃但尚未完整實作的子域。`file-storage` 優先於 `cache`，因為 `FileAPI` 合約（ADR 6108）直接依賴 `file-storage` 的 domain model。

## Consequences

- `file-storage` 骨架存在但尚未連接 Firebase Storage adapter，`FileAPI.uploadUserFile()` 無法透過 platform domain 路徑執行。
- `cache` 的缺失對 MVP 影響不大，但 Entitlement 快取（降低 Firestore reads）需要此子域。

## 關聯 ADR

- **6108** platform API contracts：`FileAPI` 的 `uploadUserFile()` 的 domain 基礎是 `file-storage.FileAsset`。
- **6107** platform domain model：`FileStoragePort` 是 platform domain ports 的一部分。
