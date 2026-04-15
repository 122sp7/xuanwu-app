# src/modules — 精簡蒸餾骨架層

> **⚠ 衝突防護聲明**：本層（`src/modules/<context>/`）與 `modules/<context>/`（完整 Hexagonal DDD 實作層）是**兩個獨立的實作層，不可互換、不可混用**。
>
> - `modules/<context>/` → 讀取邊界規則、published language、context map；不在此新增實作程式碼。
> - `src/modules/<context>/` → 撰寫新 use case、adapter、entity；以 `template` 骨架為起點。

---

## 🔨 蒸餾作業進行中（2026-04-15）

本層正在進行從 `modules/` 到 `src/modules/` 的蒸餾作業。**在蒸餾作業完成前，請遵守以下路由規則，避免衝突混淆：**

| 需要 | 去哪裡 |
|---|---|
| 讀取邊界規則 / published language | `modules/<context>/AGENT.md`、`modules/<context>/api/` |
| 撰寫新 use case / entity / adapter | `src/modules/<context>/`（以 `src/modules/template` 為骨架）|
| 了解蒸餾進度（跳過哪些）| `src/modules/<context>/README.md` |
| 跨模組 API boundary | `modules/<context>/api/index.ts`（仍是權威）|
| 新模組起點 | 複製 `src/modules/template/`（見下方指引）|

---

## 模組清單、蒸餾狀態與子域對照

| 模組 | 蒸餾來源（`modules/`）| 狀態 | 子域清單 |
|---|---|---|---|
| `template/` | 無（原創骨架）| ✅ 完整骨架，可複製 | document、generation、ingestion、workflow |
| `iam/` | `modules/iam/` + platform/account + platform/org | 🔨 進行中 | account、access-control、authentication、authorization、federation、identity、organization、security-policy、session、tenant |
| `platform/` | `modules/platform/`（notification 等剩餘服務）| 🔨 進行中 | background-job、notification、platform-config、search（account / org 已移至 iam）|
| `workspace/` | `modules/workspace/` | 🔨 進行中 | approve、audit、feed、issue、lifecycle、membership、orchestration、quality、scheduling、settlement、sharing、task、task-formation |
| `notion/` | `modules/notion/` | 📋 待蒸餾 | authoring、collaboration、knowledge、knowledge-database、relations、taxonomy |
| `notebooklm/` | `modules/notebooklm/` | 📋 待蒸餾 | conversation、notebook、source、synthesis |
| `ai/` | `modules/ai/` | 📋 待蒸餾 | conversations、datasets、embeddings、evaluation-policy、memory-context、messages、model-observability、models、personas、prompt-pipeline、prompts、safety-guardrail、tokens、tools |
| `analytics/` | `modules/analytics/` | 📋 待蒸餾 | event-contracts、event-ingestion、event-projection、insights、metrics、realtime-insights |
| `billing/` | `modules/billing/` | 📋 待蒸餾 | entitlement、subscription |

---

## 路由決策規則

```
需要：                                  去哪裡
────────────────────────────────────────────────────────────────
讀取邊界規則 / published language       modules/<context>/AGENT.md
                                        modules/<context>/api/
撰寫新 use case / entity / adapter      src/modules/<context>/
                                        以 src/modules/template 為骨架
了解蒸餾了哪些內容、跳過哪些            src/modules/<context>/README.md
需要跨模組 API boundary                 modules/<context>/api/index.ts（仍是權威）
```

---

## 使用 template 建立新模組

```bash
# 1. 複製骨架
cp -r src/modules/template src/modules/<your-context>

# 2. 全域取代（保留大小寫規律）
# Template → YourEntity
# template → your-entity

# 3. 刪除不需要的 stub 子域
# 刪除 subdomains/generation / ingestion / workflow（若無業務壓力）

# 4. 依 DDD 開發順序填入業務規則
# Domain → Application → Ports → Adapters → Orchestration
```

詳見 [template/README.md](template/README.md) 與 [template/AGENT.md](template/AGENT.md)。

---

## 嚴禁事項

| 禁止行為 | 原因 |
|---|---|
| 把 `modules/<context>/infrastructure/` 直接複製到 `src/modules/<context>/domain/` | 層次混淆，污染 domain 純度 |
| 把 `src/modules/` 當成 `modules/` 的別名或同義詞 | 兩層職責不同，互不取代 |
| 在 barrel 使用 `export *` | 破壞 tree-shaking 與邊界可追蹤性 |
| 跨 subdomain 直接 import（不經 orchestration/ 或 shared/events/）| 破壞 subdomain 邊界 |
| 在 `domain/` 中 import React、Firebase SDK、HTTP client、ORM | 破壞 domain 純度 |
| 在 `src/modules/platform/` 重建 account / org 子域 | 已遷入 iam |
| 新建或恢復 `workspace-workflow` 子域 | 已拆解（2026-04-15），禁止回歸 |

---

## 文件網絡

- [src/modules/template/README.md](template/README.md) — 多子域骨架說明
- [src/modules/template/AGENT.md](template/AGENT.md) — 骨架使用規則（Copilot / Agent 專用）
- [modules/](../../modules/README.md) — 完整 Hexagonal DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../docs/bounded-contexts.md) — 主域所有權地圖
- [docs/subdomains.md](../../docs/subdomains.md) — 子域清單
- [docs/ubiquitous-language.md](../../docs/ubiquitous-language.md) — 術語權威
