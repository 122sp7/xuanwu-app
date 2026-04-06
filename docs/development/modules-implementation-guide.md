# Modules Implementation Guide

本文件是 `modules/` 的實作導向說明，並對齊上位概念架構文件的設計方向。

- 上位概念架構文件：回答「為什麼」與「系統如何分層」。
- 本文件：回答「在 repository 內如何落地」。

---

## 1. 與概念架構文件的對位關係

上位概念架構文件描述的是產品能力如何融合，而不是舊模組拓樸的直接投影。

在目前 repository 中，較穩定的對位方式如下：

| 概念層（Architecture） | 主要承載位置（Implementation） | 說明 |
| --- | --- | --- |
| Knowledge Experience Layer | `app/` + `modules/knowledge` + `modules/knowledge-base` + `modules/knowledge-database` + `modules/source` | 頁面、文章、資料庫、來源與工作區中的知識入口 |
| Governance / Collaboration Layer | `modules/workspace`, `modules/organization`, `modules/account`, `modules/workspace-*`, `modules/notification` | 租戶、工作區、流程、排程、稽核與協作治理 |
| Retrieval / Notebook Layer | `modules/ai` + `modules/search` + `modules/notebook` + `py_fn/` | ingestion、retrieval、ask/cite、摘要與知識生成工作流 |

> 原則：概念融合不代表模組耦合。融合在「體驗層」，隔離在「模組邊界」。

---

## 2. module 標準結構（MDDD）

```text
<domain-id>/
│
├── api/
│   └── index.ts
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
```

說明：

1. 不是每個 module 都需要全部子目錄，依 bounded context 取用。
2. 跨 module 存取僅能走目標 module 的 `api/` 公開邊界。
3. module 內部檔案使用相對路徑，不自我 import `api/` 邊界。

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

這個原則與上位概念架構文件的三層融合不衝突：

- 融合的是產品能力（編輯 + 關聯 + AI）
- 隔離的是程式邊界（module `api/` boundary + package boundary）

---

## 5. Next.js 路由與融合介面

上位概念架構文件的基礎平行路由示意：

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

本文件以上位概念架構文件為基礎，並將其轉換為可執行的 module implementation 規範：

1. 保留內容體驗、知識關聯與 AI 能力的融合方向。
2. 明確化「融合體驗」與「邊界隔離」可同時成立。
3. 用 MDDD 與 package boundary 落地，避免跨模組內部耦合。

---

## 7. 以上位概念架構文件為準的落地限制

上位概念架構文件提供的是概念模型，不是額外的 canonical module map、固定領域數量或一次性規劃清單。

因此本文件只保留與概念模型一致的落地限制：

1. Notion 對應的是內容編輯與資料庫體驗，不等於整個知識域或單一模組。
2. Wiki-like 體驗在目前系統中分散於 `knowledge`、`knowledge-base`、`workspace` 與 `search` 等 bounded context，不應再回推成單一 `modules/wiki` owner。
3. NotebookLM 對應的是文件理解、檢索、問答與推理能力，不等於所有 AI 邏輯都可以脫離既有 runtime boundary。
4. 三層融合描述的是產品體驗，不直接推導出固定的模組數量、模組命名或跨模組 ownership。

## 8. 實作規劃時的最小檢查點

若要把三層模型落到實際模組，至少先確認：

1. 需求是在補強 Knowledge Experience、Governance / Collaboration、還是 Retrieval / Notebook 哪一層。
2. 新能力的 owner 是否已存在於目前 module inventory；若不存在，再依 MDDD 原則判斷是否需要新 bounded context。
3. 跨模組互動是否只經過目標模組的 `api/` 邊界。
4. UI 組裝、知識關聯、AI orchestration 是否仍維持 `interfaces -> application -> domain <- infrastructure`。
5. 若文件只是概念說明，不額外發明上位概念架構文件未定義的 canonical schema、固定規劃數量或模組對照表。
