# workspace-feed — 工作區動態上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-feed/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-feed` 是工作區的動態流與互動層，把知識、任務與協作事件轉成團隊可感知的貼文、回覆與互動紀錄。它提升知識平台的協作流動性與可見性。

## 主要職責

| 能力 | 說明 |
|---|---|
| 動態貼文 | 管理 post / reply / repost 等工作區動態內容 |
| 互動紀錄 | 記錄 like / view / bookmark / share 等互動 |
| 事件可見化 | 把協作行為轉成工作區成員可追蹤的活動流 |

## 與其他 Bounded Context 協作

- `workspace` 提供動態的歸屬邊界。
- `workspace-flow`、`knowledge`、`notification` 可與動態流形成聯動。

## 核心聚合 / 核心概念

- **`WorkspaceFeedPost`**
- **`FeedReaction`**
- **`FeedThread`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
