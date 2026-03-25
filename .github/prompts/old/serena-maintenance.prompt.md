---
name: serena-maintenance
description: 依 Serena 官方工具集進行彈性維護，含記憶清理、索引替代重建與結果彙整
agent: agent
tools:
  - serena/*
argument-hint: 輸入專案路徑與維護目標，例如 projectPath=./, goals=trim-memory,rebuild-index
---

# Serena Maintenance

## Mission
依 Serena 官方工具集執行維護，並「彈性使用」工具完成以下目標：
1. 啟動專案與環境檢查
2. onboarding 與記憶盤點
3. 記憶精簡與舊條目清理
4. 索引維護（若無專用索引工具則採替代重建）
5. 變更彙整與回報

## Inputs
- projectPath: ${input:projectPath:請輸入專案路徑，預設為目前 workspace}
- goals: ${input:goals:trim-memory,remove-stale,rebuild-index}
- memoryScope: ${input:memoryScope:user,repo,session}
- officialDocUrl: ${input:officialDocUrl:https://oraios.github.io/serena}

## Rules
- 必須先讀 Serena 官方手冊（`officialDocUrl`）與對應工具說明。
- 只能使用可用的 Serena MCP 工具，不要虛構不存在的指令。
- 若使用者要求的操作無對應工具，必須明確標示「不可直接執行」，並給可行替代。
- 任何刪除動作先列出目標，再執行。
- 不要輸出敏感資訊。

## Tool Catalog
請優先使用以下工具，依任務彈性組合：

- `activate_project`：啟動專案
- `check_onboarding_performed`：檢查 onboarding 是否完成
- `create_text_file`：建立或覆寫檔案
- `delete_lines`：刪除行
- `delete_memory`：刪除 memory
- `execute_shell_command`：執行 shell 指令
- `find_referencing_code_snippets`：尋找指定符號的程式碼片段
- `find_referencing_symbols`：尋找符號引用
- `list_memories`：列出 memory
- `onboarding`：執行 onboarding
- `prepare_for_new_conversation`：為新的對話準備
- `read_file`：讀取檔案內容
- `read_memory`：讀取已儲存 memory
- `replace_lines`：替換行
- `replace_symbol_body`：替換整個符號定義
- `restart_language_server`：重啟語言伺服器
- `search_for_pattern`：搜尋模式
- `summarize_changes`：彙總修改
- `switch_modes`：切換模式
- `think_about_*`：三種輔助思考工具
- `write_memory`：寫入 memory（手動儲存上下文）

## Workflow
1. 官方手冊核對
- 讀取 `officialDocUrl`，確認工具名稱、參數與限制。

2. 啟動與前置檢查
- 使用 `activate_project` 啟用 `projectPath`。
- 使用 `check_onboarding_performed` 檢查 onboarding 狀態。
- 若未完成，使用 `onboarding` 補齊。

3. 盤點記憶
- 使用 `list_memories` 取得清單。
- 以 `read_memory` 讀取候選記憶，判斷重複、過期、矛盾。

4. 精簡與清理
- 使用 `write_memory` 合併與覆寫高品質版本。
- 使用 `delete_memory` 移除已確認 stale 條目。
- 必要時搭配檔案工具（`read_file` / `replace_lines` / `delete_lines` / `create_text_file`）整理維護紀錄。

5. 索引維護（彈性模式）
- 若環境提供專用索引工具：執行 prune / compact / rebuild。
- 若無原生索引工具：
  - 再次執行 `activate_project`（重建上下文）
  - 使用 `list_memories` + `read_memory` + `delete_memory` 清掉 stale entries
  - 使用 `write_memory` 寫回整併後摘要作為重建替代
  - 在報告中明確標註限制與替代流程

6. 驗證
- 再次執行 `list_memories`，確認最終狀態。
- 視需要執行 `summarize_changes` 產出維護摘要。
- 必要時使用 `restart_language_server` 或 `switch_modes` 提升穩定性。

## Output Format
請用以下格式輸出：

### Serena 維護結果
- project: <name>
- goals: <resolved goals>
- status: <success | partial | blocked>

### 官方手冊核對
- source: <url>
- checked_items:
  - <item>
  - <item>

### 已執行
- <動作 1>
- <動作 2>

### 已清理條目
- <memory name / index key>

### 使用工具
- <tool 1>
- <tool 2>

### 無法直接執行與替代方案
- request: <使用者原始要求>
- reason: <工具不可用或能力限制>
- fallback: <已採用替代流程>

### 建議下一步
1. <next step>
2. <next step>

## Notes
- 本 prompt 用於可重複的 Serena 維護任務。
- 針對「clean embeddings / compact vector index」等要求，先檢查工具可用性再執行。
- 需要語義查核時，可搭配 `search_for_pattern`、`find_referencing_symbols`、`find_referencing_code_snippets` 做精準確認。
