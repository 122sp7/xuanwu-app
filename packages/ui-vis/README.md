# @ui-vis

Graph, network, and timeline visualization via **vis.js family** (`vis-network`, `vis-data`, `vis-timeline`).

## Purpose

提供知識圖譜（Knowledge Graph）、關係網絡（Relation Network）與事件時間軸（Event Timeline）的互動式視覺化能力。與 `packages/ui-visualization/`（Recharts 圖表）不同，此套件專注於節點邊緣圖形和時間軸。

## Install Requirements

```bash
npm install vis-network vis-data vis-timeline
```

## Import

```ts
import { Network, DataSet, DataView, Timeline, type VisNode, type VisEdge } from '@ui-vis'
```

**CSS（在消費模組中個別 import）:**

```ts
import 'vis-network/styles/vis-network.css'
import 'vis-timeline/styles/vis-timeline-graph2d.css'
```

## Core Usage

### 知識圖譜（Network）

```tsx
"use client"
import { useEffect, useRef } from 'react'
import { Network, DataSet, type VisNode, type VisEdge, type VisNetworkOptions } from '@ui-vis'
import 'vis-network/styles/vis-network.css'

interface Props {
  nodes: VisNode[]
  edges: VisEdge[]
}

const options: VisNetworkOptions = {
  nodes: { shape: 'dot', size: 16, font: { size: 14 } },
  edges: { arrows: 'to', smooth: { type: 'curvedCW', roundness: 0.2 } },
  physics: { stabilization: { iterations: 200 } },
}

function KnowledgeGraph({ nodes, edges }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const network = new Network(
      containerRef.current,
      { nodes: new DataSet(nodes), edges: new DataSet(edges) },
      options,
    )

    return () => network.destroy()
  }, [nodes, edges])

  return <div ref={containerRef} style={{ height: '500px', width: '100%' }} />
}
```

### 反應式 DataSet 更新

```tsx
"use client"
import { useEffect, useRef } from 'react'
import { Network, DataSet } from '@ui-vis'

function LiveGraph({ liveNodes, liveEdges }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef(new DataSet(liveNodes))
  const edgesRef = useRef(new DataSet(liveEdges))

  useEffect(() => {
    const network = new Network(containerRef.current!, {
      nodes: nodesRef.current,
      edges: edgesRef.current,
    }, {})
    return () => network.destroy()
  }, [])  // 只建立一次

  useEffect(() => {
    // DataSet.update 觸發自動重繪
    nodesRef.current.update(liveNodes)
    edgesRef.current.update(liveEdges)
  }, [liveNodes, liveEdges])

  return <div ref={containerRef} style={{ height: '400px' }} />
}
```

### 事件時間軸（Timeline）

```tsx
"use client"
import { useEffect, useRef } from 'react'
import { Timeline, DataSet, type TimelineItem, type TimelineOptions } from '@ui-vis'
import 'vis-timeline/styles/vis-timeline-graph2d.css'

const items: TimelineItem[] = [
  { id: 1, content: '任務建立', start: '2024-01-01' },
  { id: 2, content: '草稿完成', start: '2024-01-10', end: '2024-01-12' },
]

const options: TimelineOptions = {
  start: '2023-12-28',
  end: '2024-01-20',
}

function TaskTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const timeline = new Timeline(containerRef.current, new DataSet(items), options)
    return () => timeline.destroy()
  }, [])

  return <div ref={containerRef} style={{ height: '200px' }} />
}
```

## Key Exports

| Export | 類型 | 說明 |
|---|---|---|
| `Network` | Class | 力導向節點邊緣圖 |
| `parseGephiNetwork` | Function | 解析 Gephi JSON 格式 |
| `parseDOTNetwork` | Function | 解析 DOT 語言格式 |
| `DataSet` | Class | 反應式資料集（add/update/remove 觸發重繪） |
| `DataView` | Class | DataSet 的篩選視圖 |
| `Timeline` | Class | 水平時間軸 |
| `VisNode` | Type | 節點型別（別名自 vis-network `Node`） |
| `VisEdge` | Type | 邊緣型別（別名自 vis-network `Edge`） |
| `VisNetworkOptions` | Type | Network 設定型別 |
| `DataSetOptions` | Type | DataSet 設定型別 |
| `TimelineOptions` | Type | Timeline 設定型別 |
| `TimelineItem` | Type | Timeline 項目型別 |
| `TimelineGroup` | Type | Timeline 群組型別 |

## Architecture Notes

- 僅用於 `interfaces/` 層（`"use client"` 必要，需瀏覽器 DOM）
- `Network` 和 `Timeline` 在 `useEffect` 中以 `new` 建立，必須在 cleanup 中呼叫 `.destroy()`
- `VisNode` / `VisEdge` 已別名（避免與 TypeScript 內建 `Node` / `Edge` 名稱衝突）
- CSS 必須在消費模組中個別 import（不在此套件 index 中自動 import）
- 與 `packages/ui-visualization/`（Recharts）互補，各自負責不同視覺化場景
