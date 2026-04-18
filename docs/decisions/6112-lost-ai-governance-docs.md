# 6112 Migration Gap — ai `subdomains.instructions.md` 治理文件


> ⚠️ **本文件為「僅記錄」文件 — 不執行實施**
> 此 ADR 的唯一目的是記錄遷移缺口，作為未來蒸餾工作的基線參考。
> **任何 agent 或開發者不得依據本文件直接新增、修改或刪除任何程式碼。**

- Status: ⛔ 僅記錄 — 不實施（Record Only — Do Not Implement）
- Date: 2026-04-17
- Category: Migration Gap > ai

## Context

`xuanwu-app-skill` 快照的 `modules/ai/subdomains/subdomains.instructions.md` 是一份 **313 lines** 的 AI 子域治理規格文件，詳細定義了每個子域的邊界、職責、禁止事項，以及各子域之間的依賴方向。

此文件**已在遷移過程中刪除，無任何替代**。

### 文件所包含的關鍵治理規格

#### 1. 子域邊界定義（15 個子域）

每個子域有：
- `Owner`（誰擁有）
- `Consumers`（誰可使用）
- `Forbidden`（明確禁止的呼叫方向）
- `Key invariants`（核心不變條件）

範例（conversations 子域）：
```
Owner:     ai/conversations
Consumers: notebooklm/synthesis, workspace/orchestration
Forbidden: notion, billing, iam 直接呼叫 conversations domain
Key invariant: ConversationSession 不持有 LLM 結果原始文本，只持有引用
```

#### 2. 跨子域依賴方向圖

```
model-observability ← 所有子域（接收 trace）
safety-guardrail    ← conversations, synthesis, generation（過濾輸出）
prompt-pipeline     → conversations, synthesis（提供 template）
personas            → conversations（提供角色定義）
datasets            → evaluation（提供評估資料）
```

#### 3. 各子域實作優先順序

文件定義了三個交付波次：
- **Wave 1**（MVP）：generation、retrieval、safety-guardrail
- **Wave 2**（Beta）：conversations、prompt-pipeline、model-observability
- **Wave 3**（GA）：datasets、evaluation、personas、tokens

#### 4. 與 platform.ai 的邊界規則

- ai 子域絕不自行持有 Firebase SDK（delegating to platform.ai adapter）
- ai 子域絕不直接呼叫 Genkit `defineFlow`（透過 port 抽象）
- 所有 AI 輸出必須先通過 safety-guardrail 才能離開 ai boundary

#### 5. 反模式清單（11 條）

文件列出了 ai 子域特有的 11 個反模式，補充了 `.github/instructions/genkit-flow.instructions.md` 未涵蓋的 ai 子域語意層面的錯誤。

### 現狀

`src/modules/ai/` 沒有任何對應的 `subdomains.instructions.md` 或 `AGENT.md` 說明子域治理規格。

## Decision

**不實施**。僅記錄缺口。

此文件應作為 `src/modules/ai/subdomains/AGENT.md` 或 `docs/structure/contexts/ai/subdomains.md` 的重建基礎。

## Consequences

- ai 子域的治理規格只能依賴 `.github/instructions/genkit-flow.instructions.md`，但後者不涵蓋子域間的邊界與交付順序。
- 開發者在新建 ai 子域時缺乏明確的邊界定義，易引入越界設計。

## 關聯 ADR

- **6111** ai 5 個缺失子域：`subdomains.instructions.md` 包含這 5 個子域的邊界規格。
- **6110** ai prompt-pipeline 子域：文件定義了 prompt-pipeline 在 Wave 2 交付。
