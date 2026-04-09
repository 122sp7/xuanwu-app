---
name: serena-mcp
description: >-
  Use when working with Serena MCP, .serena memories, Serena project indexing,
  onboarding, health-checks, or Serena bootstrap/repair tasks. Governs
  project memory operations, .serena scoped work, and Serena MCP startup.
user-invocable: false
disable-model-invocation: true
---

# Serena MCP

## 目的

把 Serena 當成**會話編排與專案記憶的唯一權威**。凡是啟動 Serena、切換專案、讀寫 memory、檢查 onboarding、更新 index、查 symbol 或操作 `.serena/`，都應優先走 Serena MCP tools，而不是一般檔案工具。

## 何時必用

- 會話開始，需要 Serena 接手 orchestration
- 任何 `.serena/` 相關工作
- 讀取或寫入 project memories
- 需要 Serena onboarding / health-check / bootstrap
- 需要 Serena 的 symbol、file、project query 能力
- 需要 phase-end memory update 或 index refresh

## 啟動順序（固定）

1. **確認 Serena tools 是否可用**
2. 若不可用，先 bootstrap MCP server：

```bash
uvx --from git+https://github.com/oraios/serena serena start-mcp-server
```

3. 啟用專案：`activate_project`
4. 檢查 onboarding：`check_onboarding_performed`
5. 列出/讀取相關記憶：`list_memories` → `read_memory`
6. 再開始規劃、實作、檢查或收尾

## 對應 MCP Tool 群組

### 1) config / workflow

| 目的 | 工具 |
|---|---|
| 啟用專案 | `activate_project` |
| 看目前設定 | `get_current_config` |
| 切換模式 | `switch_modes` |
| 準備新對話 | `prepare_for_new_conversation` |
| 檢查 onboarding | `check_onboarding_performed` |
| 執行 onboarding | `onboarding` |
| 收尾摘要 | `summarize_changes` |

### 2) memory

| 目的 | 工具 |
|---|---|
| 列出記憶 | `list_memories` |
| 讀記憶 | `read_memory` |
| 寫新記憶 | `write_memory` |
| 編輯既有記憶 | `edit_memory` |
| 改名 / 刪除 | `rename_memory` / `delete_memory` |

### 3) symbols / files / query

| 目的 | 工具 |
|---|---|
| 找 symbol / 概覽 | `find_symbol`, `get_symbols_overview` |
| 找引用 | `find_referencing_symbols` |
| 安全修改 symbol | `insert_before_symbol`, `insert_after_symbol`, `replace_symbol_body`, `rename_symbol`, `safe_delete_symbol` |
| Serena file tools | `find_file`, `list_dir`, `read_file`, `replace_content`, `replace_lines`, `insert_at_line`, `delete_lines`, `create_text_file` |
| 專案查詢 | `list_queryable_projects`, `query_project` |
| 補充 shell | `execute_shell_command` |

> 實際暴露工具可能因環境而異；若名稱或可用性不確定，以 Serena 當前工具清單為準。

## 自洽工作流

### A. Session start

1. Bootstrap（如需要）
2. `activate_project`
3. `check_onboarding_performed`
4. `list_memories`
5. 只讀與本任務直接相關的 memories

### B. During task

- 用 Serena symbol/file/query tools 收集上下文
- 需要記錄決策時，用 Serena memory tools
- 若檔案新增、移動、刪除，記得安排 index refresh / summarize

### C. Phase end

每個有意義階段（plan / impl / review / qa）結束前：

1. 寫 phase-end memory
2. 若結構變更，更新 index / summarize changes
3. 再進入下一階段或交付

## Memory 命名與內容

- 記憶名稱維持一致格式：`workflow/<phase>-<task-id>`
- 內容至少包含：
  - Scope
  - Decisions / Findings
  - Validation / Evidence
  - Deviations / Risks
  - Open Questions

## `.serena/` 安全邊界

- **永遠不要**用一般檔案工具直接編輯 `.serena/`
- **永遠不要**用一般 rename/delete 操作 `.serena/`
- 若 Serena memory write tools 不可用，應回報 blocked，不可繞過
- `.serena/project.yml` 與專案記憶以 Serena activation / memory workflow 為準，不以手改檔案為準

## 最小決策表

| 情境 | 正確動作 |
|---|---|
| Serena tools 不存在 | 先 bootstrap |
| 需要開始本 repo 工作 | `activate_project` |
| 不確定是否做過 onboarding | `check_onboarding_performed` |
| 要找既有上下文 | `list_memories` → `read_memory` |
| 要記錄本階段決策 | `write_memory` / `edit_memory` |
| 要改 symbol | 優先用 Serena symbol tools |
| 只是想手改 `.serena/` | 停止，改走 Serena 工具 |

## 反模式

- ❌ 沒 activate project 就開始工作
- ❌ 用一般 file editor 直接改 `.serena/`
- ❌ 跳過 memories，重複探索已知上下文
- ❌ 結束階段卻不寫 memory
- ❌ 不確認工具名稱就假設 Serena tool 一定存在

## 短流程模板

```text
目標：用 Serena 接手 <task>
1. 確認 tools；無則 bootstrap
2. activate_project
3. check_onboarding_performed
4. list/read relevant memories
5. 用 Serena tools 完成探索或修改
6. phase-end write_memory
7. 結構變更時 refresh index / summarize_changes
```
