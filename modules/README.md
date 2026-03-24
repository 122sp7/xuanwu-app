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
