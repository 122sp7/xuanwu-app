---
description: 'IDDD-based documentation governance rules: single source of truth per DDD concept, Diataxis classification, and anti-bloat constraints.'
applyTo: 'docs/**/*.md'
---

# 文件治理規範 (Documentation Governance)

遵循 Vaughn Vernon《Implementing Domain-Driven Design》的 **Published Language** 原則：每個 DDD 概念只有一個公開、版本化的真相來源。

> 權威知識入口：[`docs/subdomains.md`](../../docs/subdomains.md)、[`docs/bounded-contexts.md`](../../docs/bounded-contexts.md)、[`docs/ubiquitous-language.md`](../../docs/ubiquitous-language.md)
> bounded-context 詳細文件：`docs/contexts/<context>/*`
> `modules/<context>/docs/*` 若存在，只能視為 implementation-aligned detail，不得覆蓋 `docs/**/*` 的權威命名與邊界決策
> 文件框架來源：[`docs/README.md`](../../docs/README.md) (Diataxis)

## 核心規則（強制）

1. **唯一真相來源（Single Source of Truth）**：DDD 根地圖與戰略分類由 `docs/subdomains.md`、`docs/bounded-contexts.md` 與 `docs/ubiquitous-language.md` 擁有；各 bounded context 的詳細參考集由對應 `docs/contexts/<context>/*` 擁有。新增文件前必須先確認對應 owner 已存在同主題內容。
2. **禁止複製（No Duplication）**：嚴禁將 strategic maps 或 bounded-context detail 在多處複製。引用請使用 Markdown 相對連結。
3. **引用而非複製（Link, Don't Copy）**：
   ```markdown
   ✅ 正確：詳見 [bounded-contexts.md](../../docs/bounded-contexts.md)
   ❌ 錯誤：直接貼上 bounded-contexts.md 的內容
   ```
4. **Instructions 只含行為約束**：`.github/instructions/` 文件只描述 Copilot 的**行為規則**，不包含領域知識。知識連結到 `docs/subdomains.md`、`docs/bounded-contexts.md`、`docs/ubiquitous-language.md` 或 `docs/contexts/<context>/*` 詳細文件。
5. **術語查閱優先**：引入新術語前，先查 [`../../docs/ubiquitous-language.md`](../../docs/ubiquitous-language.md) 與對應 bounded context 的 `docs/contexts/<context>/ubiquitous-language.md`。

## 文件分類（Diataxis 四象限）

| 目錄 | 目的 | 寫作風格 |
|------|------|---------|
| `docs/tutorials/` | 學習導向，引導式操作 | 第二人稱，步驟化 |
| `docs/guides/how-to/` | 任務導向，解決特定問題 | 以目標開頭 |
| `docs/reference/` | 精確事實，API / 術語查詢 | 簡潔、可掃描 |
| `docs/guides/explanation/` | 概念導向，解釋「為什麼」 | 分析性散文 |
| `docs/subdomains.md` + `docs/bounded-contexts.md` | Xuanwu 的 DDD 戰略地圖與入口 | 戰略分類 + 模組地圖 |

## DDD 概念的文件定位

| 概念 | 唯一文件 | 其他地方的處理 |
|------|---------|--------------|
| 子域分類 | [`subdomains.md`](../../docs/subdomains.md) | 只能連結，不能複製 |
| 限界上下文 / 模組地圖 | [`bounded-contexts.md`](../../docs/bounded-contexts.md) | 只能連結，不能複製 |
| bounded context 概覽 | `docs/contexts/<context>/README.md` | 只能連結，不能複製 |
| 本地子域切分 | `docs/contexts/<context>/subdomains.md` | 只能連結，不能複製 |
| 本地邊界與責任 | `docs/contexts/<context>/bounded-contexts.md` | 只能連結，不能複製 |
| 通用語言 / 術語 | `docs/contexts/<context>/ubiquitous-language.md` | 只能連結，不能複製 |
| 上下文地圖 | `docs/contexts/<context>/context-map.md` | 只能連結，不能複製 |

## 防止文件膨脹的規則

- **新增前審查**：每個新 `docs/` 文件必須明確歸屬 Diataxis 的一個象限。
- **最大兩層深度**：`docs/<section>/<file>.md`，禁止更深的嵌套。
- **禁止跨象限混合**：一個文件只服務一個目的（tutorial / how-to / reference / explanation）。
- **實作細節不得覆蓋權威**：模組鄰近文件或程式碼註解可以描述 implementation detail，但不得推翻 `docs/**/*` 的 bounded-context 命名、所有權與 duplicate resolution。
- **Repomix 技能同步**：`.github/skills/` 的 repomix 輸出必須透過 `package.json` 既有 scripts 重新生成，保持與 `.github/*`、`docs/subdomains.md`、`docs/bounded-contexts.md`、`docs/ubiquitous-language.md` 和 `docs/contexts/<context>/*` 同步。

Tags: #use skill context7 #use skill xuanwu-app-skill
