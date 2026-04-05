# workspace — Workspace Management Layer

> **開發狀態**：✅ Done — 核心功能穩定
> **Domain Type**：Generic Domain（通用域）

`modules/workspace` 負責工作區（Workspace）的建立、成員協作、設定管理與知識結構樹（WikiContentTree）。是知識內容的協作容器，連接 identity、organization 與 knowledge 等核心域。

外界互動規則：
- 外界只能透過 `api/` 公開介面存取此模組
- `FirebaseWikiBetaWorkspaceRepository` 不能 import `@/modules/workspace/api`（循環依賴），應使用相對路徑直接 import `FirebaseWorkspaceRepository`

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| 工作區管理 | 建立、更新、封存工作區（Workspace） |
| 成員管理 | 邀請成員、管理工作區角色 |
| 知識結構樹 | 維護 WikiContentTree（頁面階層結構） |
| 工作區標籤 | 管理工作區的 Tab 設定（workspace-tabs.ts） |
| 多模組整合 | 整合 Tasks（workspace-flow）、Wiki、Audit 等 tab |

---

## 聚合根（Aggregate Roots）

| Aggregate | 說明 |
|-----------|------|
| `Workspace` | 工作區聚合根，包含成員列表、設定與知識結構 |
| `Member` | 工作區成員實體（含角色） |
| `Role` | 工作區角色定義 |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| 工作區 | Workspace | 知識內容的協作容器 |
| 成員 | Member | 工作區的協作成員 |
| 角色 | Role | 成員在工作區的角色 |
| Wiki 內容樹 | WikiContentTree | 工作區下的 Wiki 頁面階層結構 |
| 工作區標籤 | WorkspaceTab | 工作區 UI 中的功能分頁（Overview / Wiki / Tasks / ...） |

---

## 重要架構限制

- `FirebaseWikiBetaWorkspaceRepository` 不能 import `@/modules/workspace/api`（循環依賴）
- 使用相對路徑直接 import `FirebaseWorkspaceRepository` 作為替代

---

## 導航規則

- Dashboard (/dashboard) 和 Personal Settings (/settings) 已重定向到 /workspace
- MVP 導航以 workspace 為主

---

## 依賴關係

- **上游（依賴）**：`identity/api`、`organization/api`
- **下游（被依賴）**：`knowledge/api`、`wiki/api`、`notebook/api`、`workspace-flow/api`、`workspace-audit/api`

---

## 目錄結構

```
modules/workspace/
├── api/                  # 公開 API 邊界（index.ts）
├── application/          # Use Cases
├── domain/               # Aggregates, Entities（含 WikiContentTree）
│   └── entities/
│       └── WikiContentTree.ts
├── infrastructure/       # Firebase 適配器
│   └── firebase/
│       └── FirebaseWikiBetaWorkspaceRepository.ts
├── interfaces/           # UI 元件（WorkspaceDetailScreen、WorkspaceTabs）
│   ├── components/
│   │   └── WorkspaceDetailScreen.tsx
│   └── workspace-tabs.ts
└── index.ts
```
