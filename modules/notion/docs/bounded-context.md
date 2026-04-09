# Bounded Context — notion

本文件定義 `notion` 這份本地藍圖的邊界。notion 的任務，是把 Xuanwu 的知識內容能力（頁面編輯、區塊管理、結構化資料庫、組織知識庫、協作留言、版本歷史）收斂成一個 **Hexagonal + DDD** 邊界，而不是把這些能力散落成沒有語言與責任的多個獨立模組。

## Context Purpose

notion 這個 bounded context 負責回答五類問題：

- 知識頁面如何被建立、組織、演進與交付
- 內容區塊如何被管理與排序
- 結構化資料（Database/Record/View）如何以多視圖呈現
- 組織知識文章如何被驗證、分類與維護
- 協作者如何留言、管理存取與追蹤版本

## Canonical Capability Groups

### 核心知識內容

- `knowledge` — 頁面、區塊、集合（Notion-like 核心頁面引擎）
- `authoring` — 組織知識庫文章（Article、Category、驗證狀態）

### 結構化與協作

- `database` — Database/Record/View 結構化資料引擎
- `collaboration` — Comment、Permission、Version 協作基礎設施

### AI 與分析

- `ai` — AI 輔助生成、摘要與 RAG 攝入起點
- `analytics` — 知識使用行為量測

### 內容豐富與自動化

- `attachments` — 附件與媒體管理
- `automation` — 知識事件觸發的自動化規則
- `templates` — 頁面範本管理

### 整合與個人

- `integration` — 外部系統（Notion、Confluence、Google Docs 等）整合
- `notes` — 個人輕量筆記
- `versioning` — 全域版本快照策略

## 邊界包含什麼

notion 包含：

- 可被 notion 通用語言描述的聚合、值物件、規則與事件
- 可被 application layer 協調的 use cases、commands、queries 與 read models
- 可被 ports 表達的輸入契約與外部依賴契約
- 可被協作與版本管理需求追蹤的 published language

## 邊界刻意不包含什麼

- 平台主體治理（身份、帳號、組織）→ `platform`
- 工作區層級的治理與成員歸屬 → `workspace`
- AI 推理與 RAG 管線執行細節 → `ai` 模組 / `py_fn/`
- 任何 UI 呈現細節本身
- 直接綁定 HTTP、queue、webhook、SDK、資料庫的 adapter 細節

## Hexagonal Layer Mapping

| Layer / concept | notion 位置 | 說明 |
|---|---|---|
| Public boundary | `api/` | 對外公開的 cross-module boundary；只做投影與 re-export |
| Driving adapters | `core/adapters/` | Web、CLI 等輸入端轉譯 |
| Application | `core/application/` | use case orchestration、DTO、command/query 處理 |
| Domain core | `core/domain/` | 聚合、值物件、domain services、domain events |
| Input ports | `core/ports/input/` | 進入 application 的穩定契約 |
| Output ports | `core/ports/output/` | repositories、stores、gateways |
| Driven adapters | `core/infrastructure/` | 對 output ports 的具體實作 |
| Subdomains | `subdomains/<name>/` | 各子域的本地 domain/application/adapters 能力 |

## 計畫吸收模組

以下四個現有獨立模組的能力**計畫在未來重構中合并進 notion**，成為對應子域的正式實作。在合并完成前，這些模組作為各自子域的前身實作繼續運作，notion blueprint 定義語言與 port 契約的規範形式。

| 獨立模組 | 目標子域 | 現有核心概念 | 合并備注 |
|---|---|---|---|
| `modules/knowledge/` | `knowledge` | `KnowledgePage`, `ContentBlock`, `ContentVersion`, `KnowledgeCollection` | 保留 D1/D2/D3 決策語言；workspace-first scope 規則不變 |
| `modules/knowledge-base/` | `authoring` | `Article`, `Category`, `VerificationState`, `Backlink` | Promote 協議（D3）由 `authoring` 子域接管業務規則 |
| `modules/knowledge-collaboration/` | `collaboration` | `Comment`, `Permission`, `PermissionLevel`, `Version`, `NamedVersion` | `contentId` opaque reference 模式保持 |
| `modules/knowledge-database/` | `database` | `Database`, `Field`, `Record`, `Property`, `View` | D1 決策：`database` 子域完整擁有 spaceType="database" 的 Schema+Record+View |

**合并優先序：** `knowledge` → `database` → `collaboration` → `authoring`

**合并後規則：**
- 獨立模組應設為 deprecated，並把 `api/index.ts` 指向 `modules/notion/api`
- Notion blueprint 的語言定義優先；若有術語歧異，以本文件與 `ubiquitous-language.md` 為準

## 邊界測試問題

1. 這個變更屬於哪個既有子域
2. 它需要的是新語言、既有語言的細化，還是新的 port contract
3. 它是 domain rule、application orchestration、adapter concern，還是 public boundary projection
4. 它是否會破壞 closed inventory 或 dependency direction
5. 若涉及四個計畫吸收模組，是否與合并方向一致

若第 1 題答不出來，表示 notion 邊界尚未被正確理解。
