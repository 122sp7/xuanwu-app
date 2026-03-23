# 系統全局規格（System Overview Specification）

> **規格文件類型**：本文件描述 Xuanwu App 的系統定位、目標用戶、核心功能、技術架構與運行時邊界。

---

## 1. 系統定位

**Xuanwu App** 是一個**企業知識管理與 AI 輔助的工作區平台**，提供：

- Notion-style 頁面與資料庫管理（Wiki-Beta）
- 企業級 RAG（Retrieval-Augmented Generation）知識查詢
- 多工作區協作與組織管理
- 文件解析、向量化與智慧問答

### 1.1 核心價值主張

| 面向 | 價值 |
|---|---|
| **知識管理** | 像 Notion 一樣建立頁面、資料庫，組織企業知識 |
| **AI 驅動** | 上傳文件後自動解析、向量化，支援自然語言查詢 |
| **多工作區** | 一個組織帳號可管理多個工作區，資料有效隔離 |
| **可觀測** | 文件處理狀態、RAG 索引狀態均可在 UI 即時觀測 |

---

## 2. 目標用戶

| 用戶類型 | 說明 | 核心需求 |
|---|---|---|
| **個人知識工作者** | 個人帳號使用者 | 個人頁面管理、文件上傳、AI 問答 |
| **企業團隊協作者** | 組織帳號成員 | 多工作區協作、文件共享、RAG 查詢 |
| **組織管理員（Admin）** | 擁有管理權限的成員 | 成員管理、權限設定、稽核記錄 |
| **系統管理員（Sysadmin）** | 後台操作人員 | 部署、監控、資料治理 |

---

## 3. 核心功能規格

### 3.1 Account 與 Workspace 管理

| 功能 | 說明 | 模組 |
|---|---|---|
| 個人帳號 | 用戶可建立個人帳號 | `account` |
| 組織帳號 | 用戶可建立組織，組織有獨立帳號 | `organization`, `account` |
| 工作區建立 | 帳號下可建立多個工作區 | `workspace` |
| 成員邀請 | 組織可邀請成員加入，分配角色 | `account`, `organization` |
| 角色與權限 | RBAC 模型；Admin / Member / Viewer 等角色 | `account` |

### 3.2 知識庫（Wiki-Beta）

| 功能 | 說明 | 模組 |
|---|---|---|
| 文件上傳 | 支援 PDF、TIFF、PNG、JPEG | `wiki-beta` |
| 文件列表 | Account 全覽；workspace 篩選 | `wiki-beta` |
| 文件解析 | Google Document AI 自動解析 | `py_fn` |
| RAG 向量化 | 文件切塊 + OpenAI Embedding | `py_fn` |
| RAG 問答 | 自然語言問答，含引用來源 | `wiki-beta`, `ai` |
| RAG 重整 | 手動觸發 RAG 重新索引 | `wiki-beta` |
| Pages | Notion-style 頁面建立與管理 | `wiki-beta` |
| Libraries | 結構化資料庫（類 Notion Database） | `wiki-beta` |

### 3.3 AI 功能

| 功能 | 說明 | 模組 |
|---|---|---|
| AI Chat | 通用 AI 對話介面 | `ai` |
| RAG 查詢 | 基於文件的智慧問答 | `ai`, `wiki-beta` |
| 知識摘要 | 文件自動摘要（RAG pipeline） | `py_fn` |

### 3.4 組織管理

| 功能 | 說明 | 模組 |
|---|---|---|
| 成員管理 | 邀請、移除、角色調整 | `account`, `organization` |
| 團隊管理 | 成員分組 | `organization` |
| 排程管理 | 雙向資源排程 | `schedule` |
| 每日摘要 | 每日工作流程記錄 | `daily` |
| 稽核記錄 | 操作稽核追蹤 | `audit` |

---

## 4. 技術架構規格

### 4.1 運行時邊界

系統分為兩個主要運行時：

| 運行時 | 職責 | 技術 |
|---|---|---|
| **Next.js（前端/後端）** | 頁面渲染、互動 UI、Server Actions、查詢協調 | Next.js 16, React 19, TypeScript |
| **py_fn（Python Worker）** | 文件解析、向量化、RAG pipeline | Python 3.11, Firebase Cloud Functions |

**禁止跨越邊界**：
- Next.js 不執行 parse/chunk/embed（這些在 py_fn）。
- py_fn 不持有 UI 狀態或 session 邏輯。

### 4.2 資料層架構

```
Firebase Firestore    ← 主要資料儲存（accounts/{accountId}/...）
Firebase Storage      ← 檔案儲存（上傳文件）
Upstash Vector        ← 向量索引（RAG）
Upstash Redis         ← 快取（RAG query cache）
```

### 4.3 Firestore 資料模型（頂層）

```
accounts/{accountId}/
├── documents/{documentId}     ← 文件（Wiki-Beta）
├── pages/{pageId}             ← 頁面（Pages）
├── databases/{databaseId}     ← 資料庫（Libraries）
├── workspaces/{workspaceId}   ← 工作區（Workspace）
└── members/{memberId}         ← 成員（Account）
```

> **重要規則**：所有讀寫必須在 `accounts/{accountId}/...` 路徑下，禁止查詢頂層 collection。

### 4.4 認證與授權

```
Firebase Auth → AuthProvider（client） → Shell Guard → RBAC（account roles）
```

| 角色 | 說明 |
|---|---|
| `owner` | 帳號擁有者，全部權限 |
| `admin` | 管理員，可管理成員與設定 |
| `member` | 一般成員，可讀寫工作區資源 |
| `viewer` | 唯讀成員，只能查看 |

---

## 5. 模組責任邊界

20 個 MDDD 業務模組的責任分配：

| 模組 | 職責概要 |
|---|---|
| `account` | 用戶帳號、成員角色、帳號策略 |
| `organization` | 組織（租戶）管理、策略 |
| `workspace` | 工作區管理、成員管理 |
| `wiki-beta` | 知識庫、文件、Pages、Libraries、RAG |
| `ai` | AI 協調、RAG 查詢（不擁有資料） |
| `file` | 檔案生命週期、版本、權限 |
| `identity` | 身份認證、Token 刷新 |
| `audit` | 不可變稽核記錄 |
| `event` | 領域事件 Bus |
| `schedule` | 雙向排程 |
| `daily` | 每日摘要 |
| `namespace` | Slug 路由機制 |
| `billing` | 帳務記錄（佔位，高風險） |
| `finance` | 財務追蹤 |
| `issue` | 問題追蹤 |
| `task` | 任務管理 |
| `parser` | 文件解析就緒狀態 |
| `acceptance` | 工作區就緒驗收 |
| `notification` | 通知 |
| `qa` | 品質保證 |

---

## 6. 整合點

| 整合對象 | 用途 | SDK/協議 |
|---|---|---|
| Firebase Firestore | 資料儲存 | Firebase SDK v12 |
| Firebase Storage | 檔案儲存 | Firebase SDK v12 |
| Firebase Auth | 身份認證 | Firebase SDK v12 |
| Firebase Cloud Functions | Callable 觸發 | Firebase SDK v12 |
| Google Document AI | PDF 解析 | Google Cloud SDK（py_fn） |
| Google Genkit | AI Flow 協調 | Genkit 1.30.1 |
| OpenAI | Embedding 生成 | OpenAI SDK（py_fn） |
| Upstash Vector | 向量搜尋 | Upstash SDK |
| Upstash Redis | 快取 | Upstash SDK |
| QStash | 非同步任務佇列 | Upstash QStash |

---

## 7. 驗收標準（系統級別）

| 代號 | 標準 |
|---|---|
| S1 | 使用者可登入並進入 Shell |
| S2 | 使用者可建立組織與工作區 |
| S3 | 使用者可上傳文件並在列表看到 |
| S4 | 文件解析後 `status` 更新為 `ready` |
| S5 | RAG 問答可回傳 answer 與 citations |
| S6 | 管理員可管理組織成員與角色 |
| S7 | Console 無初始化錯誤 |
| S8 | `npm run lint` 0 errors；`npm run build` 成功 |
