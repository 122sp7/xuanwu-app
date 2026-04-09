# platform

`platform` 是平台基礎能力的六邊形架構藍圖，負責主體治理、政策規則、能力啟用、跨邊界交付、稽核與可觀測性等平台底層能力。這個模組的目標是穩定語言與邊界，不是集中所有跨領域業務邏輯。

## 邊界定位

- 維持 `interfaces -> application -> domain <- infrastructure` 依賴方向
- `domain/` 保持 framework-free，不引入 HTTP、DB SDK、訊息匯流排與監控 SDK
- 所有外部輸入先進 `ports/input`
- 所有外部依賴先定義為 `ports/output`，再由 adapters / infrastructure 實作
- `ports/` 只依賴 `application/` 與 `domain/` 契約，不依賴 `api/`
- `api/` 只做公開邊界 re-export，不作為核心層的型別來源

## Hexagonal Mapping

- 本地藍圖使用 `adapters/` 作為 driving/driven adapter 統一層，語意上等同一般模組的 `interfaces/`
- `events/contracts` 只是投影層；事件語言單一來源在 `domain/events`

## 模組骨架

```text
modules/platform/
    domain/
    application/
    ports/
    adapters/
    infrastructure/
    docs/
    subdomains/
    AGENT.md
```

## Canonical Subdomain Inventory (23)

- `identity`
- `account`
- `account-profile`
- `organization`
- `access-control`
- `security-policy`
- `platform-config`
- `feature-flag`
- `onboarding`
- `compliance`
- `billing`
- `subscription`
- `referral`
- `integration`
- `workflow`
- `notification`
- `background-job`
- `content`
- `search`
- `audit-log`
- `observability`
- `analytics`
- `support`

此 inventory 採 closed by default，新增子域前必須先完成文件治理與邊界論證。

## 文件導覽

- [docs/README.md](./docs/README.md): 文件索引與拆分規則
- [docs/bounded-context.md](./docs/bounded-context.md): 邊界責任與封板規則
- [docs/subdomains.md](./docs/subdomains.md): 23 子域正式責任表
- [docs/context-map.md](./docs/context-map.md): 子域協作與共享語言
- [docs/ubiquitous-language.md](./docs/ubiquitous-language.md): 通用語言詞彙
- [docs/aggregates.md](./docs/aggregates.md): 核心聚合與不變數
- [docs/domain-services.md](./docs/domain-services.md): 跨聚合純規則
- [docs/application-services.md](./docs/application-services.md): use case orchestration
- [docs/repositories.md](./docs/repositories.md): repositories 與 output ports
- [docs/domain-events.md](./docs/domain-events.md): 事件命名與收發清單

## 變更準則

1. 先映射到既有子域
2. 再決定是 language、port、aggregate 或 adapter 變更
3. 若牽涉命名、事件或邊界，先更新 `docs/` 與 `AGENT.md`，再實作

## 文件閉環驗證

提交前建議最少執行一次文件閉環檢查：

1. `subdomains.md` 與 `bounded-context.md` 的 23 子域是否一致
2. `subdomains.md` / `application-services.md` 中的 ports 是否都在 `docs/repositories.md`
3. `docs/domain-events.md` 的事件術語是否都在 `docs/ubiquitous-language.md`
4. `docs/context-map.md` 的協作語言是否與 `docs/domain-events.md` 命名一致
