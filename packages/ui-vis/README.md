# ui-vis

## Purpose

vis.js-based interactive data visualization components for React. Provides network graph and timeline visualizations as drop-in React components.

## Belongs to Module

UI layer — used by modules and pages that need to display network graphs or timeline data.

## Public API

| Export | Description |
|--------|-------------|
| `VisNetwork` | Interactive network/graph visualization component |
| `VisNetworkProps` | Props interface for `VisNetwork` |
| `VisTimeline` | Interactive timeline visualization component |
| `VisTimelineProps` | Props interface for `VisTimeline` |

## Dependencies

- `vis-network` — vis.js network graph library
- `vis-timeline` — vis.js timeline library
- `vis-data` — vis.js DataSet
- `libs/vis/*` — internal vis.js wrappers

## Example

```typescript
"use client";
import { VisTimeline, type VisTimelineProps } from "@ui-vis";

const items = [
  { id: 1, content: "Sprint 1", start: "2025-01-01", end: "2025-01-14" },
];

export function ProjectTimeline() {
  return <VisTimeline items={items} />;
}
```

## Rules

- All components are `"use client"` — do not use in Server Components
- Do not import `@/ui/vis/*` directly — always use `@ui-vis`
