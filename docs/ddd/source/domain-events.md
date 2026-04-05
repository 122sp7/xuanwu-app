# Domain Events ??source

## ?澆鈭辣

| 鈭辣 | 閫貊璇辣 | ?甈? |
|------|---------|---------|
| `source.upload_initiated` | upload-init 摰??偷??URL 撌脩??| `documentId`, `workspaceId`, `actorId`, `occurredAt` |
| `source.upload_completed` | upload-complete 蝣箄?摰? | `documentId`, `workspaceId`, `occurredAt` |
| `source.rag_document_registered` | RagDocument ???餉??脣?蝞∠? | `documentId`, `ragDocumentId`, `occurredAt` |
| `source.file_archived` | ?辣鋡怠?摮?| `documentId`, `actorId`, `occurredAt` |

## 閮鈭辣

| 靘? BC | 閮鈭辣 | 銵? |
|---------|---------|------|
| `workspace` | `workspace.created` | ???極雿???WikiLibrary |
| `identity` | `TokenRefreshSignal` | ?湔 ActorContext ??敹怎 |

## 瘨祥 source 鈭辣?隞?BC

| 瘨祥 BC | 鈭辣 | 銵? |
|---------|------|------|
| `ai` | `source.upload_completed` | 撱箇? IngestionJob嚗???RAG ?蝞∠? |
| `knowledge` | `source.upload_completed` | ?辣??亥???嚗?賂? |
