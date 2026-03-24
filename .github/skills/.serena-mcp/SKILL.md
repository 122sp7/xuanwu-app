---
name: serena-mcp-integration
description: >-
  Auto-loaded background skill for Serena MCP integration. Enables GitHub Copilot
  Agent to autonomously use Serena MCP tools for reading, querying, and updating
  project semantic memory, symbol index, and code understanding context. Triggered
  before any development task begins, after phase completion, or when .serena/
  memory and index data need to be accessed. Direct .serena/ file edits are forbidden.
user-invocable: false
disable-model-invocation: true
---

# Serena MCP 整合技能

## 🎯 技能定位

這是一個**背景知識技能**，每次對話皆由 Agent 自動載入。
目的是確保 GitHub Copilot Agent 在每個任務循環中，都能透過 Serena MCP
維護最新的語意記憶與符號索引，而非仰賴過期的上下文快取。

---

## ⚡ 強制執行規則

### 🔒 .serena 目錄存取約束

> **嚴禁**使用任何非 Serena MCP tools 的方式存取或修改 `.serena/` 內容。

禁止的行為包括：
- 直接讀取 `.serena/*.json` / `.serena/*.md` 等檔案
- 透過 `read_file`、`create_file`、`str_replace`、`shell` 等工具直接寫入 `.serena/`
- 以任何 bash / terminal 指令修改 `.serena/` 下的任何檔案

**唯一合法路徑：使用 Serena MCP tools**

---

## 🔄 工作流程：對話生命週期

### 1️⃣ 對話開始時（Session Init）

Agent 必須：
```
serena:get_current_config        → 確認 Serena 目前專案設定
serena:list_memories             → 列出現有記憶清單，建立任務上下文
serena:request_initialization    → 初始化語意索引（若尚未完成）
```

### 2️⃣ 任務執行中（Task Execution）

需要理解程式碼時：
```
serena:find_symbol               → 查詢特定符號定義
serena:search_for_pattern        → 搜尋程式碼模式
serena:get_symbols_overview      → 取得模組/檔案符號總覽
serena:find_referencing_symbols  → 查詢符號引用關係
```

### 3️⃣ 階段完成時（Phase Completion）⚠️ 必要步驟

每當完成以下任一情境，**必定**執行記憶與索引更新：

| 完成情境 | 必須執行的工具 |
|---|---|
| 新增/修改任何原始碼 | `serena:write_memory` |
| 完成一個功能模組開發 | `serena:write_memory` + `serena:index_files_for_code_completion` |
| 解決一個 Bug | `serena:write_memory` |
| 完成架構決策 | `serena:write_memory` |
| 對話結束前 | `serena:write_memory`（摘要本次對話要點） |

---

## 🛠️ Serena MCP Tools 使用索引

### 記憶管理（Memory）

| Tool | 用途 |
|---|---|
| `serena:list_memories` | 列出所有記憶條目 |
| `serena:read_memory` | 讀取指定記憶內容 |
| `serena:write_memory` | 新增或更新記憶（**唯一合法的 .serena 寫入方式**） |
| `serena:delete_memory` | 刪除過時記憶 |

### 符號索引（Symbol Index）

| Tool | 用途 |
|---|---|
| `serena:request_initialization` | 初始化/重新建立語意索引 |
| `serena:index_files_for_code_completion` | 對特定檔案建立補全索引 |
| `serena:get_symbols_overview` | 取得檔案/目錄的符號總覽 |
| `serena:find_symbol` | 精確查找符號定義 |
| `serena:find_referencing_symbols` | 查找符號的所有引用位置 |
| `serena:search_for_pattern` | 以正則或關鍵字搜尋程式碼 |

### 專案設定（Config）

| Tool | 用途 |
|---|---|
| `serena:get_current_config` | 查詢目前 Serena 設定狀態 |
| `serena:switch_project` | 切換 Serena 追蹤的專案 |

---

## 📝 記憶寫入規範

使用 `serena:write_memory` 時，記憶條目應包含：
```
標題：[YYYY-MM-DD] 任務簡述
內容：
  - 完成項目（What was done）
  - 涉及的檔案路徑（Files affected）
  - 關鍵決策與理由（Key decisions）
  - 待追蹤事項（Follow-ups）
```

---

## 🚫 常見錯誤行為（禁止）
```
# ❌ 錯誤：直接讀取 .serena 檔案
read_file(".serena/memories/context.md")

# ✅ 正確：透過 Serena MCP
serena:read_memory("context")

# ❌ 錯誤：直接寫入 .serena 目錄
create_file(".serena/memories/new.md", content)

# ✅ 正確：透過 Serena MCP
serena:write_memory({ title: "new", content: "..." })
```

---

## 🔗 適用專案

此技能適用於所有使用 Serena MCP 的工作區，
尤其是 xuanwu-app 等多模組 Firebase × Next.js × Genkit 架構專案，
需要跨對話保持語意一致性與符號索引準確性。