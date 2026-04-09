# interfaces/api — API Driving Adapters

`api/` 是 **HTTP / Next.js App Router 驅動層**，負責把外部請求轉成 workspace 的 input port 呼叫。

> 新增內容一律以 driving adapter 責任為準；不要把 use case 或 infrastructure 邏輯塞進這裡。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Route Handlers / API Endpoints | Next.js Route Handler |
| Request parsing / validation | body、query、headers 轉 DTO |
| Auth / session adaptation | 從外部請求取 actor context |
| Response mapping | domain / use-case result → HTTP response |
| 薄型同步公開入口 | 只做轉接、不做業務判斷的 facade / contracts glue |

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| Domain rule / invariant / policy | 放 `domain/` |
| Use case 內部流程本體 | 放 `application/use-cases/` |
| Repository / Database / Genkit concrete call | 應透過 `ports/input/` / `ports/output/` 間接協作 |
| React component / hooks | 放 `interfaces/web/` |

---

## 依賴箭頭

```txt
interfaces/api
	-> application/dtos
interfaces/api
	-> ports/input
ports/input
	-> application/use-cases
```

`interfaces/api` **不可**直接依賴 `infrastructure/firebase/`、`infrastructure/events/`。