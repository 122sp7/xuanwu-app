# workspace-feed — Workspace Activity Feed

> **開發狀態**：🏗️ Midway — 開發部分完成
> **Domain Type**：Supporting Domain（支援域）

`modules/workspace-feed` 負責工作區的活動動態流（Feed），聚合工作區內各模組的事件，提供使用者即時的活動更新。

外界互動規則：
- 外界只能透過 `api/` 公開介面存取此模組
- Feed 是事件的讀模型（Read Model），只提供查詢能力

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| 活動聚合 | 聚合工作區內的知識更新、成員變更等活動 |
| 動態流查詢 | 提供分頁的工作區動態流查詢 |
| 活動過濾 | 依類型或時間範圍過濾活動記錄 |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| 活動動態 | FeedItem | 動態流中的單一活動記錄 |
| 動態流 | WorkspaceFeed | 工作區活動的時序列表 |
| 活動類型 | ActivityType | 活動的分類（知識更新 / 成員變更 / 評論 / ...） |

---

## 依賴關係

- **上游（依賴）**：`workspace/api`、`knowledge/api`、`identity/api`（事件來源）
- **下游（被依賴）**：`workspace/api`（Feed tab 展示）

---

## 目錄結構

```
modules/workspace-feed/
├── api/                  # 公開 API 邊界
├── application/          # Use Cases（查詢為主）
├── domain/               # Entities, Repositories
├── infrastructure/       # Firebase 適配器
├── interfaces/           # Feed UI 元件
└── index.ts
```
