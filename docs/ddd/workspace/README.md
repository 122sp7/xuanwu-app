# workspace — 工作區上下文

> **Domain Type:** Generic Subdomain
> **模組路徑:** `modules/workspace/`
> **開發狀態:** ✅ Done — 穩定

## 定位

`workspace` 是 Xuanwu 平台的**協作容器**，所有知識內容、任務、稽核記錄都歸屬於特定工作區。它也持有 Wiki 內容樹結構（WikiContentTree）與工作區成員管理。

## 職責

| 能力 | 說明 |
|------|------|
| Workspace CRUD | 建立、更新、歸檔工作區 |
| 成員管理 | WorkspaceMember 邀請、移除、角色變更 |
| Wiki 內容樹 | 維護 WikiContentTree（頁面的樹狀層級結構） |
| Wiki 工作區關聯 | 管理 WikiWorkspaceRepository（Wiki 頁面隸屬關係） |
| 子模組組合 | 在 WorkspaceDetailScreen 組合 workspace-{flow,audit,feed,scheduling} tabs |

## 核心概念

- **`Workspace`** — 協作容器（accountId、name、status）
- **`WorkspaceMember`** — 成員在工作區中的參與記錄
- **`WikiContentTree`** — 工作區 Wiki 頁面的樹狀層級結構

## 特殊邊界規則

`workspace/infrastructure/firebase/FirebaseWikiWorkspaceRepository.ts` **禁止** import `@/modules/workspace/api`（循環依賴）。此檔案用相對路徑直接 import `FirebaseWorkspaceRepository`。

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | Workspace 聚合根設計 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
