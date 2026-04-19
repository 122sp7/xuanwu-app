# ui-dnd — Agent Rules

此套件是 **拖放（Drag-and-Drop）能力的唯一授權來源**，透過 Atlassian Pragmatic DnD 提供效能優化的拖放原語。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 元素拖放綁定 | `draggable`, `dropTargetForElements`, `monitorForElements` |
| 多 cleanup 合併 | `combine(cleanup1, cleanup2, ...)` — useEffect 清理 |
| 陣列重排 | `reorder({ list, startIndex, finishIndex })` |
| 邊緣插入 | `attachClosestEdge` / `extractClosestEdge` + `Edge` 型別 |
| 拖放視覺指示器 | `DropIndicator`（box）、`TreeDropIndicator`（tree-item） |
| 容器自動捲動 | `autoScrollForElements` |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 帶業務語意的可拖放組件（TaskCard） | `src/modules/<context>/interfaces/` |
| 拖放後的業務狀態更新 | `src/modules/<context>/application/` use case |
| 拖放資料 schema 定義 | `src/modules/<context>/domain/` |
| UI 組件樣式 | `packages/ui-shadcn/` / `packages/ui-components/` |

---

## 嚴禁

```ts
// ❌ 不得在 domain/ / application/ 層 import 任何此套件

// ✅ 正確模式：在 interfaces/ 的 Client Component 使用
"use client"
import { useEffect, useRef } from 'react'
import { draggable, combine } from '@ui-dnd'

function DraggableCard({ item }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return combine(
      draggable({ element: ref.current!, getInitialData: () => ({ id: item.id }) })
    )
  }, [item.id])

  return <div ref={ref}>{item.title}</div>
}
```

- 所有消費者必須加 `"use client"`（瀏覽器 drag API）
- 拖放邏輯在 `useEffect` 中以命令式綁定，清理函數必須透過 `combine` 合併後 return
- `DropIndicator` 父元素必須設定 `position: relative`
- 不得在此套件包含任何業務語意

## Alias

```ts
import { draggable, dropTargetForElements, combine, reorder, DropIndicator } from '@ui-dnd'
```
