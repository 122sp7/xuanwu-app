# Xuanwu App — 企業知識庫首頁

> 這是 Xuanwu App 的企業知識庫（Enterprise Knowledge Base）入口。  
> 以 Notion + Wiki 風格組織，讓所有團隊成員——工程師、設計師、PM、管理員——都能快速找到所需資訊。

---

## 🗺 知識庫地圖

| 類別 | 描述 | 入口 |
|---|---|---|
| 🎨 **UI/UX 設計** | 設計語言、線框圖、元件規範 | [→ UI/UX](../ui-ux/README.md) |
| 🏗 **系統架構** | 架構圖、ADR、資料模型 | [→ 架構](#architecture) |
| 📋 **規格與契約** | 系統規格、功能規格、開發契約 | [→ 規格](../specification/README.md) |
| 💻 **開發指南** | 開發流程、分支策略、程式碼風格 | [→ 開發](../development/README.md) |
| 📖 **使用手冊** | 使用者指南、管理員指南 | [→ 手冊](../user-manual/README.md) |
| 🧪 **Wiki-Beta** | 知識庫功能規格與操作手冊 | [→ Wiki-Beta](../wiki-beta/) |
| 📚 **參考文件** | API 契約、AI Workflow | [→ 參考](../reference/) |

---

## 🚀 快速入口

### 我是產品經理（PM）

- [系統全局規格](../specification/system-overview.md) — 了解系統定位與核心功能
- [UI/UX 資訊架構](../ui-ux/information-architecture.md) — 了解頁面結構與導覽設計
- [Wiki-Beta 設計規格](../wiki-beta/wiki-beta-design-spec.md) — 知識庫功能規格

### 我是 UI/UX 設計師

- [設計系統](../ui-ux/design-system.md) — 色彩、字型、間距規範
- [UX 原則](../ui-ux/ux-principles.md) — 互動模式與可近用性規範
- [線框圖](../ui-ux/wireframes.md) — 各頁面版型設計
- [元件模式](../ui-ux/component-patterns.md) — UI 元件使用規範

### 我是前端工程師

- [開發流程](../development/development-process.md) — MDDD 七步驟開發流程
- [程式碼風格](../development/code-style.md) — TypeScript/React 規範
- [元件模式](../ui-ux/component-patterns.md) — 元件設計與反模式
- [MDDD 架構指南](../../agents/knowledge-base.md) — 模組職責與邊界

### 我是後端工程師 / AI 工程師

- [系統架構圖](../diagrams/README.md) — 所有架構圖索引
- [開發契約總覽](../reference/development-contracts/overview.md) — API 與資料契約
- [ADR 決策記錄](../adr/) — 架構決策理由
- [py_fn README](../../py_fn/README.md) — Python Worker 架構

### 我是系統管理員

- [管理員指南](../user-manual/admin-guide.md) — 成員管理、部署、維運
- [PERMISSIONS.md](../../PERMISSIONS.md) — RBAC 角色與權限矩陣

### 我是一般使用者

- [使用者指南](../user-manual/user-guide.md) — 平台功能操作說明
- [Wiki-Beta 使用手冊](../wiki-beta/wiki-beta-user-manual.md) — 知識庫詳細操作

---

## 🏗 系統架構 {#architecture}

### 架構圖快速參考

| 圖表 | 說明 | 適合讀者 |
|---|---|---|
| [系統多工作區層級](../diagrams/system-multi-workspace-hierarchy.mermaid) | System → Account → Workspace 層級 | PM、設計師、Architect |
| [系統架構總覽](../diagrams/system-architecture-overview-combined.mermaid) | 完整系統架構圖 | Architect、Tech Lead |
| [工作區資料模型](../diagrams/workspace-internal-data-model.mermaid) | Entity 關係圖 | Backend、Data Designer |
| [API 資料流](../diagrams/api-data-flow.mermaid) | Browser → Firebase 資料流 | Full-stack Engineer |
| [Firestore 路徑結構](../diagrams/firestore-collection-path-structure.mermaid) | Collections 路徑拓撲 | Backend、Security |
| [RAG 入庫 State Machine](../diagrams/kb-ingestion-pipeline-state-machine.mermaid) | 知識入庫 Pipeline | AI Engineer |

詳細索引：[架構圖索引](../diagrams/README.md)

### 技術棧

| 層次 | 技術 | 版本 |
|---|---|---|
| 框架 | Next.js App Router | 16 |
| UI | React | 19 |
| 樣式 | Tailwind CSS + shadcn/ui | 4 |
| 後端 | Firebase（Firestore、Storage、Auth） | 12 |
| AI | Google Genkit + Document AI | 1.30.1 |
| 向量 | Upstash Vector | — |
| Worker | Python 3.11 Cloud Functions | — |

---

## 📋 規格與契約

### 系統規格

- [系統全局規格](../specification/system-overview.md) — 定位、功能、架構、驗收標準

### 功能規格

| 功能 | 規格文件 |
|---|---|
| Wiki-Beta 知識庫 | [wiki-beta-design-spec.md](../wiki-beta/wiki-beta-design-spec.md) |
| Wiki-Beta UI/UX | [wiki-beta-ui-ux-spec.md](../wiki-beta/wiki-beta-ui-ux-spec.md) |
| Pages & Libraries | [wiki-beta-pages-libraries-design-spec.md](../wiki-beta/wiki-beta-pages-libraries-design-spec.md) |

### 開發契約

所有 API 與 runtime 邊界契約：[開發契約總覽](../reference/development-contracts/overview.md)

---

## 💻 開發資源

| 資源 | 說明 |
|---|---|
| [CONTRIBUTING.md](../../CONTRIBUTING.md) | 貢獻規則與 House Rules |
| [開發流程](../development/development-process.md) | 端對端開發流程 |
| [分支策略](../development/branch-strategy.md) | Git 分支模型與命名規則 |
| [程式碼風格](../development/code-style.md) | TypeScript/React 風格規範 |
| [agents/commands.md](../../agents/commands.md) | 所有 npm / deploy 指令 |

### 關鍵指令

```bash
npm install          # 安裝相依套件
npm run dev          # 啟動開發伺服器
npm run lint         # ESLint（0 errors）
npm run build        # 生產建置 + 型別檢查
```

---

## 📖 使用說明

| 對象 | 文件 |
|---|---|
| 一般使用者 | [使用者指南](../user-manual/user-guide.md) |
| 組織管理員 | [管理員指南](../user-manual/admin-guide.md) |
| 知識庫使用者 | [Wiki-Beta 使用手冊](../wiki-beta/wiki-beta-user-manual.md) |

---

## 🤖 AI 開發工作流程

本專案整合 GitHub Copilot Agent 輔助交付：

| 角色 | 說明 |
|---|---|
| Planner | 建立正式實作計畫 |
| Implementer | 執行實作計畫 |
| Reviewer | 程式碼審查 |
| QA | 驗收測試 |

- [AI 工作流程指南](../how-to/ai/) — 如何啟動 AI 輔助開發
- [Handoff Matrix](../reference/ai/handoff-matrix.md) — 各階段交接規範

---

## 🔒 安全與合規

- [PERMISSIONS.md](../../PERMISSIONS.md) — RBAC 角色與權限
- [Firestore Security Rules](../../firestore.rules) — 資料存取規則
- [Storage Security Rules](../../storage.rules) — 儲存存取規則

---

## 📝 文件維護原則

1. **單一真實來源**：每份資料有唯一的主要文件；其他文件若有重複，以主要文件為準。
2. **同步更新**：架構、API、資料模型變更時，必須同步更新對應文件。
3. **增量更新**：文件版本以時間戳記（例如 2026-03）或版本號標註。
4. **語言一致**：技術術語使用統一詞彙（見 [wiki-beta-naming-alignment.md](../wiki-beta/wiki-beta-naming-alignment.md)）。

---

*最後更新：2026-03 | 維護者：Xuanwu App 工程團隊*
