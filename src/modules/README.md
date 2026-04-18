# src/modules — 模組實作層

## 模組清單與子域對照

| 模組 | 狀態 | 子域清單 |
|---|---|---|
| `template/` | ✅ 完整骨架，可複製 | document、generation、ingestion、workflow |
| `iam/` | ✅ 完成 | account、access-control、authentication、authorization、federation、identity、organization、security-policy、session、tenant |
| `platform/` | ✅ 完成 | background-job、notification、platform-config、search（account / org 已移至 iam）|
| `workspace/` | 🔨 骨架建立，實作進行中 | approval、audit、feed、issue、lifecycle、membership、orchestration、quality、schedule、settlement、share、task、task-formation |
| `notion/` | 🔨 骨架建立，實作進行中 | page、block、database、view、collaboration、template |
| `notebooklm/` | 🔨 骨架建立，實作進行中 | document、conversation、notebook |
| `ai/` | 🔨 骨架建立，實作進行中 | chunk、embedding、retrieval、context、generation、citation、evaluation、pipeline |
| `analytics/` | 🔨 骨架建立，實作進行中 | event-contracts、event-ingestion、event-projection、insights、metrics、realtime-insights |
| `billing/` | 🔨 骨架建立，實作進行中 | entitlement、subscription |

---

## 路由決策規則

```
需要：                                  去哪裡
────────────────────────────────────────────────────────────────
讀取邊界規則 / published language       src/modules/<context>/AGENT.md
撰寫新 use case / entity / adapter      src/modules/<context>/
                                        以 src/modules/template 為骨架
了解模組目錄與實作狀態                  src/modules/<context>/README.md
需要跨模組 API boundary                 src/modules/<context>/index.ts
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
| 把 infrastructure 實作直接複製到 `src/modules/<context>/domain/` | 層次混淆，污染 domain 純度 |
| 在 barrel 使用 `export *` | 破壞 tree-shaking 與邊界可追蹤性 |
| 跨 subdomain 直接 import（不經 orchestration/ 或 shared/events/）| 破壞 subdomain 邊界 |
| 在 `domain/` 中 import React、Firebase SDK、HTTP client、ORM | 破壞 domain 純度 |
| 在 `src/modules/platform/` 重建 account / org 子域 | 已遷入 iam |
| 新建或恢復 `workspace-workflow` 子域 | 已拆解（2026-04-15），禁止回歸 |
| 使用動詞式子域名（approve、scheduling、sharing、authoring、synthesis、conversations）| 子域以名詞命名，見各模組 AGENT.md |
| 在 ai 模組定義使用者對話 UX 或 task-formation 業務流程 | 對話屬 notebooklm；task-formation 屬 workspace |
| 在 notion 模組定義 `knowledge-database`、`authoring`、`relations`、`taxonomy` 子域 | 已整合至名詞域（database / page / view / template）|

---

## 文件網絡

- [src/modules/template/README.md](template/README.md) — 多子域骨架說明
- [src/modules/template/AGENT.md](template/AGENT.md) — 骨架使用規則（Copilot / Agent 專用）
- [docs/structure/domain/bounded-contexts.md](../../docs/structure/domain/bounded-contexts.md) — 主域所有權地圖
- [docs/structure/domain/subdomains.md](../../docs/structure/domain/subdomains.md) — 子域清單
- [docs/structure/domain/ubiquitous-language.md](../../docs/structure/domain/ubiquitous-language.md) — 術語權威
