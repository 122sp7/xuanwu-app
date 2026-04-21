# @ui-vis

Graph, network, and timeline visualization via **vis.js family** (`vis-network`, `vis-data`, `vis-timeline`).

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md) / [../AGENTS.md](../AGENTS.md)
- Public boundary: [index.ts](index.ts)

## Actual Exports

```ts
import {
  Network,
  DataSet,
  DataView,
  Timeline,
  type VisNode,
  type VisEdge,
  type VisNetworkOptions,
  type DataSetOptions,
  type TimelineOptions,
  type TimelineItem,
  type TimelineGroup,
} from '@ui-vis'
```

> `parseGephiNetwork` 與 `parseDOTNetwork` **不是** 目前 `@ui-vis` 的公開匯出；以 `index.ts` 為準。

## Runtime Notes

- 只在 client component 使用（需瀏覽器 DOM）。
- CSS 由消費端個別引入：
  - `vis-network/styles/vis-network.css`
  - `vis-timeline/styles/vis-timeline-graph2d.css`
- `Network` / `Timeline` 需在 effect 中建立並於 cleanup 呼叫 `destroy()`。

## Pair Contract

- `README.md` 只描述目前公開匯出與使用前提。
- `AGENTS.md` 負責 routing 與放置決策。
