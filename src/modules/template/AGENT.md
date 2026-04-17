# Template Module — Agent Guide

## Purpose

`src/modules/template` 是**可複製的 Hexagonal Architecture + DDD 多子域骨架**，示範正確的多 subdomain 分層結構、具名匯出規範與跨子域協調模式。用來當作新模組的起點，或作為架構參照。

## Structure At a Glance

```
index.ts              ← 唯一對外入口（重新匯出全部四個子域的 domain + application 符號）
orchestration/        ← 跨子域 Facade + Coordinator
shared/               ← 跨子域共用層（domain / application / config / constants /
                         errors / events / infrastructure / types / utils）
subdomains/
  document/           ← 核心子域，完整 domain + application + adapters
  generation/         ← 生成子域，完整 domain + application + adapters
  ingestion/          ← 匠入子域，完整 domain + application + adapters
  workflow/           ← 流程子域，完整 domain + application + adapters
```

## Boundary Rules

- `subdomains/*/domain/` 不得匯入 React、Firebase SDK、HTTP client、ORM 或任何框架。
- `subdomains/*/application/` 只依賴同子域 `domain/` 抽象，不依賴 adapter 實作。
- Adapters 只實作 port 介面，不承載業務規則。
- 跨子域協調只能透過 `orchestration/` 或 `shared/events/`，**禁止直接跨 subdomain import**。
- 外部消費者只能透過 `src/modules/template/index.ts`（具名匯出）存取。

## Barrel & Named Export Rules

- 所有 barrel 使用明確的 `export { X }` 與 `export type { X }`，嚴禁 `export *`。
- 每個子域各有自己的 barrel 層（domain/index.ts、application/index.ts、adapters/index.ts）。
- Source 檔案之間的 import 使用**直接相對路徑**（例如 `'../../../domain/value-objects/TemplateId'`），不依賴 barrel，確保 barrel 可獨立變更。
- `shared/*/index.ts` 為各共用層的匯出出口，由需要者直接引用。

## Route Here When

- 需要新建一個多子域 DDD module 骨架。
- 需要查閱正確的 barrel 結構、具名匯出寫法或跨子域協調模式。
- 需要確認 Hexagonal 依賴方向、多子域邂界、VO ID 模式、FirestoreLike 抄象、AI adapter stub 鮣變的範例。

## Route Elsewhere When

- 真實業務需求 → 依對應 bounded context 建立新的 `src/modules/<context>/`。
- 共享 UI 元件 → `packages/ui-shadcn/`。
- 共享工具函式 → `packages/shared-utils/`。

## Development Order（新子域展開順序）

1. `subdomains/<name>/domain/`：定義 Entity、Value Object（VO ID）、Domain Event、Repository Port。
2. `subdomains/<name>/application/`：定義 Use Case、DTO、Inbound / Outbound Port。
3. `subdomains/<name>/adapters/outbound/`：實作 Repository Port（FirestoreLike 抄象）與其他 outbound adapter。
4. `subdomains/<name>/adapters/inbound/`：實作 HTTP / Queue adapter（workflow 僅需 HTTP）。
5. 更新各層 barrel index，確保具名匯出完整。
6. 如有跨子域流程需求，在 `orchestration/TemplateCoordinator.ts` 注入相關 use case。
7. 更新根 `index.ts` 補露新符號。

## Delivery Style

- 奈卡姆剥刀：本模組四個子域均已完整實作，可直接複製作為新模組起點。
- 複製時只保留有實際業務需求的子域；generation / ingestion / workflow 可依業務選手。
- AI adapter（`AiGenerationAdapter`）與 Storage adapter（`CloudStorageAdapter`）為 stub，待雞 Genkit / Cloud Storage 連接時再完善。

---

## 已確立模式（Pattern Reference）

| 模式 | 說明 |
|---|---|
| **VO ID** | 每個 Entity 的 `id` 字段使用 Value Object（`FooId`），含 `create(raw)`、`generate()`、`toString()`、`equals()` |
| **FirestoreLike adapter** | Outbound adapter 內嵌 `FirestoreLike` interface（`get/set/delete`），不直接匯入 Firebase SDK |
| **Port type alias** | `export type FooRepositoryPort = FooRepository`（type alias，不重新宣告）|
| **AI adapter stub** | `throw new Error('not yet implemented')` + TODO comment，待 Genkit wiring |
| **Storage adapter stub** | `throw new Error('not yet implemented')` + TODO comment，待 Cloud Storage wiring |
| **Adapter import depth** | `adapters/inbound/http/*.ts` 需用 `../../../application/...`（三層上）|
| **無 queue handler** | workflow 子域為 HTTP-only，`adapters/inbound/` 不包含 queue handler |

---

## 衝突防護（src/modules vs modules/）

`src/modules/template` 屬於**蒸餾層（`src/modules/`）**。本層與 `modules/<context>/`（完整 HEX+DDD 實作層）**職責不同，不可混用**。

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/<context>/AGENT.md` |
| 撰寫新 use case / adapter / entity 實作 | `src/modules/<context>/`（從本骨架複製）|
| 跨模組 API boundary | `src/modules/<context>/index.ts` |
| 新模組起點 | 複製 `src/modules/template/`，取代 Template→YourEntity |

**嚴禁事項：**
- ❌ 把 `modules/<context>/infrastructure/` 的實作直接搬到 `src/modules/<context>/domain/`
- ❌ 把 `src/modules/` 當成 `modules/` 的別名
- ❌ 在 `domain/` 匯入 React、Firebase SDK、HTTP client、ORM
- ❌ 在 barrel 使用 `export *`

## 文件網絡

- [README.md](README.md) — 模組詳細說明（目錄樹、barrel 表、複製步驟、蒸餾說明）
- [src/modules/README.md](../README.md) — 蒸餾層狀態總覽（模組清單與進度）
- [modules/](../../../modules/) — 完整 HEX+DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
- `shared/` 各子目錄同理：確認有跨子域共用壓力才填入內容。
- cron、rpc、cache、external-api adapter 為**可選**，若無對應業務需要就不建或直接刪除。
- 新增符號時同步更新對應 barrel index，不留 `export *` 殘留。
- 舊平坦層 `domain/ application/ adapters/` 過渡期保留；完全確認無依賴後，整批刪除。
