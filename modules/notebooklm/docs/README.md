# notebooklm — 文件索引

本目錄是 `modules/notebooklm/` 的 DDD blueprint 文件集。所有設計決策、語言定義、聚合結構與 port 契約都在此文件集中有唯一的真相來源。

## 閱讀路徑

### 初次理解邊界

1. [bounded-context.md](./bounded-context.md) — notebooklm 的責任邊界、能力分組與封板規則
2. [subdomains.md](./subdomains.md) — 7 個子域的正式責任表

### 深入語言與設計

3. [ubiquitous-language.md](./ubiquitous-language.md) — 所有術語的規範定義
4. [aggregates.md](./aggregates.md) — 核心聚合根、實體與值物件
5. [domain-services.md](./domain-services.md) — 跨聚合純業務規則

### 理解協作與事件

6. [context-map.md](./context-map.md) — 與外部 bounded context 的協作關係
7. [domain-events.md](./domain-events.md) — 事件命名與發/收清單

### 實作規劃

8. [application-services.md](./application-services.md) — use case orchestration 與命令/查詢清單
9. [repositories.md](./repositories.md) — output port 契約（repositories、stores、gateways）

## 變更同步規則

任何影響 notebooklm 邊界的變更，必須同步以下文件：

- 新增或修改聚合 → `aggregates.md`
- 新增或修改術語 → `ubiquitous-language.md`
- 新增或修改事件 → `domain-events.md`
- 新增或修改 port 契約 → `repositories.md`
- 新增或修改 use case → `application-services.md`
- 新增子域 → `subdomains.md` + `bounded-context.md` + subdomain `README.md`

**不允許**在未更新對應文件的情況下新增 TypeScript 實作。
