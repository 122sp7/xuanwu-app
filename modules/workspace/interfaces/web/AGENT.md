# interfaces/web — Web Driving Adapters

`web/` 是 **UI 封裝層**，將前端 UI 元件與 workspace input ports 連接，支援 React / shadcn 組件。

> 新增的 UI component / hook 以收斂到這裡為原則；不要再把新的 driving adapter 散落在其他目錄。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| shadcn UI Components | 表單、對話框、screen components |
| React Hooks | 呼叫 input ports、管理 loading / error state |
| UI state | 展開、切換、表單草稿等非業務狀態 |
| DTO mapping | form state / query param → DTO |

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| 核心業務邏輯（Domain / Application） | 放 `domain/`、`application/` |
| Repository / Database / Genkit concrete call | 應透過 `ports/input/` / use case 間接協作 |
| HTTP Route Handler | 放 `interfaces/api/` |
| CLI 命令解析 | 放 `interfaces/cli/` |

---

## 依賴箭頭

```txt
interfaces/web
	-> application/dtos
interfaces/web
	-> ports/input
ports/input
	-> application/use-cases
```

`interfaces/web` **不可**直接依賴 `infrastructure/*`。