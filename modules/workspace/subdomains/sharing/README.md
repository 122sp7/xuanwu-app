# workspace/subdomains/sharing

## 子域職責

`sharing` 子域負責工作區對外共享與可見性規則的正典邊界：

- 管理工作區或其內容的共享連結（`ShareLink`）與存取控制快照
- 維護可見性策略（`SharingPolicy`）：私有、組織內可見、公開連結等層級
- 提供共享狀態查詢與共享記錄的可稽核日誌

## 核心語言

| 術語 | 說明 |
|---|---|
| `ShareLink` | 一個共享存取入口聚合根，含存取層級與有效期 |
| `SharingPolicy` | 定義工作區或內容對外可見性規則 |
| `ShareTarget` | 共享對象描述（匿名連結、特定主體、組織） |
| `SharingRecord` | 一次共享操作的不可變記錄 |
| `AccessLevel` | 共享存取層級（`view`、`comment`、`edit`） |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`CreateShareLink`、`RevokeShareLink`、`UpdateSharingPolicy`、`ResolveShareAccess`）
- `domain/`: `ShareLink`、`SharingPolicy`、`SharingRecord`
- `infrastructure/`: Firestore 共享資料存取
- `interfaces/`: server action 接線、共享設定 UI

## 整合規則

- `sharing` 不是一般 permission 欄位的集合：它是獨立的語義邊界，擁有自己的策略語言
- 共享狀態變更觸發 `workspace.sharing-changed` 事件，供 `audit` 與 `feed` 訂閱
- 父模組 public API（`@/modules/workspace/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/workspace/subdomains.md 建議建立
