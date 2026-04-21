# infra/virtual — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/virtual/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


此套件是 **headless 虛擬化長清單與長表格的唯一授權來源**，透過 TanStack Virtual v3 提供 DOM 元素數量最小化的能力。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 容器內虛擬化 | `useVirtualizer({ count, getScrollElement, estimateSize })` |
| 全頁面虛擬化 | `useWindowVirtualizer({ count, estimateSize, scrollMargin })` |
| VirtualItem 型別 | `key`, `index`, `start`, `end`, `size`, `lane` 存取 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 表格 headless 狀態 | `packages/infra/table/` |
| 清單 UI 樣式 | `packages/ui-shadcn/` / `packages/ui-components/` |
| 帶業務語意的虛擬列表（TaskFeed） | `src/modules/<context>/interfaces/` |
| 資料查詢與無限捲動 | `packages/infra/query/` (`useInfiniteQuery`) |

---

## 嚴禁

```ts
// ❌ 不得在 domain/ 層 import
// ❌ 虛擬化容器高度不得使用絕對值，應由 getTotalSize() 決定

// ✅ 正確模式
const parentRef = useRef<HTMLDivElement>(null)
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 48,
})

// 容器必須設定固定高度並 overflow-y: auto
return (
  <div ref={parentRef} style={{ height: '400px', overflowY: 'auto' }}>
    <div style={{ height: virtualizer.getTotalSize() }}>
      {virtualizer.getVirtualItems().map((vItem) => (
        <div
          key={vItem.key}
          style={{ position: 'absolute', top: vItem.start, height: vItem.size }}
        >
          {items[vItem.index]}
        </div>
      ))}
    </div>
  </div>
)
```

- 此套件 hook 均需 `"use client"`，不得在 Server Component 使用
- `getVirtualItems()` 只渲染可見項目，外層容器必須使用 `position: relative`
- 不得在此套件包含任何業務語意

## Alias

```ts
import { useVirtualizer, useWindowVirtualizer, type VirtualItem } from '@infra/virtual'
```
