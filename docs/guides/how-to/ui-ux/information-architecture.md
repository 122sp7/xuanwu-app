# 資訊架構（Information Architecture）

> **參考文件類型**：本文件定義 Xuanwu App 的全站資訊架構、導覽層級、路由地圖與頁面組織原則。
> 實際路由以目前應用程式路由實作為準；本文件作為閱讀地圖與設計指引。

---

## 1. 全站資訊架構圖

```
Xuanwu App
├── (public)                          ← 未登入公開區域
│   ├── /login                        ← 登入頁
│   └── /register（planned）          ← 註冊頁
│
└── (shell)                           ← 已登入 Shell（三欄版型）
    ├── /workspace                    ← 工作區中心
    │   └── /workspace/[workspaceId]  ← 單一工作區
    │
    ├── /wiki                    ← 知識庫（Wiki）
    │   ├── /wiki（知識總覽）
    │   ├── /wiki/documents      ← 主操作頁
    │   ├── /wiki/rag-query      ← AI 問答
    │   ├── /wiki/rag-reindex    ← RAG 重整
    │   ├── /wiki/pages          ← 頁面管理
    │   └── /wiki/libraries      ← 資料庫管理
    │
    ├── /ai-chat                      ← AI 對話介面
    │
    ├── /organization                 ← 組織管理
    │   ├── /organization/members     ← 成員管理
    │   ├── /organization/teams       ← 團隊管理
    │   ├── /organization/permissions ← 權限管理
    │   ├── /organization/workspaces  ← 工作區管理
    │   ├── /organization/schedule    ← 排程管理
    │   ├── /organization/daily       ← 每日摘要
    │   └── /organization/audit       ← 稽核記錄
    │
    ├── /dashboard                    ← 個人儀表板
    │
    └── /settings                     ← 設定
```

---

## 2. Shell 版型層級

### 2.1 三欄結構

```
+--App Rail--+--Secondary Nav (Dashboard Sidebar)--+--Main Content--+
|   48px     |           240px（可收合）              |   flex-1       |
|            |                                       |                |
| 圖示導覽   |  依所在區域顯示次要導覽                |  page.tsx      |
|            |                                       |  協調層        |
+------------+---------------------------------------+----------------+
```

### 2.2 App Rail（最左欄）

App Rail 提供**跨功能區域**的頂層導覽，圖示帶 Tooltip。

| 圖示 | 路由 | 標籤 |
|---|---|---|
| `Building2` | `/workspace` | 工作區中心 |
| `BookOpen` | `/wiki` | Account Wiki |
| `Bot` | `/ai-chat` | AI 對話 |
| `Users` | `/organization` | 組織管理 |
| `FlaskConical` | `/dev-tools`（開發環境） | 開發工具 |
| `Settings` | `/settings` | 設定 |
| `Plus` | — | 快速建立工作區 / 組織 |

### 2.3 Dashboard Sidebar（次要側邊欄）

次要側邊欄根據**目前所在的功能區域**動態顯示對應的子導覽。

**工作區（/workspace/[id]）子導覽**：

| 群組 | 項目 |
|---|---|
| Primary | Overview、Members |
| Spaces | Spaces 列表 |
| Databases | Databases 列表 |
| Library | Files、Documents |
| Modules | Issues、Tasks、Schedule、Daily |

**Wiki（/wiki）子導覽**：

| 項目 | 路由 | 狀態 |
|---|---|---|
| 知識總覽 | `/wiki` | ✅ 現有 |
| RAG Query | `/wiki/rag-query` | ✅ 現有 |
| RAG Reindex | `/wiki/rag-reindex` | ✅ 現有 |
| Documents [+] | `/wiki/documents` | ✅ 現有 |
| Pages | `/wiki/pages` | ✅ 現有 |
| Libraries | `/wiki/libraries` | ✅ 現有 |
| Workspaces | — | ✅ 現有（可摺疊） |

**組織管理（/organization）子導覽**：

| 項目 | 路由 | 說明 |
|---|---|---|
| 成員 | `/organization/members` | 組織成員管理 |
| 團隊 | `/organization/teams` | 群組管理 |
| 權限 | `/organization/permissions` | RBAC 角色與權限 |
| 工作區 | `/organization/workspaces` | 組織下工作區管理 |
| 排程 | `/organization/schedule` | 排程管理 |
| 每日 | `/organization/daily` | 每日摘要 |
| 稽核 | `/organization/audit` | 操作稽核記錄 |

---

## 3. 路由設計原則

### 3.1 路由命名規則

| 類型 | 格式 | 範例 |
|---|---|---|
| 資源列表 | `/resource` | `/wiki/documents` |
| 資源詳情 | `/resource/[id]` | `/workspace/[workspaceId]` |
| 功能子頁 | `/context/function` | `/wiki/rag-query` |
| 設定頁 | `/resource/settings` | `/workspace/[id]/settings` |

### 3.2 路由群組（Route Groups）

Next.js App Router 使用路由群組 `(name)` 來共用 layout 而不影響 URL：

| 群組 | 路徑 | 共用 layout |
|---|---|---|
| `(public)` | — | 未登入頁面 layout（無 Shell） |
| `(shell)` | — | 已登入 Shell layout（三欄版型 + Auth guard） |

### 3.3 URL 參數規範

| 參數 | 說明 | 範例 |
|---|---|---|
| `workspaceId` | workspace 篩選視角 | `?workspaceId=ws_123` |
| `tab` | 功能頁籤切換 | `?tab=overview` |
| `q` | 搜尋關鍵字 | `?q=keyword` |

---

## 4. 資料範圍與 Scope 設計

Xuanwu App 的資料圍繞三層結構：

```
System
└── Account（個人帳號 / 組織帳號）
    └── Workspace（工作區）
        └── Resources（Pages、Files、Documents...）
```

| 層次 | 說明 | 存取範圍 |
|---|---|---|
| **Account** | 資料主範圍。所有資料歸屬於帳號，不跨帳號共用。 | 帳號擁有者 + 邀請成員 |
| **Workspace** | 帳號下的分組視角。workspace 是篩選，不是資料邊界。 | Workspace 成員 |
| **Namespace** | 路由 slug 機制，背景能力，不在 UI 中獨立暴露。 | 系統內部 |

**重要設計原則**：
- 使用者的 **預設視角** 為帳號全覽（account scope）。
- 切換 workspace 是「縮小視角」的操作，不是「換資料庫」的操作。
- 跨 workspace 的資料彙總需在 account 層完成。

---

## 5. 頁面類型分類

### 5.1 列表頁（List Page）

顯示某類資源的清單，支援篩選、排序與操作。

**必要元素**：
- 頁首標題 + 篩選狀態提示
- 載入中骨架屏（Skeleton）
- 空狀態（Empty State）+ 引導行動
- 每列的操作按鈕

**範例**：`/wiki/documents`、`/wiki/pages`

### 5.2 詳情頁（Detail Page）

顯示單一資源的完整資訊，支援編輯操作。

**必要元素**：
- 返回連結（Back button）
- 資源標題 + 元資料
- 內容主體
- 操作按鈕（Edit / Delete / Share）

**範例**：`/workspace/[workspaceId]`

### 5.3 功能操作頁（Functional Page）

以特定功能為主（非 CRUD 列表），例如 RAG 查詢、上傳操作。

**必要元素**：
- 操作輸入區
- 執行按鈕（含 loading 狀態）
- 結果顯示區
- 錯誤 / 空狀態處理

**範例**：`/wiki/rag-query`、`/wiki/rag-reindex`

### 5.4 總覽頁（Overview / Dashboard Page）

提供某功能區域的整體摘要與入口。

**必要元素**：
- 快速操作入口（Quick Actions）
- 統計摘要（Counters / Metrics）
- 最近活動或重要提示

**範例**：`/wiki`（知識總覽）

---

## 6. 導覽自訂化

使用者可透過「自訂導覽」對話框（`CustomizeNavigationDialog`）調整側邊欄顯示的項目：

- **偏好存儲**：`localStorage` key `xuanwu:nav-preferences`
- **偏好格式**：pinnedItems（置頂項目）+ workspaceOrder（工作區排序）
- **有效項目集合**：系統定義 `VALID_PINNED_ITEMS` 與 `VALID_WORKSPACE_ORDER_IDS`，確保偏好合法性

---

## 7. 搜尋與導覽輔助

### 7.1 全站搜尋（planned）

- **入口**：Header 右側搜尋圖示（`/search`）
- **範圍**：account 範圍內所有 Pages、Documents、Records
- **鍵盤捷徑**：`Cmd/Ctrl + K`

### 7.2 麵包屑（Breadcrumb）

- 目前各頁面使用「← 返回」按鈕
- 計畫在頁首加入麵包屑導覽（planned）

### 7.3 語言切換

- Header Controls 提供語言切換器（`translation-switcher.tsx`）
- 支援語言：中文（繁體）、英文（計畫中）
