---
description: 'IDDD-based documentation governance rules: single source of truth per DDD concept, Diataxis classification, and anti-bloat constraints.'
applyTo: 'docs/**/*.md'
---

# 文件治理規範 (Documentation Governance)

遵循 Vaughn Vernon《Implementing Domain-Driven Design》的 **Published Language** 原則：每個 DDD 概念只有一個公開、版本化的真相來源。

> 權威知識入口：[`modules/subdomains.md`](../../modules/subdomains.md) 與 [`modules/bounded-contexts.md`](../../modules/bounded-contexts.md)
> bounded-context 詳細文件：`modules/<context>/*.md`
> 文件框架來源：[`docs/SOURCE-OF-TRUTH.md`](../../docs/SOURCE-OF-TRUTH.md) (Diataxis)

## 核心規則（強制）

1. **唯一真相來源（Single Source of Truth）**：DDD 根地圖與戰略分類由 `modules/subdomains.md` 與 `modules/bounded-contexts.md` 擁有；各 bounded context 的詳細參考集由對應 `modules/<context>/*.md` 擁有。新增文件前必須先確認對應 owner 已存在同主題內容。
2. **禁止複製（No Duplication）**：嚴禁將 strategic maps 或 bounded-context detail 在多處複製。引用請使用 Markdown 相對連結。
3. **引用而非複製（Link, Don't Copy）**：
   ```markdown
   ✅ 正確：詳見 [bounded-contexts.md](../../modules/bounded-contexts.md)
   ❌ 錯誤：直接貼上 bounded-contexts.md 的內容
   ```
4. **Instructions 只含行為約束**：`.github/instructions/` 文件只描述 Copilot 的**行為規則**，不包含領域知識。知識連結到 `modules/subdomains.md`、`modules/bounded-contexts.md` 或 `modules/<context>/*.md` 詳細文件。
5. **術語查閱優先**：引入新術語前，先查 [`../../.github/terminology-glossary.md`](../../.github/terminology-glossary.md) 與對應 bounded context 的 `modules/<context>/ubiquitous-language.md`。

## 文件分類（Diataxis 四象限）

| 目錄 | 目的 | 寫作風格 |
|------|------|---------|
| `docs/tutorials/` | 學習導向，引導式操作 | 第二人稱，步驟化 |
| `docs/guides/how-to/` | 任務導向，解決特定問題 | 以目標開頭 |
| `docs/reference/` | 精確事實，API / 術語查詢 | 簡潔、可掃描 |
| `docs/guides/explanation/` | 概念導向，解釋「為什麼」 | 分析性散文 |
| `modules/subdomains.md` + `modules/bounded-contexts.md` | Xuanwu 的 DDD 戰略地圖與入口 | 戰略分類 + 模組地圖 |

## DDD 概念的文件定位

| 概念 | 唯一文件 | 其他地方的處理 |
|------|---------|--------------|
| 子域分類 | [`subdomains.md`](../../modules/subdomains.md) | 只能連結，不能複製 |
| 限界上下文 / 模組地圖 | [`bounded-contexts.md`](../../modules/bounded-contexts.md) | 只能連結，不能複製 |
| 通用語言 / 術語 | `modules/<context>/ubiquitous-language.md` | 只能連結，不能複製 |
| 聚合根 / 實體 / VO | `modules/<context>/aggregates.md` | 只能連結，不能複製 |
| 領域事件 | `modules/<context>/domain-events.md` | 只能連結，不能複製 |
| 上下文地圖 | `modules/<context>/context-map.md` | 只能連結，不能複製 |
| 儲存庫模式 | `modules/<context>/repositories.md` | 只能連結，不能複製 |
| 使用案例 / Application Services | `modules/<context>/application-services.md` | 只能連結，不能複製 |
| Domain Services | `modules/<context>/domain-services.md` | 只能連結，不能複製 |

## 防止文件膨脹的規則

- **新增前審查**：每個新 `docs/` 文件必須明確歸屬 Diataxis 的一個象限。
- **最大兩層深度**：`docs/<section>/<file>.md`，禁止更深的嵌套。
- **禁止跨象限混合**：一個文件只服務一個目的（tutorial / how-to / reference / explanation）。
- **技術文件屬於模組**：模組特定的實作細節放在 `modules/<context>/README.md`，不放在全局 `docs/`。
- **Repomix 技能同步**：`.github/skills/` 的 repomix 輸出必須透過 `package.json` 既有 scripts 重新生成，保持與 `.github/*`、`modules/subdomains.md`、`modules/bounded-contexts.md` 和 `modules/<context>/*.md` 同步。

Tags: #use skill context7 #use skill xuanwu-app-skill
