# Skills README

本文件整理 **VS Code / GitHub Copilot Agent Skills** 的目前實作規範，並補上 Xuanwu 在 `.github/skills` 下的落地約定。

## 1. 定位

Skill 是一個可重用的能力封裝，用來把：

- 單一任務或單一領域能力
- 需要長期維護的參考資料
- 可選的模板、腳本、資產

收斂在同一個資料夾中，讓 Copilot 在任務相關時自動載入，或在需要時被明確指定。

在 Xuanwu 中，Skill 的主要用途是：

- 提供穩定的專案知識包，例如 `xuanwu-skill`
- 提供外部參考知識包，例如 `vscode-docs-skill`
- 提供可重複使用的專案工作流，例如 `billing-lifecycle`、`rag-pipeline`

## 2. 標準路徑與最小結構

本專案使用 VS Code / GitHub Copilot 慣例：

```text
.github/skills/<skill-name>/
├── SKILL.md
├── references/   # optional
├── templates/    # optional
├── scripts/      # optional
└── assets/       # optional
```

最少只需要一個資料夾與一個 `SKILL.md`。

## 3. SKILL.md frontmatter

每個 skill 至少要有：

```md
---
name: my-skill
description: Use this skill when ... Do not use it when ...
license: Complete terms in LICENSE.txt
---
```

### 欄位規範

- `name`
  - 使用 kebab-case
  - 必須與資料夾名稱一致
  - 需穩定、可辨識、不要太泛
- `description`
  - 要同時說明 **做什麼**、**何時使用**、**何時不要使用**
  - 這是 skill 自動匹配的主要依據
- `license`
  - 建議補上
  - 若沒有正式 license 檔，可暫時省略，但新增 skill 時應優先補齊

### 可選欄位

- `user-invocable: false`
  - 隱藏於 `/` 選單，但仍可被模型在相關任務中自動載入
- `disable-model-invocation: true`
  - 禁止模型根據相關性自動載入或作為一般子技能自動挑選
  - 若仍需保留人工入口，請不要同時把 `user-invocable` 設為 `false`

## 4. 建議章節

雖然沒有硬性章節名稱，但建議 `SKILL.md` 至少包含：

- `# Title`
- `## When to Use This Skill`
- `## Do Not Use This Skill When`
- `## Prerequisites`
- `## Workflow`
- `## Outputs`
- `## Constraints`
- `## References`

## 5. references / templates / scripts / assets

### references/

適合放：

- 專案結構索引
- 大型參考文件
- 長流程拆分文件
- 不適合直接塞進 `SKILL.md` 的知識摘要

例如 `xuanwu-skill` 與 `vscode-docs-skill` 使用 `references/` 放置 repomix 產物。

### templates/

適合放：

- 會被代理修改或填入內容的模板
- 可作為新功能起點的腳手架

### scripts/

只在下列情況才加入：

- 需要 deterministic behavior
- 同一段操作會被多次重複執行
- 單靠自然語言描述不夠穩定

### assets/

適合放不需要修改、只會直接被引用的靜態檔案。

## 6. 觸發規則

Skill 可能透過兩種方式被使用：

1. **自動匹配**：模型根據 `description` 判斷是否需要
2. **顯式指定**：例如在 repo workflow 中寫出 `Use skill: xuanwu-skill`

因此 `description` 必須：

- 清楚寫出適用情境
- 清楚寫出排除情境
- 避免與其他 skill 職責重疊

## 7. Xuanwu 專案約定

在 Xuanwu 新增或維護 skill 時，請遵循以下規則：

- 路徑固定為 `.github/skills/<skill-name>/SKILL.md`
- `name` 必須與資料夾名稱一致
- 優先更新既有 skill，不要建立近似重複 skill
- 若有 `references/`，內容必須反映目前 repo 狀態
- 若 workflow 依賴 skill，請同步更新：
  - `.github/README.md`
  - 相關 agent / prompt
  - 必要時更新 `.github/instructions/skill-usage.instructions.md`

## 8. 建議範本

```md
---
name: my-skill
description: Use this skill when you need one clearly defined capability. Do not use it for broader repository work outside this scope.
license: Complete terms in LICENSE.txt
---

# My Skill

## When to Use This Skill
- Trigger condition 1
- Trigger condition 2

## Do Not Use This Skill When
- Exclusion 1
- Exclusion 2

## Prerequisites
- Input 1
- Input 2

## Workflow
1. Inspect the required context.
2. Apply the defined transformation or analysis.
3. Validate the result.

## Outputs
- Deliverable 1
- Deliverable 2

## Constraints
- Constraint 1
- Constraint 2
```

## 9. 維護檢查清單

每次新增或修改 skill 前後，至少檢查：

- `SKILL.md` 是否有合法 frontmatter
- `name` 與資料夾名稱是否一致
- `description` 是否寫出 use / do-not-use 邊界
- skill 是否維持單一責任
- `references/`、`templates/`、`scripts/`、`assets/` 是否真的需要
- skill 是否描述真實存在的 repo 工具與流程
- `.github/README.md` 與相關 agents / prompts 是否需要同步更新

## 10. 參考來源

- VS Code Agent Skills Documentation: https://code.visualstudio.com/docs/copilot/customization/agent-skills
- Agent Skills Specification: https://agentskills.io/
- Awesome Copilot Skills: https://github.com/github/awesome-copilot/blob/main/docs/README.skills.md
