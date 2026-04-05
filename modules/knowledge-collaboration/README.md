# knowledge-collaboration — 知識協作、版本、權限管理

> **Domain Type:** **Supporting Subdomain + Generic Subdomain**（支撐域 + 泛用域）
> **模組路徑:** `modules/knowledge-collaboration/`
> **開發狀態:** 📅 Planned — 設計階段

## 在 Knowledge Platform 中的角色

`knowledge-collaboration` 負責知識協作的基礎設施：留言討論、存取權限管理、頁面版本快照。它不擁有知識內容本身，而是為 `knowledge`、`knowledge-base` 等內容 BC 提供協作能力。

## 主要職責

| 能力 | 說明 |
|---|---|
| Comment 留言 | 針對 Page / Article 的線程式留言討論 |
| Permission 權限 | 細粒度的內容存取控制（View/Comment/Edit/Full） |
| Version 版本快照 | Page / Article 的版本歷史（Block 快照） |
| 頁面鎖定 | 防止並發編輯的樂觀鎖機制 |

## 核心聚合

- **`Comment`**（留言）
- **`Permission`**（存取權限）
- **`Version`**（版本快照）

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [repositories.md](./repositories.md) | Repository 介面 |
| [application-services.md](./application-services.md) | Use Cases 清單 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係 |
