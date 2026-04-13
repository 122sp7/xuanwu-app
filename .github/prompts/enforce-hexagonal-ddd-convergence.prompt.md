---
name: enforce-hexagonal-ddd-convergence
description: Execute repo-wide Hexagonal DDD convergence with root-cause fixes, anti-regression safeguards, and Serena synchronization.
agent: Hexagonal Convergence Enforcer
argument-hint: Provide full-repo scope confirmation, priority contexts (optional), and any temporary delivery constraints.
---

# Enforce Hexagonal DDD Convergence

## Mission

透過技能索引與架構規則，執行「全域違規定位 -> 根因分析 -> 鏈路級修復 -> 系統收斂」，讓系統更一致、更簡單，並符合 Hexagonal Architecture with Domain-Driven Design。

強制目標：
- 完全符合 `AGENTS.md`
- 不修 symptom，只修 root cause
- 不允許跨層偷依賴、隱性耦合、workaround、domain bypass
- 每次變更都必須降低系統複雜度

## Inputs

- `scope`: 預設 `full-repo`，禁止只掃局部
- `priority_contexts` (optional): 需優先收斂的 bounded contexts
- `delivery_constraints` (optional): 交付限制（時間、風險、鎖定檔案）

若 `scope` 未明確提供，視為 `full-repo`。

## Workflow

### 0) Skill Bootstrap

```text
Skill declarations are centralized in:
- .github/agents/hexagonal-convergence-enforcer.agent.md

#use skill serena-mcp
- if not started: serena start-mcp-server
- activate_project
- list_memories
- read_memory
```

若出現 `Skill not found: serena-mcp`：
- 先檢查 `.github/skills/serena-mcp/SKILL.md` frontmatter 是否有效。
- 改以 Serena MCP 工具流程執行 `activate_project`、`list_memories`、`read_memory`，不要把它們當成一般聊天語句。

### 0.5) Context7 Certainty Gate

- 對任何 library/framework API、版本行為、設定 schema 的把握度低於 `99.99%`，一律先查 `context7` 文件。
- 流程固定：`resolve-library-id` -> `get-library-docs`（資訊不足時翻頁）。
- 未查證前不可依靠猜測或舊記憶下結論。

### 0.8) Repomix Explorer Bootstrap

- 優先使用 `.github/skills/xuanwu-app-skill/references/` 作為分析來源。
- 若來源缺失或過期，先執行 `npm run repomix:skill` 進行刷新。
- 分析順序固定：`summary.md` -> `project-structure.md` -> `files.md`。
- 採 search-first：先搜尋 pattern，再讀完整檔案。

### 1) Global Scan

- 使用 `xuanwu-app-skill`（或 fresh-generated repomix skill）建立全域違規索引
- 掃描範圍必須覆蓋整個 repo

輸出 `violation_list`：
- `file_path`
- `violation_type`
- `severity` (`low|medium|high|critical`)

### 1.2) Mandatory Semantic Audit

- 若第一階段結論為 `violations_before=0` 與 `smells_before=0`，不可直接結束。
- 必須執行語意審計第二階段，最少覆蓋：`platform`、`workspace`、`notion`、`notebooklm`。
- 每個主域至少一條鏈路抽查：`domain -> application -> infrastructure -> interfaces`。
- 每個主域至少一個 `api/` 邊界與一個跨模組依賴點檢查。
- 若工具不足，必須走 fallback（read/search/grep）完成等價證據。

### 1.5) Smell Detection

在 violation index 之外，必須同時建立 `smell_list`：
- `smell_type`
- `file_path`
- `impact_surface`（受影響 bounded context / subdomain / route）
- `cognitive_tax`（`low|medium|high`）

必查怪味道：
- `god_object_or_service`
- `anemic_domain_model`
- `layer_skipping`
- `boundary_leak`
- `shotgun_surgery`
- `duplicate_or_parallel_use_case`
- `dead_abstraction`
- `implicit_coupling`

優先順序公式（由高到低修復）：
- `priority_score = severity + blast_radius + cognitive_tax`

### 2) Classification

每個 `violation` 必須歸類為：
- `architecture_violation`
- `layer_violation`
- `dependency_inversion_error`
- `boundary_leak`
- `convention_missing`

### 3) Root Cause Analysis

禁止只停在表層錯誤。每個 `violation` 必須定位根因：
- `design_flaw`
- `boundary_misplacement`
- `abstraction_leak`
- `responsibility_misalignment`

### 4) End-to-End Fix

修復必須覆蓋完整鏈路：
- `Domain -> Application -> Ports -> Infrastructure -> Interface`

強制規則：
- 禁止局部 patch
- 禁止 workaround
- 禁止 bypass domain
- 禁止 domain 直接依賴外部 SDK（必須走 ports）

### 5) Occam Convergence

每次修復後必須執行：
- 移除冗餘 abstraction
- 合併重複 use-case/service
- 減少不必要檔案
- 降低層級深度
- 降低認知切換點（跨層跳轉、跨目錄追蹤、命名歧義）

量化驗證：
- 檔案數量 `下降或持平`（不可無意義增加）
- 呼叫鏈長度 `下降`
- 認知負擔 `下降`

認知負擔指標（至少回報三項）：
- `hotspot_file_count`（高風險檔案數）
- `avg_dependency_fan_out`（平均外部依賴扇出）
- `cross_layer_hop_count`（主要流程跨層跳數）
- `naming_collision_count`（語意衝突命名數）

### 6) Prevention

補齊防再發機制：
- type constraints
- ESLint/custom rules
- codegen/template（避免重複製造同型錯誤）
- 針對關鍵邊界的測試

### 7) Post-Process

1. Repomix 收斂
   - 執行 `npm run repomix:skill`
   - 確保結構壓平、無多餘依賴、模組邊界清晰
2. Serena 同步
   - 更新 Serena memory
   - 更新 Serena index（LSP/symbol）

## Output Contract

每個修復項目都必須輸出：
- `problem`
- `smell_type`
- `root_cause`
- `fix_strategy`
- `affected_scope`
- `tech_debt_removed` (`Yes|No` + reason)

另外輸出全域摘要：
- `total_violations_before`
- `total_violations_after`
- `new_violations`
- `total_smells_before`
- `total_smells_after`
- `repomix_source_used`（`xuanwu-app-skill|fresh-generated`）
- `complexity_delta`（files / call-chain / cognitive-load）

必填覆蓋證據：
- `scan_coverage_report`
   - `domain`
   - `subdomain`
   - `sampled_chain`
   - `api_boundary_checked`
   - `evidence_file`

必填審計狀態：
- `semantic_audit_status`（`completed|blocked`）

並列出收斂證據：
- `removed_abstractions`
- `merged_workflows`
- `deleted_or_consolidated_files`

## Validation

僅在同時滿足下列條件時可標記完成：
- 所有 violations 已消除
- 無新增 violations
- 架構更簡潔且可量化
- 無技術債殘留
- Serena memory/index 已同步

若任一條件無法滿足，必須回報：
- `blocked_by`
- `remaining_risks`
- `next_reduction_step`

禁止使用「若你要我可以再掃」作為結案語句；必須直接完成或明確 blocked。

Tags: #use agent hexagonal-convergence-enforcer