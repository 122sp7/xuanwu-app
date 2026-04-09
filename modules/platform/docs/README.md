# platform docs

`platform/docs/` 是平台藍圖的文件索引入口。本資料夾採「單一主題、單一文件」拆分，避免把邊界、語言、聚合、事件與存取契約混在同一份 README。

## 文件分工

| 文件 | 主題 |
|---|---|
| `aggregates.md` | 核心聚合、值物件與不變數 |
| `application-services.md` | use case handlers、命令/查詢協調與 input ports 對應 |
| `bounded-context.md` | platform 邊界、責任範圍與 closed inventory 規則 |
| `context-map.md` | 23 個子域間協作方向與共享語言 |
| `domain-events.md` | 事件命名、事件擁有者、發出/訂閱清單 |
| `domain-services.md` | 跨聚合純規則與 decision objects |
| `repositories.md` | repositories、support ports、delivery ports |
| `subdomains.md` | 正式 23 子域 inventory 與責任對照 |
| `ubiquitous-language.md` | platform 通用語言與 port 詞彙 |

## 讀取順序

1. 先讀 `bounded-context.md` 確認邊界與封板規則
2. 讀 `subdomains.md` 與 `context-map.md` 確認責任與協作
3. 讀 `ubiquitous-language.md` 鎖定命名
4. 最後讀 `aggregates.md`、`domain-services.md`、`application-services.md`、`repositories.md`、`domain-events.md` 進入設計細節

## 變更同步規則

- 變更聚合或值物件：同步更新 `aggregates.md` 與 `ubiquitous-language.md`
- 變更 use case handlers 或 input ports：同步更新 `application-services.md`
- 變更 output ports 或 repository：同步更新 `repositories.md`
- 變更事件名稱或 payload：同步更新 `domain-events.md`
- 變更子域責任：同步更新 `subdomains.md` 與 `context-map.md`
- 變更平台邊界：同步更新 `bounded-context.md` 與 `../AGENT.md`