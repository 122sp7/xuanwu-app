# knowledge-collaboration ??DDD Reference

> **Domain Type:** Supporting Subdomain
> **Module:** `modules/knowledge-database/`
> **閰喟敦璅∠??辣:** [`modules/knowledge-database/`](../../modules/knowledge-database/)

## ?啁摰?

`knowledge-database` 撠? Notion Database ?賢?嚗?靘?瑽?鞈??脣???閬?撅內?蝙?刻摰儔甈? Schema嚗誑銝?閬?嚗able/Board/Calendar/Timeline/Gallery嚗蝝Ｙ????

## ?詨???

- **Database** ??甈? Schema 摰孵 + 閬?皜嚗nvariant ??
- **Record** ???株?鞈?嚗roperties Map嚗ieldId ??value嚗?
- **View** ??閬??蔭嚗ype + filters + sorts + groupBy

## 閬?憿?

`table` | `board` | `list` | `calendar` | `timeline` | `gallery`

## 甈?憿?

`text` | `number` | `select` | `multi_select` | `date` | `checkbox` | `url` | `email` | `relation` | `formula` | `rollup`

## 銝餉???鈭辣

- `knowledge-database.database_created`
- `knowledge-database.field_added` / `field_deleted`
- `knowledge-database.record_added` / `record_updated` / `record_deleted`
- `knowledge-database.record_linked`
- `knowledge-database.view_created` / `view_updated`

## ?隤?

| 銵? | 摰儔 |
|---|---|
| **Database** | 蝯????捆?剁???KnowledgeCollection嚗?|
| **Field** | Schema 甈?摰儔嚗? Column嚗?|
| **Record** | 鞈?銵???Row, Item嚗?|
| **Property** | Record 銝剜? Field ?擃?|
| **View** | 閬??蔭嚗???鞈?嚗?|
| **Relation** | 頝?Database ??Record ???甈?憿? |

## 銝???靽?

| ?? | BC | 憿? |
|---|---|---|
| 銝虜 | `workspace`, `identity`, `organization` | Conformist |
| 銝虜 | `knowledge-collaboration` | Customer/Supplier嚗ermission嚗?|
| 銝虜 | `workspace-feed`, `notification` | Published Language |
| ?? | `knowledge`, `knowledge-base` | Open Host Service |
