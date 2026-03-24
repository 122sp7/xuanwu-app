---
name: context7
description: >
  每次對話自動載入的 Context7 MCP 整合技能。當 Agent 對任何函式庫 API、框架用法、
  套件版本、型別定義或技術實作細節的信心低於 99% 時，必須立即呼叫 Context7 MCP
  查詢最新官方文件，禁止以訓練資料中的過時知識直接回答。適用情境包括：
  Next.js App Router、Firebase SDK、Genkit API、shadcn/ui 元件用法、
  TypeScript 型別、任何 npm 套件的方法簽名與版本差異。
user-invocable: false
disable-model-invocation: false
---

# Context7 MCP 整合技能

## 🎯 技能定位

這是一個**強制查證技能**，每次對話由 Agent 自動載入。
目的是確保 GitHub Copilot Agent 在信心不足時，絕不使用可能過時的訓練資料，
而是透過 Context7 MCP 即時取得最新官方文件內容。

---

## ⚡ 核心觸發規則

### 🔴 信心閾值：99%

```
若 Agent 對以下任一項目的信心 < 99%，必須先呼叫 Context7 再回答：

  - 函式/方法的參數簽名
  - 套件版本間的 API 差異
  - 框架的最新最佳實踐
  - 型別定義與泛型用法
  - 設定檔格式（config schema）
  - 任何「我記得好像是...」的情況
```

> **原則：寧可多查一次，絕不輸出過時程式碼。**

---

## 🔄 工作流程

### Step 1：自我評估信心

在回答任何技術問題前，Agent 內部執行信心評估：

```
信心評估項目：
  □ 此 API 的方法簽名我確定嗎？
  □ 此版本的行為我確定嗎？
  □ 此框架的目前推薦寫法我確定嗎？
  □ 距離我的訓練資料，這個套件有可能更新嗎？

→ 任一項為「否」或「不確定」→ 觸發 Context7 查詢
```

### Step 2：解析函式庫 ID

```
context7:resolve-library-id({ libraryName: "套件名稱" })
```

範例：

```
context7:resolve-library-id({ libraryName: "next" })
context7:resolve-library-id({ libraryName: "firebase" })
context7:resolve-library-id({ libraryName: "@genkit-ai/core" })
context7:resolve-library-id({ libraryName: "shadcn/ui" })
```

### Step 3：取得文件內容

```
context7:get-library-docs({
  context7CompatibleLibraryID: "<Step 2 取得的 ID>",
  topic: "具體查詢主題",
  tokens: 5000
})
```

---

## 📦 xuanwu-app 常用技術棧查詢清單

| 技術 | 優先查詢主題 |
|---|---|
| `next` | App Router, Server Actions, Parallel Routes, Streaming |
| `firebase` | Firestore CRUD, Security Rules, Auth, Cloud Functions |
| `@genkit-ai/core` | Flow 定義, Tool Calling, Prompt 設計 |
| `@genkit-ai/firebase` | Firebase 整合, Trace, Deploy |
| `shadcn/ui` | 元件 API, Form, Dialog, DataTable |
| `typescript` | 型別工具, satisfies, infer, 泛型約束 |
| `zod` | Schema 定義, parse, transform, refine |
| `react` | Server Component, use(), Suspense, cache() |
| `tailwindcss` | 動態 class, CSS 變數, Dark mode |

---

## 🚫 禁止行為

```
# ❌ 錯誤：信心 < 99% 卻直接回答
"Firebase v9 的 onSnapshot 用法是 onSnapshot(ref, callback)"
（未確認當前版本 API 就直接輸出）

# ✅ 正確：先查 Context7
context7:resolve-library-id({ libraryName: "firebase" })
→ context7:get-library-docs({ id: "...", topic: "onSnapshot realtime listener" })
→ 基於文件回答

# ❌ 錯誤：「我記得 Next.js 14 有這個功能...」
（用訓練記憶猜測框架版本行為）

# ✅ 正確：
context7:resolve-library-id({ libraryName: "next" })
→ context7:get-library-docs({ id: "...", topic: "after() function" })
→ 確認後再回答
```

---

## 📝 查詢結果使用規範

Context7 回傳文件後，Agent 應：

1. **優先以文件為準**，捨棄與文件衝突的訓練資料
2. **標注資料來源**，回答中可說明「根據官方文件...」
3. **版本標注**，若文件含版本資訊則一併告知使用者
4. **不截斷關鍵簽名**，完整呈現方法參數與回傳型別

---

## 🔗 與 Serena MCP 協作

Context7 查詢到的重要 API 用法，若屬於專案長期使用的技術決策，
應同步透過 `serena:write_memory` 寫入記憶，避免下次重複查詢。

```
查詢完成 → 若為專案關鍵技術決策
         → serena:write_memory({ title: "[Context7] 技術名稱用法確認", content: "..." })
```
