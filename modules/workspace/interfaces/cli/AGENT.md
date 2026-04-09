# interfaces/cli — CLI Driving Adapters

`cli/` 是 **命令列 / Cron Job 驅動層**，將命令參數轉換為 workspace 的 input port 呼叫。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| CLI 命令解析 | yargs / commander / oclif glue code |
| Cron / scheduled trigger entry | 定時工作入口 |
| 參數 → DTO 轉換 | argv / env / schedule payload 轉 DTO |
| 結果輸出 | stdout / stderr / exit code mapping |

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| Domain / Application 流程本體 | 放 `application/` |
| Repository / Database / Genkit concrete call | 應透過 port 協作 |
| React component / hook | 放 `interfaces/web/` |
| 複雜業務計算 | 放 `domain/services/` |

---

## 依賴箭頭

```txt
interfaces/cli
	-> application/dtos
interfaces/cli
	-> ports/input
ports/input
	-> application/use-cases
```

`interfaces/cli` **不可**直接依賴 `infrastructure/*`。