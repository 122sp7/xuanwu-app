# AGENT.md ??workspace-scheduling BC

## 璅∠?摰?

`workspace-scheduling` ?臬極雿?瘙?蝔?游?嚗恣??WorkDemand ??望??????

## ?隤?嚗biquitous Language嚗?

| 甇?Ⅱ銵? | 蝳迫雿輻 |
|----------|----------|
| `WorkDemand` | Demand?equest?icket?equirement |
| `DemandStatus` | Status嚗?其蝙?剁??tate |
| `DemandPriority` | Priority嚗?其蝙?剁??rgency |
| `CalendarWidget` | Calendar?cheduler |

## ???嚗??摰?

```
DemandStatus: draft ??open ??in_progress ??completed
DemandPriority: low | medium | high
```

## ??閬?

### ???迂
```typescript
import { workspaceSchedulingApi } from "@/modules/workspace-scheduling/api";
import type { WorkDemandDTO } from "@/modules/workspace-scheduling/api";
```

### ??蝳迫
```typescript
import { WorkDemand } from "@/modules/workspace-scheduling/domain/types";
```

## 撽??賭誘

```bash
npm run lint
npm run build
```
