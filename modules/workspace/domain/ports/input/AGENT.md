# ports/input — Driving Ports（輸入端口）

此目錄保留給 `workspace` BC 的顯式 **inbound port interfaces**。

---

## 現況：可薄、可空，但位置必須保留

workspace 目前可能仍有部分 entrypoint 直接薄封裝到 use case，
但 **input contract 的正式位置仍定義在這裡**。

> 此目錄作為結構佔位，代表「我們知道 input port 的概念位置在哪裡」。

---

## ✅ 屬於此處（未來填入條件）

| 類型 | 填入時機 |
|------|---------|
| Inbound event handler interface | 當外部 BC 需要透過明確 interface 訂閱 workspace 事件時 |
| Command bus interface | 當引入 CQRS command bus，需要顯式 command handler contract 時 |
| Driving Adapter contract | 當 UI / external trigger 需要對 use case 有針對性的版本化 interface 時 |

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| Concrete class 或 adapter | 實作放 `interfaces/` 或 `infrastructure/` |
| 業務規則或流程邏輯 | 邏輯放 `domain/services/` 或 `application/services/` |
| 目前作用中的業務邏輯 | 此目錄未有 input contract 需求前保持空白 |

---

## 依賴方向

```
interfaces/api|cli|web → ports/input
ports/input → application/use-cases
ports/input → application/dtos（型別引用，如有需要）
```

`ports/input` **不可**依賴 `infrastructure/`，也不應承擔業務規則或流程協調。
