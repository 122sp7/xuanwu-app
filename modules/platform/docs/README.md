# platform docs

`platform/docs/` 是 platform blueprint 的文件索引入口。這組文件以 **Hexagonal Architecture with Domain-Driven Design** 為閱讀骨架：先確認邊界與通用語言，再確認聚合、use case、ports、events 與 adapters 的責任分工。

## Hexagonal + DDD 閱讀框架

| 關注點 | 文件 | 說明 |
|---|---|---|
| Bounded Context 邊界 | `bounded-context.md` | platform 的責任範圍、封板規則與 public boundary |
| Canonical subdomains | `subdomains.md` | 23 個正式子域與 capability inventory |
| Shared language | `ubiquitous-language.md` | 聚合、ports、事件與協作的命名權威 |
| Domain core | `aggregates.md`, `domain-services.md`, `domain-events.md` | 聚合、不變數、純規則與 published language |
| Application orchestration | `application-services.md` | use case handlers、input ports 與 command/query 協調 |
| Driven ports | `repositories.md` | repositories、query ports、support ports、delivery ports |
| Collaboration map | `context-map.md` | 子域間的共享語言與協作方向 |

## 文件分工

| 文件 | 主題 |
|---|---|
| `aggregates.md` | 核心聚合、值物件、不變數與 aggregate lifecycle |
| `application-services.md` | use case handlers、input ports、command/query 協調 |
| `bounded-context.md` | platform 邊界、責任範圍、public boundary 與 layer mapping |
| `context-map.md` | 23 個子域間的協作關係與共享語言 |
| `domain-events.md` | 事件命名、事件擁有者、發出/訂閱與 publish lifecycle |
| `domain-services.md` | 跨聚合純規則、decision objects 與 service 抽取準則 |
| `repositories.md` | repository ports、query ports、support ports、delivery ports |
| `subdomains.md` | 正式 23 子域 inventory 與責任對照 |
| `ubiquitous-language.md` | platform 通用語言與 Hexagonal vocabulary |

## 讀取順序

1. 先讀 `bounded-context.md` 確認 platform 這個 bounded context 的責任與 public boundary
2. 讀 `subdomains.md` 與 `context-map.md`，理解 23 個子域如何協作
3. 讀 `ubiquitous-language.md`，鎖定 aggregate、port、event、adapter 的命名
4. 最後讀 `aggregates.md`、`domain-services.md`、`application-services.md`、`repositories.md`、`domain-events.md` 進入設計細節

## Hexagonal 對照

| Hexagonal concept | platform blueprint |
|---|---|
| Public boundary | `api/` |
| Driving adapters | `adapters/`（CLI、web、external ingress 等） |
| Application layer | `application/` |
| Domain core | `domain/` |
| Input ports | `ports/input/` |
| Output ports | `ports/output/` |
| Driven adapters | `infrastructure/` |
| Published language | `domain/events/` + `application/dtos/` |

## 變更同步規則

- 變更聚合或值物件：同步更新 `aggregates.md` 與 `ubiquitous-language.md`
- 變更 use case handlers、input ports 或 command/query 語言：同步更新 `application-services.md`
- 變更 repositories、support ports 或 delivery ports：同步更新 `repositories.md`
- 變更事件名稱、payload 或事件擁有者：同步更新 `domain-events.md`
- 變更子域責任：同步更新 `subdomains.md` 與 `context-map.md`
- 變更 platform 邊界或 public boundary：同步更新 `bounded-context.md`、`../README.md` 與 `../AGENT.md`

## 文件閉環檢查清單

每次調整 platform 文件後，至少確認以下幾點：

1. `api/`、`ports/`、`adapters/`、`infrastructure/` 的角色敘述沒有互相重疊
2. `subdomains.md` 出現的術語都能在 `ubiquitous-language.md` 找到定義
3. `application-services.md` 與 `subdomains.md` 提到的 ports 都能在 `repositories.md` 找到契約
4. `domain-events.md` 的事件命名、事件擁有者與 `context-map.md` 協作語言沒有衝突
5. 文件沒有把 adapter concern 寫回 domain/application 規則
