# @infra/virtual

Headless list and grid virtualization via **TanStack Virtual v3**.

## Purpose

在 `interfaces/` 層渲染超大清單時，限制實際 DOM 節點數量以維持效能。只渲染目前可見的項目，並以總高度撐開容器保持滾動條準確度。

## Import

```ts
import { useVirtualizer, useWindowVirtualizer, type VirtualItem } from '@infra/virtual'
```

## Core Usage

### 容器虛擬化（useVirtualizer）

```tsx
"use client"
import { useRef } from 'react'
import { useVirtualizer } from '@infra/virtual'

function TaskList({ tasks }: { tasks: Task[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,       // 預估每列高度 px
    overscan: 5,                  // 緩衝渲染列數
  })

  return (
    <div
      ref={parentRef}
      style={{ height: '600px', overflowY: 'auto', position: 'relative' }}
    >
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((vItem) => (
          <div
            key={vItem.key}
            data-index={vItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: vItem.start,
              left: 0,
              width: '100%',
            }}
          >
            <TaskRow task={tasks[vItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 全頁面虛擬化（useWindowVirtualizer）

```tsx
"use client"
import { useWindowVirtualizer } from '@infra/virtual'

function InfiniteSourceList({ sources }: { sources: Source[] }) {
  const virtualizer = useWindowVirtualizer({
    count: sources.length,
    estimateSize: () => 80,
    scrollMargin: 64,   // 固定 header 高度補償
  })

  return (
    <div style={{ height: virtualizer.getTotalSize() }}>
      {virtualizer.getVirtualItems().map((vItem) => (
        <div
          key={vItem.key}
          style={{
            position: 'absolute',
            top: vItem.start - virtualizer.options.scrollMargin,
            width: '100%',
          }}
        >
          <SourceCard source={sources[vItem.index]} />
        </div>
      ))}
    </div>
  )
}
```

## Key Exports

| Export | 類型 | 說明 |
|---|---|---|
| `useVirtualizer` | Hook | 容器內虛擬化，需提供 `getScrollElement` |
| `useWindowVirtualizer` | Hook | 全頁面虛擬化，使用 `scrollMargin` 補償 offset |
| `VirtualItem` | Type | 虛擬項目（`key`, `index`, `start`, `end`, `size`, `lane`） |
| `VirtualizerOptions` | Type | virtualizer 設定選項型別 |
| `Virtualizer` | Type | virtualizer 實例型別 |
| `Range` | Type | 可見範圍型別 |

## Virtualizer 方法

| 方法 | 說明 |
|---|---|
| `getVirtualItems()` | 返回目前可見的 `VirtualItem[]` |
| `getTotalSize()` | 返回容器應有的總高度（撐開容器用） |
| `scrollToIndex(index)` | 程式化捲動到指定項目 |
| `measureElement` | ref callback，用於動態高度測量 |

## Architecture Notes

- 僅用於 `interfaces/` 層（`"use client"` 必要）
- 與 `packages/infra/query/` 的 `useInfiniteQuery` 搭配實現無限捲動
- 與 `packages/infra/table/` 搭配實現虛擬化表格
- 外層容器必須設定 `position: relative`，項目設定 `position: absolute`
