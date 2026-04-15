# Template Module — Agent Guide

## Purpose

`src/modules/template` 是**可複製的 Hexagonal Architecture + DDD 多子域骨架**，示範正確的多 subdomain 分層結構、具名匯出規範與跨子域協調模式。用來當作新模組的起點，或作為架構參照。

## Structure At a Glance

```
index.ts              ← 唯一對外入口（重新匯出 subdomains/document 主要符號）
orchestration/        ← 跨子域 Facade + Coordinator
shared/               ← 跨子域共用層（domain / application / config / constants /
                         errors / events / infrastructure / types / utils）
subdomains/
  document/           ← 核心子域，完整 domain + application + adapters
  generation/         ← stub，展開時填入
  ingestion/          ← stub，展開時填入
  workflow/           ← stub，展開時填入
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
- 需要確認 Hexagonal 依賴方向與多子域邊界的範例。

## Route Elsewhere When

- 真實業務需求 → 依對應 bounded context 建立新的 `src/modules/<context>/`。
- 共享 UI 元件 → `packages/ui-shadcn/`。
- 共享工具函式 → `packages/shared-utils/`。

## Development Order（新子域展開順序）

1. `subdomains/<name>/domain/`：定義 Entity、Value Object、Domain Event、Repository Port。
2. `subdomains/<name>/application/`：定義 Use Case、DTO、Inbound / Outbound Port。
3. `subdomains/<name>/adapters/outbound/`：實作 Repository Port 與其他 outbound adapter。
4. `subdomains/<name>/adapters/inbound/`：實作 HTTP / Queue adapter（依需要選用）。
5. 更新各層 barrel index，確保具名匯出完整。
6. 若有跨子域流程需求，在 `orchestration/TemplateCoordinator.ts` 注入相關 use case。
7. 更新根 `index.ts` 補露新符號。

## Delivery Style

- 奧卡姆剃刀：stub 子域 `generation / ingestion / workflow` 確認有業務需求才展開，否則保持 stub。
- `shared/` 各子目錄同理：確認有跨子域共用壓力才填入內容。
- cron、rpc、cache、external-api adapter 為**可選**，若無對應業務需要就不建或直接刪除。
- 新增符號時同步更新對應 barrel index，不留 `export *` 殘留。
- 舊平坦層 `domain/ application/ adapters/` 過渡期保留；完全確認無依賴後，整批刪除。
