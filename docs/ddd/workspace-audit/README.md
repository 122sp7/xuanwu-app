# workspace-audit — 稽核上下文

> **Domain Type:** Supporting Subdomain（支援域）
> **模組路徑:** `modules/workspace-audit/`
> **開發狀態:** 🏗️ Midway

## 定位

`workspace-audit` 是平台的**稽核紀錄系統**，維護工作區與組織範圍內所有重要操作的不可變稽核軌跡（AuditLog）。這是典型的 Append-Only 模式——只可寫入，永不修改或刪除。

## 職責

| 能力 | 說明 |
|------|------|
| 稽核記錄查詢 | 依工作區或組織範圍查詢 AuditLog |
| 稽核記錄寫入 | 接收其他 BC 的事件並記錄稽核軌跡（Append-Only） |
| 稽核可見性 | 工作區成員可查閱工作區範圍稽核記錄 |

## 核心概念

- **`AuditLog`** — 不可變的稽核記錄（append-only，永不修改）

## 設計約束

- AuditLog 只可**追加（append）**，不可修改或刪除
- `workspace-audit/api` 包含 server actions、query functions 與 UI 元件的公開邊界

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | AuditLog 設計 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
