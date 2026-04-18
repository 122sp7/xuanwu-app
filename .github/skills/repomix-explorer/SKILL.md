---
name: repomix-explorer
description: "Use this skill when the user wants to analyze or explore a codebase using Repomix, or when asking how to generate / refresh Xuanwu skill files. Triggers on: 'generate skill', 'refresh skill', 'analyze codebase', 'explore repo', 'how many tokens', 'repomix'."
---

# Repomix Explorer

## 用途

- 為 Xuanwu 各模組產生或更新 skill 參考檔
- 分析本地目錄或遠端 repo 的結構與內容
- 搜尋特定程式碼模式、統計 token 量

---

## Xuanwu Skill 產生指令

每個 npm script 對應一個模組區段，執行後自動寫入 `.github/skills/<name>/`。

| Script | 涵蓋範圍 | 輸出路徑 |
|---|---|---|
| `npm run repomix:skill` | 整個 repo（全量） | `.github/skills/xuanwu-skill/` |
| `npm run repomix:ai` | `src/modules/ai/` | `.github/skills/xuanwu-ai-skill/` |
| `npm run repomix:analytics` | `src/modules/analytics/` | `.github/skills/xuanwu-analytics-skill/` |
| `npm run repomix:billing` | `src/modules/billing/` | `.github/skills/xuanwu-billing-skill/` |
| `npm run repomix:iam` | `src/modules/iam/` | `.github/skills/xuanwu-iam-skill/` |
| `npm run repomix:platform` | `src/modules/platform/` | `.github/skills/xuanwu-platform-skill/` |
| `npm run repomix:notebooklm` | `src/modules/notebooklm/` | `.github/skills/xuanwu-notebooklm-skill/` |
| `npm run repomix:notion` | `src/modules/notion/` | `.github/skills/xuanwu-notion-skill/` |
| `npm run repomix:workspace` | `src/modules/workspace/` | `.github/skills/xuanwu-workspace-skill/` |
| `npm run repomix:src` | `src/` 全層（含 app） | `.github/skills/xuanwu-src-skill/` |
| `npm run repomix:packages` | `packages/` | `.github/skills/xuanwu-pkgs-skill/` |
| `npm run repomix:py_fn` | `py_fn/` | `.github/skills/xuanwu-fn-skill/` |
| `npm run repomix:markdown` | 所有 `.md` 文件 | `.github/skills/xuanwu-markdown-skill/` |

### 產生流程

```bash
# 更新單一模組 skill
npm run repomix:workspace

# 更新全量 skill（耗時較長）
npm run repomix:skill
```

---

## 使用已產生的 Skill

產生完成後，Copilot 可透過 skill 參考檔回答程式碼問題，無需重新搜尋。

### Skill 結構

```
.github/skills/<name>/
  SKILL.md                  ← 技能描述（Copilot 載入入口）
  references/
    summary.md              ← 統計摘要（檔案數、行數、token 數）
    project-structure.md    ← 目錄樹（含每檔行數）
    files.md                ← 所有檔案內容（可 grep）
```

### 搜尋方式

```
# 找檔案位置
## File: src/modules/workspace/...

# 找函式或型別
resolveWorkspaceTabValue

# 找 import 關係
from "@/modules/workspace"
```

---

## 臨時分析（不更新 skill）

```bash
# 探索整個 repo（輸出到本地 xml）
npm run repomix:explore

# 分析遠端 repo
npx repomix --remote <owner/repo> --output /tmp/analysis.xml

# 只看特定路徑
npx repomix src/modules/notion --compress
```

`--compress` 可減少約 70% token，適合大型模組。

---

## 何時重新產生 Skill

- 新增或刪除檔案後
- 重大重構導致 module API 改變
- Copilot 給出與現況不符的建議時