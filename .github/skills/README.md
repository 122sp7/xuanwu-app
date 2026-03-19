# Skills README

本文件整理 OpenAI Codex Skills 的標準格式、注意事項與實作規範，並補上 Xuanwu 專案目前在 .github/skills 下的落地約定。

## 1. 定位

Skill 是一個可重用的能力封裝，用來把特定任務的說明、參考資料、必要腳本與選配中繼資料收斂在同一個資料夾中，讓代理在符合條件時可以載入並執行一致的工作流程。

依據 OpenAI Codex Skills 文件，Skill 的核心目標是：

- 封裝單一任務或單一領域能力
- 降低重複提示詞成本
- 讓代理以明確 description 決定是否觸發
- 透過 progressive disclosure 只在需要時載入完整內容

## 2. 官方標準結構

Codex 官方概念上的標準 Skill 結構如下：

```text
my-skill/
	SKILL.md                # 必填
	scripts/                # 選填，可執行腳本
	references/             # 選填，補充文件或索引
	assets/                 # 選填，範本、圖片、靜態資源
	agents/
		openai.yaml           # 選填，UI metadata / policy / tool dependencies
```

最少只需要一個資料夾與一個 SKILL.md。

## 3. 必填檔案：SKILL.md

SKILL.md 必須包含 YAML frontmatter，且至少要有下列兩個欄位：

```md
---
name: skill-name
description: Explain exactly when this skill should and should not trigger.
---

Skill instructions for Codex to follow.
```

### 必填欄位規範

- name
	- 建議使用 kebab-case
	- 必須穩定、可辨識、避免過度泛化
	- 最好與資料夾名稱一致
- description
	- 必須清楚說明「何時該用」與「何時不該用」
	- 要寫出觸發邊界，不要只寫空泛用途
	- 因為隱式觸發依賴 description，比 name 更影響實際可用性

### 內容撰寫規範

- 用命令式語氣寫步驟
- 明確寫出輸入、輸出與完成條件
- 優先描述流程與判斷條件，不要先塞大量背景敘述
- 只保留完成該任務所需的最小必要規則

## 4. 建議的 SKILL.md 章節

官方文件沒有硬性要求章節名稱，但實務上建議至少包含下列區塊：

```md
---
name: example-skill
description: Use this skill when ... Do not use it when ...
---

# Skill Name

## Purpose
- 說明這個 skill 的單一責任

## Use When
- 什麼情境應觸發

## Do Not Use When
- 哪些情境不應觸發

## Inputs
- 需要哪些前置資訊

## Workflow
1. 執行步驟 1
2. 執行步驟 2
3. 執行步驟 3

## Outputs
- 預期產出內容

## Constraints
- 安全性、相依工具、不可違反的限制
```

## 5. 選配目錄與用途

### scripts/

只在下列情況才加入：

- 需要可重複、可預測的自動化步驟
- 單靠自然語言說明不夠穩定
- 需要執行外部工具或固定流程

不建議為了「看起來完整」而加入 scripts。官方建議預設優先 instruction-only skill，除非真的需要 deterministic behavior 或外部 tooling。

### references/

適合放：

- 領域知識摘要
- 專案結構索引
- 長文件拆解後的輔助資料
- 不適合直接塞進 SKILL.md 的大量參考資訊

references 應該是輔助讀物，不應取代 SKILL.md 內的主流程。

### assets/

適合放：

- 範本
- 範例輸出
- 靜態附檔

若資產不會被 skill 實際引用，就不要加入。

### agents/openai.yaml

這是選配的 metadata 檔，用來提供：

- UI 顯示名稱與說明
- 圖示與品牌色
- 預設提示文字
- 是否允許 implicit invocation
- 依賴的工具宣告

官方範例如下：

```yaml
interface:
	display_name: "Optional user-facing name"
	short_description: "Optional user-facing description"
	icon_small: "./assets/small-logo.svg"
	icon_large: "./assets/large-logo.png"
	brand_color: "#3B82F6"
	default_prompt: "Optional surrounding prompt to use the skill with"

policy:
	allow_implicit_invocation: false

dependencies:
	tools:
		- type: "mcp"
			value: "openaiDeveloperDocs"
			description: "OpenAI Docs MCP server"
			transport: "streamable_http"
			url: "https://developers.openai.com/mcp"
```

### openai.yaml 使用注意事項

- allow_implicit_invocation 預設為 true
- 若 skill 只應在明確點名時使用，可設為 false
- tool dependencies 只能宣告真實存在、可取得、且這個 skill 確實需要的工具
- 不要為了未來可能會用而預先宣告不存在的工具

## 6. 觸發與匹配規則

Codex 會用兩種方式啟用 skill：

1. 顯式啟用：使用者明確指定 skill
2. 隱式啟用：系統根據 description 判斷任務與 skill 是否匹配

因此 description 的品質直接影響：

- skill 是否會被正確挑中
- skill 是否會誤觸發
- 多個 skill 之間是否互相重疊

### description 撰寫原則

- 寫明使用情境
- 寫明排除情境
- 避免「處理所有 X 問題」這種過寬描述
- 避免與其他 skill 的責任邊界重疊

不佳示例：

```md
description: Help with frontend work.
```

較佳示例：

```md
description: Use this skill for App Router shell layout work in Xuanwu, including route shell consistency, shared navigation patterns, and shadcn-based shell UI updates. Do not use it for generic React component fixes outside the app shell.
```

## 7. 官方最佳實踐

根據 OpenAI Codex Skills 文件，建議遵循以下原則：

- 每個 skill 只做一件事
- 除非真的需要腳本，否則優先用純指令型 skill
- 步驟要明確、具體、可執行
- 要寫出清楚的 inputs 與 outputs
- 用真實 prompt 測試 description 是否能正確觸發 skill

## 8. 常見錯誤

- skill 責任過大，導致 description 太泛
- name 與資料夾名稱不一致，造成管理混亂
- 把背景文件全部塞進 SKILL.md，導致主流程不清楚
- 加了 scripts，但實際沒有穩定可執行價值
- 宣告不存在的工具依賴
- 寫了 references，但主文件沒有說何時要讀它
- 沒有寫 Do Not Use When，導致 skill 容易誤觸發

## 9. Xuanwu 專案落地規範

雖然 OpenAI Codex 官方文件常以 .agents/skills 作為 skill 掃描位置，但本專案目前的 GitHub Copilot / VS Code customization 結構以 .github/skills 為準。

在 Xuanwu 中新增或維護 skill 時，請遵循以下規範：

- 路徑使用 .github/skills/<skill-name>/SKILL.md
- skill-name 使用 kebab-case
- SKILL.md 的 name 應與資料夾名稱一致
- 優先更新既有 skill，不要建立近似重複的 skill
- 若有 references，內容應與實際 repo 狀態同步
- 若有 openai.yaml，只能描述本 repo 真正可用的工具與流程
- 不要把尚未啟用或僅假設存在的自動化寫成既成事實

## 10. 建議範本

```md
---
name: my-skill
description: Use this skill when you need to perform one clearly defined task. Do not use it for broader repository-wide work outside this scope.
---

# My Skill

## Purpose
- Define the exact job of this skill.

## Use When
- Trigger condition 1
- Trigger condition 2

## Do Not Use When
- Exclusion 1
- Exclusion 2

## Required Inputs
- Input 1
- Input 2

## Workflow
1. Inspect the required context.
2. Apply the defined transformation or analysis.
3. Validate the result.

## Expected Output
- Deliverable 1
- Deliverable 2

## Constraints
- Constraint 1
- Constraint 2
```

## 11. 維護檢查清單

每次新增或修改 skill 前後，至少檢查以下項目：

- SKILL.md 是否包含合法 frontmatter
- name 與資料夾名稱是否一致
- description 是否同時寫出 use / do not use 邊界
- 主流程是否為單一責任
- references、scripts、assets 是否真的被需要
- 文件是否描述真實存在的工具與 repo 流程
- README、相關索引與引用是否需要同步更新

## 12. 參考來源

- OpenAI Codex Skills: https://developers.openai.com/codex/skills
- Open agent skills standard: https://agentskills.io/
- OpenAI skills examples: https://github.com/openai/skills
