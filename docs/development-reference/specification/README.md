# 規格與契約文件索引（Specification & Contract）

本目錄收斂 Xuanwu App 的系統規格、功能規格與開發契約，作為設計、開發、測試與驗收的共同依據。

---

## 文件地圖

| 文件 | 類型 | 說明 |
|---|---|---|
| [system-overview.md](./system-overview.md) | 規格 | 系統全局規格：平台定位、技術架構、運行時邊界 |
| [../reference/development-contracts/overview.md](../reference/development-contracts/overview.md) | 契約索引 | 所有開發契約的入口與說明 |
| [../adr/](../adr/) | ADR | 架構決策記錄（ADR-001 ~ ADR-012） |

---

## 規格層次

Xuanwu App 的規格文件分為三個層次：

```
系統規格（System Spec）         ← 本目錄 system-overview.md
    ↓
功能規格（Feature Spec）        ← docs/wiki-beta/*.md
    ↓
開發契約（Development Contract） ← docs/development-reference/reference/development-contracts/
```

| 層次 | 問什麼 | 讀者 |
|---|---|---|
| **系統規格** | 系統是什麼？目標用戶是誰？技術架構如何？ | PM、Architect、Stakeholder |
| **功能規格** | 這個功能要做什麼？UI 長什麼樣？業務規則是什麼？ | Designer、Frontend、Backend |
| **開發契約** | 介面如何定義？Input/Output 格式？驗收條件？ | Engineer、QA |

---

## 現有功能規格文件

| 功能 | 設計規格 | UI/UX 規格 | 使用手冊 |
|---|---|---|---|
| Wiki-Beta 核心 | [wiki-beta-design-spec.md](../wiki-beta/wiki-beta-design-spec.md) | [wiki-beta-ui-ux-spec.md](../wiki-beta/wiki-beta-ui-ux-spec.md) | [wiki-beta-user-manual.md](../wiki-beta/wiki-beta-user-manual.md) |
| Wiki-Beta Pages/Libraries | [wiki-beta-pages-libraries-design-spec.md](../wiki-beta/wiki-beta-pages-libraries-design-spec.md) | — | [wiki-beta-pages-libraries-user-manual.md](../wiki-beta/wiki-beta-pages-libraries-user-manual.md) |

---

## 開發契約文件

| 契約 | 說明 | 狀態 |
|---|---|---|
| [acceptance-contract.md](../reference/development-contracts/acceptance-contract.md) | 工作區就緒驗收 | ✅ 現有 |
| [audit-contract.md](../reference/development-contracts/audit-contract.md) | 稽核記錄契約 | ✅ 現有 |
| [billing-contract.md](../reference/development-contracts/billing-contract.md) | 帳務契約 | ✅ 現有 |
| [daily-contract.md](../reference/development-contracts/daily-contract.md) | 每日摘要契約 | ✅ 現有 |
| [event-contract.md](../reference/development-contracts/event-contract.md) | 領域事件契約 | ✅ 現有 |
| [namespace-contract.md](../reference/development-contracts/namespace-contract.md) | 命名空間契約 | ✅ 現有 |
| [parser-contract.md](../reference/development-contracts/parser-contract.md) | 文件解析契約 | ✅ 現有 |
| [rag-ingestion-contract.md](../reference/development-contracts/rag-ingestion-contract.md) | RAG 入庫契約 | ✅ 現有 |
| [schedule-contract.md](../reference/development-contracts/schedule-contract.md) | 排程契約 | ✅ 現有 |

---

## 架構決策記錄（ADR）

ADR 記錄了重要的架構決策及其理由：

| ADR | 主題 |
|---|---|
| ADR-001 | RAG 上傳儲存與文件生命週期 |
| ADR-002 | RAG 上傳儲存與命名 |
| ADR-003 | RAG Firestore 資料模型與生命週期 |
| ADR-004 | RAG 查詢與企業增強 |
| ADR-005 | RAG 入庫執行契約 |
| ADR-006 | RAG 查詢執行契約 |
| ADR-007 | RAG 可選增強功能推出 |
| ADR-008 | RAG 可觀測性、SLO 與驗收 |
| ADR-009 | RAG Firestore 索引矩陣 |
| ADR-010 | RAG 上傳與 Worker 事件契約 |
| ADR-011 | RAG Genkit Flow 契約 |
| ADR-012 | Functions Python 目錄放置 |

---

## 非功能性需求規格

以下為全平台通用的非功能性需求：

### 安全性（Security）

| 需求 | 規格 |
|---|---|
| 資料隔離 | 所有 Firestore 讀寫必須在 `accounts/{accountId}/...` 路徑下 |
| 認證 | Firebase Auth；所有 Shell 頁面需認證（`shell-guard.tsx`） |
| 授權 | RBAC；角色定義於 [`PERMISSIONS.md`](../../PERMISSIONS.md) |
| Storage 隔離 | 上傳必須攜帶 `account_id` metadata |

### 效能（Performance）

| 指標 | 目標 |
|---|---|
| Documents 列表初始載入 | P95 < 2 秒 |
| RAG 重整觸發回應 | P95 < 3 秒 |
| 頁面初始 LCP | P95 < 2.5 秒 |

### 可用性（Availability）

| 指標 | 目標 |
|---|---|
| 核心功能可用率 | 99.5%（依 Firebase 服務等級） |

### 可觀測性（Observability）

- 所有關鍵操作（上傳、重整、查詢）需可在 Playwright 中重現與驗證
- Console 不得有初始化錯誤（`accountId required` 類型）
- 失敗必須 toast + console.error（不可靜默失敗）
