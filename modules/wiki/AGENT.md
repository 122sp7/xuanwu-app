# AGENT.md — wiki BC

## 模組定位

`wiki` 是 Core Domain，負責 GraphNode 與 GraphEdge 的知識圖譜生命週期。是 Xuanwu 的核心差異化視覺特性。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `GraphNode` | Node、WikiNode、KnowledgeNode、Page（在圖譜上下文） |
| `GraphEdge` | Edge、Link、Connection、Relation |
| `EdgeType` | RelationType、LinkType |
| `NodeType` | NodeKind、PageType（在圖譜上下文） |
| `Backlink` | ReverseLink、InboundLink |
| `GraphTraversal` | Graph Walk、Traversal |
| `AutoLink` | AutoConnect、AutoRelate |

## 邊界規則

### ✅ 允許
```typescript
import { wikiApi } from "@/modules/wiki/api";
import type { GraphNodeDTO, GraphEdgeDTO } from "@/modules/wiki/api";
```

### ❌ 禁止
```typescript
import { GraphNode } from "@/modules/wiki/domain/entities/graph-node";
// modules/ai/domain/entities/graph-node.ts 是 @deprecated stub，不要使用
```

## 棄用守衛

`modules/ai/domain/entities/graph-node.ts` 和 `modules/ai/domain/entities/link.ts` 都是 `@deprecated` stub，已移至 `modules/wiki/domain/`。絕對不要 import 這些舊路徑。

## 驗證命令

```bash
npm run lint
npm run build
```
