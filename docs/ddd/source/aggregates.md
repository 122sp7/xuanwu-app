# Aggregates ??source

## ???對?SourceDocument嚗ile.ts嚗?

### ?瑁痊
蝞∠??辣???喟??賡望?嚗?銝???摰?蝣箄?嚗誑???砍翰?扯?靽??輻???

### ??望????
```
pending_upload ??[upload_complete]????uploaded ??[archive]????archived
```

### ?撅祆?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `id` | `string` | ?辣銝駁 |
| `name` | `string` | 瑼??迂 |
| `organizationId` | `string` | ?撅祉?蝜?|
| `workspaceId` | `string \| null` | ?撅砍極雿? |
| `status` | `FileStatus` | `pending_upload \| uploaded \| archived` |
| `versions` | `FileVersion[]` | ??” |
| `retentionPolicy` | `RetentionPolicy \| null` | 靽??輻? |
| `permissionSnapshot` | `PermissionSnapshot` | 銝??甈翰??|

---

## ???對?WikiLibrary

### ?瑁痊
RAG ?辣??頛舫??捆?剁?撠?雿輻? UI ??霅澈??敹萸?

---

## ?潛隞?

| ?潛隞?| 隤芣? |
|--------|------|
| `FileVersion` | ?敹怎嚗ersionId, fileUrl, createdAt嚗?|
| `RetentionPolicy` | 靽?閬?嚗etainDays, deleteAfterExpiry嚗?|
| `PermissionSnapshot` | 銝????敹怎嚗??航?嚗?|
| `AuditRecord` | ??蝔賣閮?嚗ppend-only嚗?|

---

## Ports嚗exagonal Architecture嚗?

| Port | 隤芣? |
|------|------|
| `ActorContextPort` | 閫?????澈???? |
| `OrganizationPolicyPort` | ?亥岷蝯?撅斤??輻? |
| `WorkspaceGrantPort` | 撽?撌乩???? |

---

## Repository Interfaces

| 隞 | 銝餉??寞? |
|------|---------|
| `FileRepository` | `save()`, `findById()`, `listByWorkspace()` |
| `RagDocumentRepository` | `save()`, `findByDocumentId()` |
| `WikiLibraryRepository` | `save()`, `findByWorkspaceId()` |
