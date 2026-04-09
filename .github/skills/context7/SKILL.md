---
name: context7
description: >
  Auto-load verification skill for library/framework API accuracy. Use when confidence is below 99.99% on API signatures,
  version behavior, or config schema details. Resolve library ID and fetch official docs before answering.
user-invocable: false
disable-model-invocation: false
---

# Context7 MCP

## 目的

把 Context7 當成**官方文件驗證層**。只要對 library API、版本行為、設定 schema、參數名稱或回傳型別有任何不確定，就先查 Context7，再回答、規劃或寫碼。

## 何時必用

- 不確定 API signature、options、return type
- 不確定版本差異或 breaking change
- 不確定設定檔 schema（例如 Next.js、Firebase、Zod、XState）
- 使用者要求「查官方文件」「確認最新版行為」
- 需要最新文件而不是依賴模型記憶

## 對應 MCP Tools

| 目的 | 工具 | 說明 |
|---|---|---|
| 解析 library ID | `upstash-context7-resolve-library-id` | 先把套件/框架名稱解析成 Context7 相容 ID |
| 讀官方文件 | `upstash-context7-get-library-docs` | 用解析出的 ID 讀文件；支援 `mode`、`topic`、`page` |

> 若使用者已直接提供 Context7 ID（例如 `/vercel/next.js` 或 `/mongodb/docs/v8.0`），可直接呼叫 `upstash-context7-get-library-docs`，否則**一定要先 resolve**。

## 強制工作流

1. 把問題縮成**單一 library + 單一主題**。
2. 呼叫 `upstash-context7-resolve-library-id` 取得正確 ID。
3. 呼叫 `upstash-context7-get-library-docs`：
   - `mode: "code"`：查 API、簽名、範例、設定欄位
   - `mode: "info"`：查概念、架構、遷移說明
   - `topic`: 聚焦單一主題，例如 `routing`、`server actions`、`hooks`
4. 若第一頁資訊不足，再用同一組 `topic` 翻下一頁（`page: 2, 3...`）。
5. 以取回文件為權威，再決定回答、規劃、修改或驗證。

## 自洽使用規則

- **先 resolve，後 docs**；不要猜 library ID。
- 一次只查一個 library；不要把多個框架混在同一次 docs 查詢裡。
- `topic` 要窄，不要用「all」「everything」這種寬查詢。
- 查 API 與程式碼範例時優先用 `mode: "code"`。
- 查概念、限制、遷移與設計原因時用 `mode: "info"`。
- 文件不足時先翻頁，再決定是否需要第二個 topic。
- 回答時要明確表示結論是根據 Context7 文件，而不是模型記憶。

## 最小決策表

| 情境 | 動作 |
|---|---|
| 使用者只說 library 名稱 | 先 `resolve-library-id` |
| 使用者已給 `/org/project` | 直接 `get-library-docs` |
| 要確認 API 怎麼呼叫 | `mode: "code"` |
| 要確認某功能怎麼運作/限制是什麼 | `mode: "info"` |
| 內容不夠 | 同 topic 換 `page` |
| resolve 結果有多個接近候選 | 先選最相關者；若仍歧義再請使用者澄清 |

## 推薦輸出格式

1. 這次驗證的 library 與 topic
2. Context7 查到的關鍵結論
3. 對目前任務的影響（可做 / 不可做 / 要改哪裡）
4. 剩餘不確定點（若有）

## 反模式

- ❌ 憑印象直接回答最新版 API
- ❌ 未 resolve 就手填 library ID
- ❌ 一次抓整套文件，不加 topic
- ❌ 拿別的框架文件套到目前 library
- ❌ 查到文件後仍用記憶覆蓋文件內容

## 短流程模板

```text
目標：確認 <library> 的 <topic>
1. resolve library id
2. get docs(mode=code|info, topic=<topic>)
3. 如不足則翻 page
4. 依文件做回答/規劃/修改
```
