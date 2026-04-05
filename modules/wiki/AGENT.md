# AGENT.md — modules/wiki

## 模組定位

`modules/wiki` 是 Knowledge Platform 的**核心域（Core Domain）**，對應 Wiki 知識結構層。負責知識圖譜（GraphNode / GraphEdge）的生命週期管理，建立知識之間的結構性關聯。與 `knowledge` 共同構成平台的兩大核心域。

---

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語，不可替換：

| 正確術語 | 禁止使用 |
|----------|----------|
| `WikiPage` | Page、Node、KnowledgePage |
| `WikiGraph` | Graph、KnowledgeMap、KnowledgeGraph |
| `WikiLink` | Link、Edge、Connection |
| `GraphNode` | Node（作為內部圖系統術語） |
| `GraphEdge` | Edge（作為內部圖系統術語） |
| `Backlink` | IncomingLink、ReverseLink |
| `RelationType` | EdgeType、LinkKind |
| `ViewConfig` | Layout、DisplayConfig |

---

## 邊界規則

### ✅ 允許

```typescript
// 其他模組透過 api/ 存取 wiki
import { wikiApi } from "@/modules/wiki/api";
import type { WikiPageDTO, WikiGraphDTO, WikiLinkDTO } from "@/modules/wiki/api";
```

### ❌ 禁止

```typescript
// 禁止直接 import 內部層
import { GraphNode } from "@/modules/wiki/domain/entities/graph-node";
import { InMemoryGraphRepository } from "@/modules/wiki/infrastructure/InMemoryGraphRepository";
import { AutoLinkUseCase } from "@/modules/wiki/application/use-cases/auto-link.use-case";
```

---

## 狀態機守衛（Guard）規則

- `ARCHIVE` GraphNode 前必須確認無 `active` 或 `pending` 邊（guard check）
- `ACTIVATE` GraphEdge 前必須確認兩端節點均為 `active`（guard check）
- 違反 guard 必須拋出帶有業務說明的 `Error`，不允許靜默失敗

---

## 依賴方向

```
interfaces/ → application/ → domain/ ← infrastructure/
```

- `domain/` 禁止 import Firebase SDK、React、HTTP clients
- `infrastructure/` 只實作 `domain/repositories/GraphRepository.ts` 介面

---

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `knowledge/api` | 事件訂閱 | 監聽 `knowledge.page_created` / `knowledge.page_updated` 以同步 GraphNode |
| `search/api` | 事件發布 | 節點/邊變更後發布 `wiki.node_activated` 觸發搜尋索引更新 |
| `workspace/api` | API 呼叫 | 驗證工作區範圍 |
| `notebook/api` | 事件發布 | 提供圖結構輔助 AI 推理 |

---

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
