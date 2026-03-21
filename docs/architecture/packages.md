# MDDD packages/ — 邊界設計修正版

> **目的**：回應目前對 `packages/` 邊界清晰度的疑慮，明確定義 xuanwu-app 中 `packages/*` 與 `modules/*` 的分工，避免未來混淆。

---

## 1. 從 cal.com 與 plane 得到的共同結論

這兩個大型專案雖然細節不同，但有幾個共同點非常清楚：

1. **`packages/` 主要承載共享基礎能力**
   - 型別、工具函數、UI primitives、服務整合、API contracts、配置
2. **Feature / business workflow 不會因為「可重用」就一律塞進 packages**
   - 真正的功能邊界通常仍然保留在 feature/module 本身
3. **packages 必須有清楚的 public surface**
   - package 的價值是「明確邊界」與「穩定入口」，不是只是把檔案搬位置
4. **反向依賴必須被禁止**
   - packages 不應回頭依賴 app 或 feature internals，否則包層會失去意義

換句話說，cal.com / plane 的重點不是「有 packages」，而是：

> **packages 只放跨切面、穩定、可作為公共邊界的東西；業務模組依然維持自己的自治。**

---

## 2. xuanwu-app 的正確 package 切法

在 xuanwu-app：

- `modules/*` = **bounded context / feature ownership**
- `packages/*` = **stable public boundary**

這代表 `packages/*` 不是第二個 `modules/*`，也不是所有共用代碼的回收桶。

### 2.1 應該放進 packages 的東西

| 類型 | 目錄 | 說明 |
|------|------|------|
| Shared kernel | `packages/shared-*` | 跨模組合約、常數、validators、純工具 |
| Integrations | `packages/integration-*` | 第三方 SDK / transport adapters |
| UI primitives | `packages/ui-*` | shadcn / design-system 級別的可重用 UI |
| Vendor wrappers | `packages/lib-*` | 第三方庫的穩定入口 |
| API contracts | `packages/api-contracts` | DTO、transport-safe interfaces |

### 2.2 不應該放進 packages 的東西

以下內容應留在 `modules/*`：

- domain entities / value objects / repository ports（若只屬於單一 bounded context）
- use cases / workflows / orchestration
- module-specific hooks / server actions / view models
- screens、page composition、feature-specific UI

**判斷原則**：  
如果某段程式碼的主要問題是「它屬於哪個業務模組」，那它應該先留在 `modules/*`；  
如果主要問題是「它是不是一個跨模組的穩定公共能力」，才考慮 `packages/*`。

---

## 3. 什麼時候才能把 module code 升格成 package

只有同時滿足以下條件，才值得從模組抽成 package：

1. **有穩定 public API**
2. **有多個真實 consumer boundary**
   - 不是同一個模組內部多檔案重用而已
3. **責任單一**
   - 例如 shared contract、integration adapter、matching engine
4. **不依賴 app/module-specific orchestration**
5. **有清楚 owner**
   - 之後誰負責維護這個包要說得清楚

---

## 4. 目前 xuanwu-app 採用的 package taxonomy

```text
packages/
├── shared-*         跨模組共享基礎
├── integration-*    第三方整合邊界
├── ui-*             UI primitives / design-system surface
├── lib-*            第三方 library wrappers
└── api-contracts    API contracts
```

這種 taxonomy 的好處是：**名稱本身就帶語義**。

- `@shared-types` 一看就知道是共享合約
- `@integration-firebase` 一看就知道是 vendor adapter
- `@ui-shadcn` 一看就知道是 UI primitive surface

反過來說，若未來出現一個很模糊的名稱（例如單純叫 `@core`、`@common`、`@base`），那通常就是設計訊號：**邊界開始模糊了**。

---

## 5. 依賴方向

```text
packages/lib-*            → npm packages only
packages/shared-types     → npm packages only
packages/shared-*         → @shared-types (必要時)
packages/integration-*    → @shared-types, @lib-*
packages/ui-*             → @shared-*, UI internals only
packages/api-contracts    → @shared-types

modules/*/domain          → @shared-types
modules/*/application     → domain, @shared-types
modules/*/infrastructure  → domain, @integration-*, @lib-*
modules/*/interfaces      → application, @ui-*, @shared-*
```

**禁止：**

- `packages/*` 反向依賴 `app/*`, `modules/*`, `interfaces/*`, `infrastructure/*`
- `modules/*/domain` 依賴 UI 或 vendor integration
- 用舊路徑 (`@/shared/*`, `@/libs/*`, `@/ui/shadcn/ui/*`) 繞過 package boundary

---

## 6. 與 reviewer 顧慮直接對應的結論

review 提到的風險是對的：  
如果 `packages/` 只是把檔案搬走、但沒有清楚 taxonomy 和依賴限制，未來一定會混淆。

所以 xuanwu-app 應該把 `packages/` 明確定義成：

> **共享基礎能力與公共入口層，不是功能模組層。**

也因此：

- feature / bounded context 的主戰場仍然是 `modules/*`
- `packages/*` 只承載跨模組穩定能力
- 邊界必須靠文件 + lint 規則一起維持

---

## 7. 實作上的 guardrails

為了避免文件說一套、代碼長回去一套，目前應維持這些 guardrails：

1. 新代碼統一走 package aliases
   - `@shared-types`
   - `@shared-utils`
   - `@integration-firebase`
   - `@ui-shadcn`
2. packages 不得反向 import app/modules internals
3. module 業務代碼預設留在 `modules/*`
4. 若要新增 package，先回答：
   - 它是 shared / integration / ui / lib / contract 哪一類？
   - 它的 public API 是什麼？
   - 它的 owner 是誰？

---

## 8. 一句話總結

**不是因為要學 cal.com / plane 才做 packages；而是要學它們「只把真正跨切面、穩定、值得公開的東西做成 packages」這個邊界原則。**
