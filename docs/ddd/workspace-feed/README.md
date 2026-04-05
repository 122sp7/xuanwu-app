# workspace-feed — 動態牆上下文

> **Domain Type:** Supporting Subdomain
> **模組路徑:** `modules/workspace-feed/`
> **開發狀態:** 🏗️ Midway

## 定位

`workspace-feed` 管理工作區的**社交動態牆**，提供 post / reply / repost 的內容發布與互動記錄（like / view / bookmark / share）。

## 核心概念

- **`WorkspaceFeedPost`** — 動態貼文聚合根（含 post / reply / repost 三種類型）

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | WorkspaceFeedPost 聚合根設計 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
