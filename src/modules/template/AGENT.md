# Template Module — Agent Guide

## Purpose

`src/modules/template` 是**可複製的 Hexagonal Architecture + DDD 骨架**，示範正確的分層結構、具名匯出規範與依賴方向。用來當作新模組的起點，或作為架構參照。

## Boundary Rules

- `domain/` 不得匯入 React、Firebase SDK、HTTP client、ORM 或任何框架。
- `application/` 只依賴 `domain/` 抽象（Entities、Value Objects、Ports），不依賴 adapter 實作。
- Adapters 只實作 port 介面，不承載業務規則。
- 外部消費者只能透過 `src/modules/template/index.ts`（具名匯出）存取。

## Barrel & Named Export Rules

- 所有 barrel 使用明確的 `export { X }` 與 `export type { X }`，嚴禁 `export *`。
- 只有 5 個 barrel index：根 `index.ts`、`domain/index.ts`、`application/index.ts`、`adapters/inbound/index.ts`、`adapters/outbound/index.ts`。
- Source 檔案之間的 import 使用**直接相對路徑**（例如 `'../../domain/value-objects/TemplateId'`），不依賴 barrel，確保 barrel 可獨立變更。

## Route Here When

- 需要新建一個 DDD module 骨架。
- 需要查閱正確的 barrel 結構或具名匯出寫法。
- 需要確認 Hexagonal 依賴方向的範例。

## Route Elsewhere When

- 真實業務需求 → 依對應 bounded context 建立新的 `src/modules/<context>/`。
- 共享 UI 元件 → `packages/ui-shadcn/`。
- 共享工具函式 → `packages/shared-utils/`。

## Development Order

1. `domain/`：定義 Entity、Value Object、Domain Event、Repository Port。
2. `application/`：定義 Use Case、DTO、Inbound / Outbound Port。
3. `adapters/outbound/`：實作 Repository Port 與其他 outbound adapter。
4. `adapters/inbound/`：實作 HTTP / RPC / Cron / Queue adapter（依需要選用）。
5. 更新各層 barrel index，確保具名匯出完整。

## Delivery Style

- 奧卡姆剃刀：不必要的子域、port、service 一律不預建。
- cron、queue、cache、external-api adapter 為**可選**，若無對應業務需要就直接刪除。
- 新增符號時同步更新對應 barrel index，不留 `export *` 殘留。
