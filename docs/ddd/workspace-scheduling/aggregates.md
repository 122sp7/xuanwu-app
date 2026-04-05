# Aggregates ??workspace-scheduling

## ???對?WorkDemand

### ?瑁痊
隞?”銝?極雿?瘙??恣??瘙?????望?嚗raft ??completed嚗?

### ??望????
```
draft ????open ????in_progress ????completed
```

### ?撅祆?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `id` | `string` | ?瘙蜓??|
| `workspaceId` | `string` | ?撅砍極雿? |
| `accountId` | `string` | ?撅砍董??|
| `title` | `string` | ?瘙?憿?|
| `description` | `string \| null` | ?膩嚗?賂? |
| `status` | `DemandStatus` | `draft \| open \| in_progress \| completed` |
| `priority` | `DemandPriority` | `low \| medium \| high` |
| `dueDate` | `string \| null` | ?芣迫?交? ISO 8601 |
| `createdAt` | `string` | ISO 8601 |
| `updatedAt` | `string` | ISO 8601 |

### 銝???

- `title` 銝?箇征
- `completed` ????舫? `draft`

---

## ?潛隞?

| ?潛隞?| 隤芣? |
|--------|------|
| `DemandStatus` | `"draft" \| "open" \| "in_progress" \| "completed"` |
| `DemandPriority` | `"low" \| "medium" \| "high"` |

---

## Repository Interfaces

| 隞 | 銝餉??寞? |
|------|---------|
| `DemandRepository` | `save()`, `findById()`, `listByWorkspace()`, `updateStatus()` |
