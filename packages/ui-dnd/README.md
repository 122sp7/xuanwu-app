# @ui-dnd

Drag-and-drop primitives via **Atlassian Pragmatic DnD**.

## Purpose

提供高效能、無 React state 洩漏的拖放綁定，透過 imperative useEffect 模式將 drag/drop 行為附加到 DOM 元素，讓 React 渲染週期不受拖放內部狀態影響。

## Install Requirements

```bash
npm install @atlaskit/pragmatic-drag-and-drop
npm install @atlaskit/pragmatic-drag-and-drop-hitbox
npm install @atlaskit/pragmatic-drag-and-drop-react-drop-indicator
npm install @atlaskit/pragmatic-drag-and-drop-auto-scroll
```

## Import

```ts
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
  combine,
  reorder,
  attachClosestEdge,
  extractClosestEdge,
  DropIndicator,
  type Edge,
} from '@ui-dnd'
```

## Core Usage

### 基本拖放清單

```tsx
"use client"
import { useEffect, useRef, useState } from 'react'
import { draggable, dropTargetForElements, monitorForElements, combine, reorder } from '@ui-dnd'

function SortableList({ items }: { items: { id: string; title: string }[] }) {
  const [list, setList] = useState(items)

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0]
        if (!target) return

        const sourceId = source.data.id as string
        const targetId = target.data.id as string
        const startIndex = list.findIndex((i) => i.id === sourceId)
        const finishIndex = list.findIndex((i) => i.id === targetId)

        if (startIndex !== -1 && finishIndex !== -1) {
          setList(reorder({ list, startIndex, finishIndex }))
        }
      },
    })
  }, [list])

  return (
    <div>
      {list.map((item) => (
        <DraggableItem key={item.id} item={item} />
      ))}
    </div>
  )
}

function DraggableItem({ item }: { item: { id: string; title: string } }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return combine(
      draggable({
        element: ref.current!,
        getInitialData: () => ({ id: item.id }),
      }),
      dropTargetForElements({
        element: ref.current!,
        getData: () => ({ id: item.id }),
      }),
    )
  }, [item.id])

  return <div ref={ref} style={{ cursor: 'grab' }}>{item.title}</div>
}
```

### 邊緣插入（上方/下方）

```tsx
"use client"
import { useEffect, useRef, useState } from 'react'
import { draggable, dropTargetForElements, combine, attachClosestEdge, extractClosestEdge, DropIndicator, type Edge } from '@ui-dnd'

function EdgeDropItem({ item }) {
  const ref = useRef<HTMLDivElement>(null)
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null)

  useEffect(() => {
    return combine(
      draggable({ element: ref.current!, getInitialData: () => ({ id: item.id }) }),
      dropTargetForElements({
        element: ref.current!,
        getData: ({ input, element }) =>
          attachClosestEdge({ id: item.id }, { input, element, allowedEdges: ['top', 'bottom'] }),
        onDrag: ({ self }) => setClosestEdge(extractClosestEdge(self.data)),
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      }),
    )
  }, [item.id])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {item.title}
      {closestEdge && <DropIndicator edge={closestEdge} gap="1px" />}
    </div>
  )
}
```

## Key Exports

| Export | 類型 | 說明 |
|---|---|---|
| `draggable` | Adapter | 讓元素可拖動 |
| `dropTargetForElements` | Adapter | 讓元素成為放置目標 |
| `monitorForElements` | Monitor | 全局監聽拖放事件 |
| `combine` | Utility | 合併多個 cleanup 函數 |
| `reorder` | Utility | 純函數陣列重排 |
| `attachClosestEdge` | Hitbox | 附加最近邊緣資料到 getData |
| `extractClosestEdge` | Hitbox | 從 data 提取最近邊緣 |
| `reorderWithEdge` | Hitbox | 依邊緣方向重排陣列 |
| `DropIndicator` | Component | Box 型拖放插入線指示器 |
| `TreeDropIndicator` | Component | Tree-item 型拖放插入線指示器 |
| `autoScrollForElements` | Adapter | 拖動時自動捲動容器 |
| `Edge` | Type | `'top' \| 'bottom' \| 'left' \| 'right'` |

## Architecture Notes

- 僅用於 `interfaces/` 層（`"use client"` 必要）
- 所有綁定在 `useEffect` 中以 imperative 方式附加，不使用 JSX wrapper
- `combine()` 是合併多個 adapter cleanup 的正確方式
- 拖放後的業務狀態更新應透過 use case / application 層執行
- `DropIndicator` 父元素需要 `position: relative`
