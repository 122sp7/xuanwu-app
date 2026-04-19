# Notion

本文件在本次任務限制下，僅依 Context7 驗證的 DDD、Context Map、Hexagonal Architecture 參考整理，不主張反映現況實作。

## Baseline Subdomains

| Subdomain | Responsibility |
|---|---|
| knowledge | 頁面建立、組織、版本化與交付（實作層以 `page` + `block` 對應）|
| authoring | 知識庫文章建立、驗證與分類（實作層整合至 `page` 子域）|
| collaboration | 協作留言、細粒度權限與版本快照 |
| database | 結構化資料多視圖管理（原名 `knowledge-database`，已重命名）|
| knowledge-engagement | 知識使用行為量測 |
| attachments | 附件與媒體關聯儲存 |
| automation | 知識事件觸發自動化動作 |
| external-knowledge-sync | 知識與外部系統雙向整合 |
| notes | 個人輕量筆記與正式知識協作 |
| templates | 頁面範本管理與套用 |
| knowledge-versioning | 全域版本快照策略管理 |
| taxonomy | 分類法與語義組織邊界 |
| relations | 內容之間關聯與 backlink 邊界 |
| publishing | 正式發布與對外交付邊界 |

> **實作層命名備注：** `src/modules/notion/` 以 `page`、`block`、`database`、`view`、`collaboration`、`template` 作為子域目錄名稱。
> `view` 子域承接 `database` 的多視圖能力；`block` 是 `page` 的內容區塊子結構。
> `knowledge-database` 已正式重命名為 `database`；所有戰略文件與實作路徑均已同步更新。

## Recommended Gap Subdomains

無剩餘已驗證 gap subdomain（taxonomy / relations / publishing 已升為 baseline）。

## Anti-Patterns

- 不把 taxonomy 混成 authoring 裡的附屬設定。
- 不把 relations 混成單純 hyperlink 功能，失去語義關係邊界。
- 不把 publishing 混成 UI 上的一個按鈕事件，而忽略正式交付語言。
- 不把 ai context 的共享能力誤寫成 notion 自己擁有的 `ai` 子域。

## Copilot Generation Rules

- 生成程式碼時，先判斷需求屬於 knowledge、authoring、relations、publishing、knowledge-engagement、external-knowledge-sync、knowledge-versioning 哪一個內容責任。
- 奧卡姆剃刀：能在既有子域用一個明確 use case 解決，就不要新建第二個概念接近的子域。
- 子域命名要反映內容語義，不要退化成頁面或元件名稱。

## Dependency Direction Flow

```mermaid
flowchart LR
	UI["Interfaces"] --> UseCase["Use case"]
	UseCase --> Subdomain["Owning subdomain domain"]
	Infra["Infra adapter"] --> Subdomain
```

## Correct Interaction Flow

```mermaid
flowchart LR
	Authoring["Authoring"] --> Knowledge["Knowledge"]
	Knowledge --> Taxonomy["Taxonomy"]
	Knowledge --> Relations["Relations"]
	Taxonomy --> Publishing["Publishing"]
	Relations --> Publishing
```

## Document Network

- [README.md](./README.md)
- [bounded-contexts.md](./bounded-contexts.md)
- [context-map.md](./context-map.md)
- [ubiquitous-language.md](./ubiquitous-language.md)
- [subdomains.md](../domain/subdomains.md)
- [bounded-contexts.md](../domain/bounded-contexts.md)