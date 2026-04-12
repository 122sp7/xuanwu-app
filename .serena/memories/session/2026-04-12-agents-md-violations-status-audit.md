# AGENTS.md Violations Status Audit (2026-04-12)

## Session Goal
验证 AGENTS.md 中三个已标记的违反，确认修复状态，更新 Serena 指标。

---

## Audit Results

### ✅ VIOLATION #3 (MEDIUM): workspace/audit Terminology — FIXED

**File**: `modules/workspace/subdomains/audit/domain/value-objects/ActorId.ts`

**Status**: ✅ FIXED (Documentation approach)

**Current Documentation**:
```typescript
/**
 * ActorId — receives platform's "actor reference" published language token.
 * 
 * MAPPING (AGENTS.md ubiquitous language):
 * - platform.Actor (upstream) → workspace.audit.ActorId (downstream)
 * - workspace.audit consumes token without redefining Actor semantics
 */
```

**Verification**: ✅ JSDoc clear, context map explicit

---

### ✅ VIOLATION #2 (CRITICAL): NotionKnowledgePageGateway — FIXED

**Files**:
- `modules/notebooklm/subdomains/source/infrastructure/adapters/NotionKnowledgePageGatewayAdapter.ts`
- `modules/notebooklm/subdomains/source/api/factories.ts`

**Fix Applied**:
- Removed cross-domain dependency from infrastructure adapter.
- Introduced constructor injection for `createKnowledgePage` and `addKnowledgeBlock`.
- Bound notion API dependency in `source/api/factories.ts` (allowed API layer boundary).
- Added published-language token normalization helper in adapter.

**AGENTS.md / Hexagonal Rule Alignment**:
- infrastructure no longer imports cross-domain API directly.
- cross-domain binding occurs at API composition layer.

**Status**: ✅ FIXED and lint-validated (0 errors).

---

### 📋 VIOLATION #1 (CRITICAL): notebooklm/ai Subdomain — NEEDS DELETION

**Location**: `modules/notebooklm/subdomains/ai/` (14+ files)

**AGENTS.md Rule**: AI capability routing owned by platform ONLY; no other domain owns `ai` subdomain

**Status**: 📋 PLANNED FOR PHASE 2 MIGRATION

**Reason**: Requires phased migration (4-5h, medium risk)

---

## AGENTS.md Authority Status ✅

**Verification**:
- ✅ AI ownership clearly declared (platform only)
- ✅ All four domains properly inventoried (38 subdomains total)
- ✅ Anti-patterns list includes notebooklm/ai violation
- ✅ Published language tokens complete (11 tokens)
- ✅ Context map dependency directions explicit

**Conclusion**: AGENTS.md is authoritative and correct. Violations are in code, not documentation.

---

## Remediation Summary

| Violation | Status | Effort | Blocker |
|-----------|--------|--------|---------|
| #3: workspace ActorId | ✅ Fixed | — | ❌ No |
| #2: NotionKnowledgePageGateway | ⚠️ Marked | 2-3h | ❌ No |
| #1: notebooklm/ai | 📋 Planned | 4-5h | ❌ No |

**Next Actions**: #2 fixed. #1 containment in place and anti-spread guardrails added. Platform shell boundary violations reduced (lint warnings 9 -> 6). Remaining hard blockers are cross-subdomain infrastructure couplings requiring composition-root refactor.
