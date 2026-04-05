# AGENT.md — modules/wiki

## 模組定位

`modules/wiki` 是 Knowledge Platform 的**核心域（Core Domain）**，對應 Wiki 知識結構層。負責知識圖譜（GraphNode / GraphEdge）的生命週期管理，建立知識之間的關聯結構。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語：

- `WikiPage`（不是 Page、Node）
- `WikiGraph`（不是 Graph、KnowledgeMap）
- `WikiLink`（不是 Link、Edge）
- `GraphNode`（系統內部圖節點）
- `GraphEdge`（系統內部圖邊）
- `Backlink`（反向連結）
- `RelationType`（不是 EdgeType、LinkKind）

## 邊界規則

### ✅ 允許

```typescript
import { wikiApi } from "@/modules/wiki/api";
import type { WikiPageDTO, WikiGraphDTO } from "@/modules/wiki/api";
```

### ❌ 禁止

```typescript
import { GraphNode } from "@/modules/wiki/domain/entities/graph-node";
import { FirebaseGraphRepository } from "@/modules/wiki/infrastructure/...";
```

## 狀態機規則

### GraphNode 狀態機
```
draft → active → archived
archived → active（RESTORE）
```

### GraphEdge 狀態機
```
pending → active（guard: both nodes active）
active ↔ inactive
active/pending → removed
```

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `knowledge/api` | 事件訂閱 | 監聽頁面建立/更新以同步 GraphNode |
| `search/api` | 事件發布 | 節點變更後觸發搜尋索引更新 |
| `workspace/api` | API 呼叫 | 驗證工作區範圍 |

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
