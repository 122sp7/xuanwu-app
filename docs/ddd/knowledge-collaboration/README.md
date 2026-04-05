# knowledge-collaboration — DDD Reference

> **Domain Type:** Supporting Subdomain + Generic Subdomain
> **Module:** `modules/knowledge-collaboration/`
> **詳細模組文件:** [`modules/knowledge-collaboration/`](../../modules/knowledge-collaboration/)

## 戰略定位

`knowledge-collaboration` 為 `knowledge` 和 `knowledge-base` 提供協作基礎設施：留言討論、細粒度存取權限、版本快照。它不擁有知識內容，只提供協作能力。

## 核心聚合

- **Comment** — 線程式留言，透過 `contentId` 引用內容
- **Permission** — `(subjectId, principalId)` 的存取授權，級別：view < comment < edit < full
- **Version** — Block 快照，immutable，最多保留 100 個（具名版本除外）

## 主要領域事件

- `knowledge-collaboration.comment_created` / `comment_resolved`
- `knowledge-collaboration.permission_granted` / `permission_revoked`
- `knowledge-collaboration.version_created` / `version_restored`
- `knowledge-collaboration.page_locked`

## 通用語言

| 術語 | 定義 |
|---|---|
| **Comment** | 針對 contentId 的留言（root 或 reply） |
| **Permission** | 單一 (subject, principal) 的存取授權記錄 |
| **PermissionLevel** | `view` < `comment` < `edit` < `full` |
| **Version** | immutable Block 快照 |
| **NamedVersion** | 具有人工標籤的具名版本（不自動刪除） |
| **contentId** | opaque reference 到任意知識內容 |

## 上下文關係

| 關係 | BC | 類型 |
|---|---|---|
| 上游 | `workspace`, `identity` | Conformist |
| 上游 | `knowledge`, `knowledge-base`, `knowledge-database` | Customer/Supplier |
| 下游 | `notification`, `workspace-feed`, `workspace-audit` | Published Language |
