# knowledge-collaboration ??DDD Reference

> **Domain Type:** Supporting Subdomain + Generic Subdomain
> **Module:** `modules/knowledge-collaboration/`
> **閰喟敦璅∠??辣:** [`modules/knowledge-collaboration/`](../../modules/knowledge-collaboration/)

## ?啁摰?

`knowledge-collaboration` ??`knowledge` ??`knowledge-base` ?????箇?閮剜嚗?閮閮??敦蝎漲摮?甈????砍翰?扼?銝??霅摰對??芣?靘?雿??

## ?詨???

- **Comment** ??蝺?撘?閮嚗? `contentId` 撘?批捆
- **Permission** ??`(subjectId, principalId)` ????甈?蝝嚗iew < comment < edit < full
- **Version** ??Block 敹怎嚗mmutable嚗?憭???100 ???瑕???文?嚗?

## 銝餉???鈭辣

- `knowledge-collaboration.comment_created` / `comment_resolved`
- `knowledge-collaboration.permission_granted` / `permission_revoked`
- `knowledge-collaboration.version_created` / `version_restored`
- `knowledge-collaboration.page_locked`

## ?隤?

| 銵? | 摰儔 |
|---|---|
| **Comment** | ?? contentId ??閮嚗oot ??reply嚗?|
| **Permission** | ?桐? (subject, principal) ????甈???|
| **PermissionLevel** | `view` < `comment` < `edit` < `full` |
| **Version** | immutable Block 敹怎 |
| **NamedVersion** | ?瑟?鈭箏極璅惜????穿?銝??歹? |
| **contentId** | opaque reference ?唬遙?霅摰?|

## 銝???靽?

| ?? | BC | 憿? |
|---|---|---|
| 銝虜 | `workspace`, `identity` | Conformist |
| 銝虜 | `knowledge`, `knowledge-base`, `knowledge-database` | Customer/Supplier |
| 銝虜 | `notification`, `workspace-feed`, `workspace-audit` | Published Language |
