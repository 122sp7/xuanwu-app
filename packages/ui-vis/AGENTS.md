# ui-vis — Agent Rules

此套件是 **圖形（Graph）、網絡（Network）與時間軸（Timeline）視覺化能力的唯一授權來源**，透過 vis.js 系列提供互動式節點邊緣圖與事件時間軸。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 力導向圖 | `Network` — 節點邊緣互動式視覺化 |
| 反應式資料集 | `DataSet`, `DataView` — 觸發自動重繪 |
| 時間軸 | `Timeline` — 水平事件與時間範圍呈現 |
| 匯入工具 | `parseGephiNetwork`, `parseDOTNetwork` |
| 型別 | `VisNode`, `VisEdge`, `VisNetworkOptions`, `TimelineItem` 等 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| Recharts 折線圖、長條圖、圓餅圖 | `packages/ui-visualization/`（XuanwuLineChart 等） |
| 圖形資料的業務邏輯 | `src/modules/<context>/domain/` 或 `application/` |
| 圖形狀態管理 | `packages/infra/state/` |

---

## 嚴禁

```ts
// ❌ 不得在 domain/ / application/ 層 import
// ❌ 不得在 Server Component 使用（需 DOM）
// ❌ 不得省略 CSS import（會導致 Network 渲染異常）

// ✅ 正確模式：在 Client Component 的 useEffect 中建立
"use client"
import { useEffect, useRef } from 'react'
import { Network, DataSet } from '@ui-vis'
import 'vis-network/styles/vis-network.css'   // 必須在消費模組 import

function KnowledgeGraph({ nodes, edges }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const network = new Network(
      containerRef.current,
      { nodes: new DataSet(nodes), edges: new DataSet(edges) },
      {}
    )
    return () => network.destroy()   // 必須清理
  }, [nodes, edges])

  return <div ref={containerRef} style={{ height: '500px' }} />
}
```

- 所有消費者必須加 `"use client"`（需瀏覽器 DOM API）
- `Network` 與 `Timeline` 在 `useEffect` 中以 `new` 建立，`destroy()` 在 cleanup 中呼叫
- `Node` / `Edge` 從 vis-network 已別名為 `VisNode` / `VisEdge`（避免與 TS 內建名稱衝突）
- 不得在此套件包含任何業務語意

## Alias

```ts
import { Network, DataSet, Timeline, type VisNode, type VisEdge } from '@ui-vis'
```
