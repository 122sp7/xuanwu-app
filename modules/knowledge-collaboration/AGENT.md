# knowledge-collaboration BC Agent

## 模組職責

此 BC 負責知識協作能力：Comment（留言）、Permission（存取權限）、Version（版本快照）。

- **不擁有** 知識內容（Page / Article）。
- 透過 `contentId` 引用內容，而非持有內容聚合。
- 跨 BC 協作必須透過 `modules/knowledge/api` 與 `modules/knowledge-base/api`。

## 核心聚合

| 聚合 | 職責 |
|---|---|
| `Comment` | 針對 contentId 的線程式留言 |
| `Permission` | contentId + principalId 的存取層級 |
| `Version` | contentId 的 Block 快照版本 |

## 邊界規則

- 此 BC **不得**直接 import `knowledge` 或 `knowledge-base` 內部層。
- `contentId` 可以是 pageId 或 articleId，由上層呼叫者決定語境。
- Permission 級別：`view` < `comment` < `edit` < `full`。

## 開發狀態

📅 Planned — 設計階段。代碼實作待後續 PR。
