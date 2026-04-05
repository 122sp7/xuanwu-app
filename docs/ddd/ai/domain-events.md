# Domain Events ??ai

## ?澆鈭辣

| 鈭辣 | 閫貊璇辣 | ?甈? |
|------|---------|---------|
| `ai.ingestion_job_created` | ??IngestionJob 撱箇? | `jobId`, `documentId`, `workspaceId`, `occurredAt` |
| `ai.ingestion_completed` | Job ?????`indexed` | `jobId`, `documentId`, `chunkCount`, `occurredAt` |
| `ai.ingestion_failed` | Job ?????`failed` | `jobId`, `documentId`, `errorMessage`, `occurredAt` |

## 閮鈭辣

| 靘? BC | 閮鈭辣 | 銵? |
|---------|---------|------|
| `source` | `source.upload_completed` | 撱箇? IngestionJob嚗????亦恣蝺?|

## 瘨祥 ai 鈭辣?隞?BC

| 瘨祥 BC | 鈭辣 | 銵? |
|---------|------|------|
| `search` | `ai.ingestion_completed` | ?湔??蝝Ｗ?嚗agDocument 璅??箏?亥岷 |
| `source` | `ai.ingestion_completed` | ?湔 SourceDocument ?? ready |
| `workspace-audit` | `ai.ingestion_completed / failed` | 閮??蝔賣頠楚 |
