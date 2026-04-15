# src/modules — 精簡蒸餾骨架層

> **⚠ 衝突防護聲明**：本層（`src/modules/<context>/`）與 `modules/<context>/`（完整 Hexagonal DDD 實作層）是**兩個獨立的實作層，不可互換、不可混用**。
>
> - `modules/<context>/` → 讀取邊界規則、published language、context map；不在此新增實作程式碼。
> - `src/modules/<context>/` → 撰寫新 use case、adapter、entity；以 `template` 骨架為起點。

---

## 蒸餾作業 — 整體狀態（2026-04-15）

本層是從 `modules/` 蒸餾出的**精簡、可交付骨架**。每個子模組僅保留：

- `domain/` → 核心 entity、value object、domain event、repository port
- `application/` → use case、DTO
- `adapters/inbound/` → HTTP / Queue 驅動 adapter
- `adapters/outbound/` → Firestore / Firebase / 外部系統被驅動 adapter

無 `subdomains/` 分層（除非子域邊界壓力明確）；無 `infrastructure/`、`interfaces/` 資料夾。

---

## 模組清單與蒸餾狀態

| 模組 | 蒸餾來源（`modules/`） | 狀態 | 備註 |
|---|---|---|---|
| `template/` | 無（原創骨架） | ✅ 完整骨架，可複製 | **多子域示範模組，從這裡複製** |
| `iam/` | `modules/iam` + `modules/platform`（account / org） | 🔨 進行中 | account / org 已遷入 |
| `platform/` | `modules/platform`（notification 等剩餘服務） | 🔨 進行中 | account / org 已移至 iam |
| `workspace/` | `modules/workspace` | 🔨 進行中 | task、issue、lifecycle 等子域 |
| `notion/` | `modules/notion` | 📋 待蒸餾 | knowledge、authoring、collaboration |
| `notebooklm/` | `modules/notebooklm` | 📋 待蒸餾 | conversation、source、synthesis |
| `ai/` | `modules/ai` | 📋 待蒸餾 | tool-runtime、task-formation |
| `analytics/` | `modules/analytics` | 📋 待蒸餾 | reporting、metrics |
| `billing/` | `modules/billing` | 📋 待蒸餾 | subscription、entitlement |

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
````

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
| 跨 subdomain 直接 import（不經 orchestration/ 或 shared/events/） | 破壞 subdomain 邊界 |
| 在 `domain/` 中 import React、Firebase SDK、HTTP client、ORM | 破壞 domain 純度 |

---

## 文件網絡

- [src/modules/template/README.md](template/README.md) — 多子域骨架說明
- [src/modules/template/AGENT.md](template/AGENT.md) — 骨架使用規則（Copilot / Agent 專用）
- [modules/](../../modules/README.md) — 完整 Hexagonal DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../docs/bounded-contexts.md) — 主域所有權地圖
- [docs/subdomains.md](../../docs/subdomains.md) — 子域清單
- [docs/ubiquitous-language.md](../../docs/ubiquitous-language.md) — 術語權威
