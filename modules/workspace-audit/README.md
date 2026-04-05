# workspace-audit — 工作區稽核上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-audit/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-audit` 是工作區治理的追溯層，透過 append-only 稽核紀錄保存重要操作的事後可查性。它不是直接創造知識價值的核心域，但對信任、治理與合規至關重要。

## 主要職責

| 能力 | 說明 |
|---|---|
| 稽核寫入 | 接收重要行為或事件並追加紀錄 |
| 稽核查詢 | 依工作區或組織範圍提供可查詢的 audit trail |
| 治理可見性 | 支援事後追查、責任歸屬與決策證據 |

## 與其他 Bounded Context 協作

- `workspace` 與 `organization` 提供查詢與可見性範圍。
- `workspace-flow`、`workspace-feed` 與其他上下文可作為稽核事件來源。

## 核心聚合 / 核心概念

- **`AuditLog`**
- **`AuditActor`**
- **`AuditScope`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
