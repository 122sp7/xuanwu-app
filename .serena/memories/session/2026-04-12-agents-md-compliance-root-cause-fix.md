# AGENTS.md 根因修復計劃 (2026-04-12)

## 違規總結

### 🔴 CRITICAL: notebooklm/ai 子域違反 AGENTS.md
- **Location**: modules/notebooklm/subdomains/ai/
- **Rule Violated**: Module Ownership Guardrails - "AI capability routing owned by platform ONLY"
- **Status**: Physical directory exists with 38+ files (domain, application, infrastructure, interfaces)
- **Impact**: Violates foundational architecture principle; affects module boundary enforcement

### ✅ FIXED: NotionKnowledgePageGateway (CRITICAL)
- **Location**: modules/notebooklm/subdomains/source/infrastructure/adapters/
- **Fix Applied**: Constructor injection + API boundary composition
- **Verification**: ✅ No cross-domain direct imports; published language token introduced

### ✅ FIXED: workspace/audit ActorId (MEDIUM)
- **Location**: modules/workspace/subdomains/audit/domain/value-objects/
- **Fix Applied**: JSDoc documentation mapping platform.Actor → workspace.audit.ActorId
- **Verification**: ✅ Published language contract explicit

---

## 修復優先級與執行計劃

| Priority | Violation | Action | Effort | Blocker |
|----------|-----------|--------|--------|---------|
| 🔴 P0 | notebooklm/ai | Execute PHASE 2-4 migration plan | 4-6h | ❌ No |
| ✅ P1 | NotionKnowledgePageGateway | Already fixed; verify lint clean | 0.5h | ❌ No |
| ✅ P2 | workspace/audit | Already fixed; verify docs | 0 | ❌ No |

---

## P0: notebooklm/ai 遷移執行計劃

### 遷移策略
根據 MIGRATION-AI-SUBDOMAIN-REMOVAL.md：

**PHASE 2: Prepare** (1.5h)
- [ ] Create stub exports in retrieval/api, grounding/api, evaluation/api, synthesis/api
- [ ] Add migration notes to each Tier-2 README
- [ ] Prepare test fixtures

**PHASE 3: Move Content** (2h, bottom-up order)
1. grounding → move domain,application,infrastructure files
2. retrieval → move domain,application,infrastructure files
3. evaluation → move domain,application,infrastructure files
4. synthesis → move domain,application,infrastructure files

**PHASE 4: Update Root API Routes** (0.5h)
- Update modules/notebooklm/api/index.ts to import from Tier-2 destinations
- Update modules/notebooklm/api/server.ts (server-only exports)
- Update eslint.config.mjs (remove deprecation guardrail)

**PHASE 5: Delete ai Subdomain** (0.5h)
- Remove modules/notebooklm/subdomains/ai/
- Remove migration document (MIGRATION-AI-SUBDOMAIN-REMOVAL.md)
- Verify: npm run build, npm run lint, npm run test

---

## Occam's Razor 應用

按照 Occam's Razor 原則，這次修復應該：
1. **移除假設**: 刪除 notebooklm 擁有 ai 子域的假設
2. **保留複雜性**: 保持 synthesis, retrieval, grounding, evaluation 作為真正的 Tier-2 邊界（已有真實的變化壓力和依賴關係）
3. **簡化邊界**: ai 子域被消除，檔案數量減少，邊界更清晰

---

## AGENTS.md 規則檢查清單

✅ Rule 1: Platform 是唯一的基礎設施閘道
✅ Rule 5: Workspace 只是編排層
✅ Rule 6: 模組間僅通過 @/modules/x/api
✅ Rule 7: 每個模組有 api/index.ts
✅ Rule 8: Platform 只擁有基礎設施層
✅ Rule 9: 模組間通過事件或 API

修復後所有規則應完全符合，notebooklm/ai 刪除後檔案將減少 38+ 個，邊界更乾淨。

---

## 驗證步驟

1. **PHASE 2-4 完成後**: npm run lint (確保無新的違規警告)
2. **刪除後**: npm run build + npm run test
3. **最終驗證**: 運行 repomix:skill 更新代碼參考庫
4. **Serena 更新**: refresh LSP index，更新記憶

---

## 下一步

執行 PHASE 2 (prepare stub exports) → PHASE 3 (move content) → PHASE 4 (update root API) → PHASE 5 (delete ai)
