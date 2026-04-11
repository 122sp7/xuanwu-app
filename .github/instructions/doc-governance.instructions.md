---
description: '[DEPRECATED] Docs governance rules. See docs-authority-and-language.instructions.md.'
applyTo: 'docs/**/*.md'
---

# 文件治理規範 (Documentation Governance)

> DEPRECATED: 已整併至 `.github/instructions/docs-authority-and-language.instructions.md`。

本規範只描述 Copilot 在 `docs/**/*` 上的行為約束。DDD 戰略知識與文件結構權威一律回到 `docs/**/*`。

> 文件入口：[`docs/README.md`](../../docs/README.md)

## 強制規則

1. 新增或修改 `docs/**/*` 前，先從 [`../../docs/README.md`](../../docs/README.md) 判斷應更新哪個權威文件，而不是先新增平行說明文件。
2. `docs/subdomains.md`、`docs/bounded-contexts.md`、`docs/ubiquitous-language.md` 與 `docs/contexts/<context>/*` 擁有 DDD 戰略與 bounded-context 權威；其他地方只可連結，不可複製。
3. `.github/instructions/*` 只寫行為規則，不重述架構知識、術語表、context map 或 bounded-context inventory。
4. `modules/<context>/docs/*` 若存在，只能描述 implementation-aligned detail，不得覆蓋 `docs/**/*` 的命名、所有權、邊界或 duplicate resolution。
5. 若變更會影響 `.github/skills/` 的 repomix 參考輸出，必須使用既有 scripts 重新生成。

## 快速檢查

- 這段內容是否已由 `docs/**/*` 其中一個 owner 文件承接？
- 這裡是否在重貼 docs，而不是只補本檔所需的行為約束？
- 這次文件變更是否需要同步 regeneration repomix skills？

Tags: #use skill context7 #use skill xuanwu-app-skill
