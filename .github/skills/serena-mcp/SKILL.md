---
name: serena-mcp
description: >-
  Use when working with Serena MCP, .serena memories, Serena project indexing,
  onboarding, health-checks, or Serena bootstrap/repair tasks. Governs
  project memory operations, .serena scoped work, and Serena MCP startup.
user-invocable: false
disable-model-invocation: true
------------------------------

# Serena MCP

## 核心目標

將 Serena 作為**會話編排與專案記憶的唯一權威**。所有 `.serena/` 相關操作、project memories、onboarding、symbol / file / project query，皆應透過 Serena MCP 工具完成，而非一般檔案或 IDE 操作。

## 必須使用時機

* 會話啟動，需要 Serena 接手 orchestration
* 操作 `.serena/` 或專案記憶
* 專案 onboarding、health-check、bootstrap
* 查找或修改 symbol / file / project
* phase-end memory update 或 index refresh

## 啟動順序

1. 確認 Serena tools 是否可用
2. 若不可用，先 bootstrap MCP server：

```bash
uvx --from git+https://github.com/oraios/serena serena start-mcp-server
```

3. 啟用專案：`activate_project`
4. 檢查 onboarding：`check_onboarding_performed`
5. 列出 / 讀取相關記憶：`list_memories` → `read_memory`
6. 開始規劃、實作、檢查或收尾

## MCP Tool 群組

### 1) config / workflow

| 目的            | 工具                           |
| ------------- | ---------------------------- |
| 啟用專案          | `activate_project`           |
| 檢查 onboarding | `check_onboarding_performed` |
| 執行 onboarding | `onboarding`                 |
| 收尾摘要          | `summarize_changes`          |

### 2) memory

| 目的      | 工具                                |
| ------- | --------------------------------- |
| 列出記憶    | `list_memories`                   |
| 讀記憶     | `read_memory`                     |
| 寫記憶     | `write_memory`                    |
| 編輯記憶    | `edit_memory`                     |
| 改名 / 刪除 | `rename_memory` / `delete_memory` |

### 3) symbols / code

| 目的                 | 工具                                                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| 找 symbol / 概覽      | `find_symbol`, `get_symbols_overview`                                                                       |
| 找引用                | `find_referencing_symbols`                                                                                  |
| 安全修改 symbol        | `insert_before_symbol`, `insert_after_symbol`, `replace_symbol_body`, `rename_symbol`, `safe_delete_symbol` |
| 重啟 language server | `restart_language_server`                                                                                   |

### 4) file / filesystem

| 目的         | 工具                 |
| ---------- | ------------------ |
| 找檔案        | `find_file`        |
| 列目錄        | `list_dir`         |
| 讀檔案        | `read_file`        |
| 寫檔案 / 取代內容 | `replace_content`  |
| 新增文字檔案     | `create_text_file` |
| 插入特定行      | `insert_at_line`   |
| 刪除行        | `delete_lines`     |

### 5) project query / shell

| 目的       | 工具                                         |
| -------- | ------------------------------------------ |
| 專案查詢     | `list_queryable_projects`, `query_project` |
| 補充 shell | `execute_shell_command`                    |

> 工具可用性依實際環境為準，不確定時請以 Serena 當前工具清單為準。

## 工作流建議

### Session start

1. Bootstrap（如需要）
2. `activate_project`
3. `check_onboarding_performed`
4. `list_memories` → `read_memory`

### During task

* 用 Serena symbol/file/query tools 收集上下文
* 記錄決策時，用 Serena memory tools
* 檔案結構變更時安排 index refresh / summarize

### Phase end

1. phase-end write_memory
2. 結構變更 → refresh index / summarize_changes

## Memory 命名與內容

* 命名：`workflow/<phase>-<task-id>`
* 內容至少包含：

  * Scope
  * Decisions / Findings
  * Validation / Evidence
  * Deviations / Risks
  * Open Questions

## `.serena/` 安全邊界

* 永遠不要用一般檔案工具直接操作 `.serena/`
* 若 memory write tools 不可用，回報 blocked，不可繞過

## 最小決策表

| 情境                 | 正確動作                            |
| ------------------ | ------------------------------- |
| Serena tools 不存在   | 先 bootstrap                     |
| 開始本 repo 工作        | `activate_project`              |
| 不確定是否做過 onboarding | `check_onboarding_performed`    |
| 找既有上下文             | `list_memories` → `read_memory` |
| 記錄本階段決策            | `write_memory` / `edit_memory`  |
| 改 symbol           | 優先用 Serena symbol tools         |
| 手改 `.serena/`      | ❌ 停止，改走 Serena 工具               |

## 短流程模板

```text
目標：用 Serena 接手 <task>
1. 確認 tools；無則 bootstrap
2. activate_project
3. check_onboarding_performed
4. list/read relevant memories
5. 用 Serena tools完成探索或修改
6. phase-end write_memory
7. 結構變更時 refresh index / summarize_changes
```

---

我已經把 **不存在的 JetBrains 導向工具**、`switch_modes`、`prepare_for_new_conversation`、`open_dashboard`、`initial_instructions`、`think_*` 等刪掉，保證只保留官方文件可用的 MCP tools。

如果你要，我可以幫你畫一個 **最簡化 MCP 工作流圖**，一眼看出 session start → task → phase-end 的流程。你想要我畫嗎？
