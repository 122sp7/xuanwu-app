# Modules Implementation Guide

本文件是 `modules/` 的實作導向說明，並**遷就且對齊** `modules/Architecture.md` 的概念架構。

- `modules/Architecture.md`：回答「為什麼」與「系統如何分層」。
- 本文件：回答「在 repository 內如何落地」。

---

## 1. 與 Architecture.md 的對位關係

`Architecture.md` 定義三層融合：

1. Content / UI Layer（Notion）
2. Knowledge Graph Layer（Wiki）
3. AI Layer（NotebookLM / RAG）

在本專案中的實作對位：

| 概念層（Architecture） | 主要承載位置（Implementation） | 說明 |
| --- | --- | --- |
| Content / UI Layer | `app/` + `modules/*/interfaces` | App Router、頁面組裝、互動入口 |
| Knowledge Graph Layer | `modules/knowledge`, `modules/wiki-beta`, `modules/graph`, `modules/search` | 知識節點、連結、索引、檢索 |
| AI Layer | `modules/ai` + `py_fn/` | RAG orchestration、向量處理與背景作業 |

> 原則：概念融合不代表模組耦合。融合在「體驗層」，隔離在「模組邊界」。

---

## 2. module 標準結構（MDDD）

```text
module-name/
│
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/
│   ├── services/
│   └── events/
│
├── application/
│   ├── use-cases/
│   └── dto/
│
├── infrastructure/
│   ├── firebase/
│   ├── persistence/
│   ├── external/
│   └── repositories/
│
├── interfaces/
│   ├── _actions/
│   ├── api/
│   ├── queries/
│   ├── hooks/
│   └── components/
│
└── index.ts
```

說明：

1. 不是每個 module 都需要全部子目錄，依 bounded context 取用。
2. 跨 module 存取僅能走目標 module 的 `index.ts` 公開 API。
3. module 內部檔案使用相對路徑，不自我 import barrel。

---

## 3. 依賴方向與邊界

全域依賴方向：

```text
interfaces -> application -> domain <- infrastructure
```

邊界規則：

1. `domain/` 不得依賴 framework 與外部 SDK。
2. `application/` 負責流程編排，不直接綁定具體外部實作。
3. `infrastructure/` 實作 domain 介面，不主導業務流程。
4. `interfaces/` 僅做輸入輸出適配（UI、API、Server Action、Query）。

---

## 4. 與 packages 的關係

模組共用能力必須透過 `packages/` 的 alias（例如 `@shared-types`, `@integration-firebase`, `@ui-shadcn`）使用，不直接耦合其他模組內部。

```text
modules/*
  -> packages/* (stable public boundary)
```

這個原則與 `Architecture.md` 的三層融合不衝突：

- 融合的是產品能力（編輯 + 關聯 + AI）
- 隔離的是程式邊界（module API + package boundary）

---

## 5. Next.js 路由與融合介面

`Architecture.md` 的基礎平行路由示意：

```text
/workspace
    /@editor
    /@graph
    /@chat
    /@database
```

實作可依需求擴充，例如：

```text
/workspace
    /@editor
    /@graph
    /@chat
    /@database
    /@collab
    /@workflow
```

擴充原則：

1. 新 slot 必須能回對到既有 module ownership。
2. 不因 UI slot 增加而破壞 MDDD 依賴方向。

---

## 6. 目標對齊聲明

本文件已以 `modules/Architecture.md` 為上位概念文件，並將其轉換為可執行的 module implementation 規範：

1. 保留 Notion × Wiki × NotebookLM 融合方向。
2. 明確化「融合體驗」與「邊界隔離」可同時成立。
3. 用 MDDD 與 package boundary 落地，避免跨模組內部耦合。

---

## 7. 依「AI 知識平台架構圖」調整後的領域規劃

以 `modules/AI 知識平台架構圖.png` 為準，實作前建議先完成 **9 個領域規劃設計**。

### 7.1 需要先規劃的 9 個領域

| # | 領域 | 主要職責 |
| --- | --- | --- |
| 1 | Account | 帳號、身份資料、帳號層級設定 |
| 2 | Workspace | 工作區生命週期、成員與範圍 |
| 3 | Content | Page / Block / Database 內容建模與版本 |
| 4 | Graph | 知識節點關聯、Page Link、拓撲結構 |
| 5 | Search | 檢索入口、索引策略、結果聚合 |
| 6 | AI | RAG orchestration、推理流程、回答組裝 |
| 7 | Collaboration | 協作互動（留言、討論、通知協同） |
| 8 | Workflow | 任務與流程狀態、跨領域編排 |
| 9 | Storage | 文件與資產存放、版本與引用關係 |

### 7.2 Shared Packages 對位（圖中的右側）

| Shared Package 能力 | 主要用途 |
| --- | --- |
| Firebase | 資料存取、身份與雲端基礎能力 |
| Genkit | AI flow 編排與模型整合 |
| Vector DB | 向量儲存與相似度檢索 |
| Search | 查詢整合與搜尋能力封裝 |

### 7.3 為什麼是 9 個領域

1. 圖中的 Modules (Domains) 已把產品能力拆成可獨立演進的業務邊界。
2. 若只按 3 層概念切分，協作、流程、儲存容易被混入單一層造成耦合。
3. 採 9 個領域可維持「前台體驗融合」與「後台邊界隔離」並存。

### 7.4 建議規劃順序

1. 基礎域：Account、Workspace、Storage。
2. 知識域：Content、Graph、Search。
3. AI 與協作域：AI、Collaboration、Workflow。

### 7.5 每個領域規劃的最小完成標準

1. 定義 owner 與邊界（輸入、輸出、非職責項）。
2. 定義 domain invariants 與狀態轉移。
3. 定義 application use cases 與 DTO 契約。
4. 定義 infrastructure 適配點，不反向污染 domain。
5. 能以融合介面組裝，不破壞 `interfaces -> application -> domain <- infrastructure`。

---

## 7. 要實現前需完成的領域規劃設計（建議 6 個）

僅依 `modules/Architecture.md` 的三層融合模型（Content / Graph / AI）來落地，建議先完成 **6 個領域規劃設計**。原因是三層屬於概念分層，實作時仍需把權限、協作、治理獨立成 bounded context，才能維持模組邊界。

| # | 領域規劃設計 | 解決的核心問題 | 建議承載模組群 |
| --- | --- | --- | --- |
| 1 | 內容建模域（Content Modeling） | Page / Block / Database 的生命週期與版本如何一致 | `knowledge`, `wiki-beta`, `content` |
| 2 | 知識關聯域（Knowledge Graph） | Page Link、Tag、關聯導航如何穩定演進 | `graph`, `knowledge`, `search` |
| 3 | AI 檢索推理域（RAG & Reasoning） | 文件到 embedding、檢索到回答的責任邊界 | `ai`, `file`, `py_fn` |
| 4 | 租戶與授權域（Tenant & Access） | organization / workspace / member 權限如何約束資料可見性 | `organization`, `workspace`, `identity`, `account` |
| 5 | 協作互動域（Collaboration） | 討論、通知、任務與事件流如何協同 | `collaboration`, `notification`, `task`, `event` |
| 6 | 治理驗收域（Governance & Acceptance） | 稽核、驗收門檻、品質與成本治理如何制度化 | `audit`, `acceptance`, `qa`, `billing` |

### 為什麼是 6 個

1. `Architecture.md` 的 3 層是產品能力視角，不是完整實作責任切分。
2. 若只切 3 層，授權、治理、協作通常會被塞進 UI 或應用層，導致跨模組耦合。
3. 切成 6 個後，能同時保留「前台融合體驗」與「後台模組邊界」。

### 建議規劃順序

1. 先做 1 + 2：先穩固內容與關聯底座。
2. 再做 4：先鎖住多租戶與可見性邊界。
3. 接著做 3：在穩定資料邊界上接 AI。
4. 最後做 5 + 6：補齊協作流程與治理能力。

### 每個領域規劃的最小完成標準

1. 有明確 owner 與邊界（輸入、輸出、禁止越界責任）。
2. 有 domain invariants（不可被流程繞過的規則）。
3. 有 application use cases 與 DTO 契約。
4. 有 infrastructure 適配責任但不反向污染 domain。
5. 能在融合 UI 中以 slot 或頁面組裝，且不破壞依賴方向。
