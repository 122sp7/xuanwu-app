# Migration Plan: Remove notebooklm/ai Subdomain (AGENTS.md Compliance)

**Status**: PLANNED  
**Priority**: CRITICAL (violates module ownership guardrail)  
**Effort**: 4-6 hours  
**Risk**: HIGH (touch points across 5 subdomains + public API)

---

## Rationale

### AGENTS.md Rule Violated
```
Module Ownership Guardrails:
- AI capability routing, model policy, safety 
  | OWNER: platform 
  | NEVER OWNED BY: notion, notebooklm
```

The `notebooklm/subdomains/ai/` directory exists and exports use-cases that should either:
1. Belong to platform.ai (refactor as consumer of platform AI capability), or
2. Be distributed to their owning Tier-2 subdomains (synthesis, retrieval, evaluation, grounding)

---

## Current State: ai Subdomain Contents

### Public API Exports (modules/notebooklm/api/index.ts)

| Export | Target Tier-2 Subdomain | Reason |
|--------|------------------------|--------|
| `RagRetrievedChunk, RagCitation, RagRetrievalSummary` | **retrieval** | Retrieval domain model |
| `IVectorStore, VectorDocument, VectorSearchResult` | **retrieval** | Vector store port |
| `IRagRetrievalRepository, RetrieveChunksInput` | **retrieval** | Retrieval repository |
| `IKnowledgeContentRepository` (citation-related) | **grounding** | Citation/grounding logic |
| `AnswerRagQueryInput/Output/Result` | **synthesis** | RAG answer generation |
| `RagStreamEvent` | **synthesis** | Streaming events during synthesis |
| `RagQueryFeedback, RagFeedbackRating, SubmitRagFeedbackInput` | **evaluation** | Feedback entities |
| `IRagQueryFeedbackRepository` | **evaluation** | Feedback repository |
| `GenerateRagAnswerInput/Output/Result` | **synthesis** | Answer generation contract |
| `GenerationCitation` | **grounding** | Citation details |
| `IRagGenerationRepository` | **synthesis** | Generation repository |
| `AnswerRagQueryUseCase` | **synthesis** | QA use-case |
| `SubmitRagQueryFeedbackUseCase` | **evaluation** | Feedback use-case |

### Server-Only Factory (modules/notebooklm/api/server.ts)

| Export | Type | Target |
|--------|------|--------|
| `createAnswerRagQueryUseCase()` | Factory | synthesis |
| `GenkitRagGenerationAdapter` | Adapter | synthesis |
| `FirebaseRagRetrievalAdapter` | Adapter | retrieval |
| `GenkitRagGenerationAdapter` | Adapter | synthesis |

---

## Migration Strategy (Phase-Based)

### PHASE 1: Audit (COMPLETED)
- ✅ Identified ai subdomain as ownership violation
- ✅ Mapped contents to Tier-2 destinations
- ✅ Located public API export points

### PHASE 2: Prepare (NEXT)
1. Create stub exports in each Tier-2 subdomain (api/index.ts) to accept migrated types
2. Add migration notes to each Tier-2 README
3. Prepare test fixtures for dependency verification

**Effort**: 1.5 hours  
**Risk**: LOW (non-breaking; stubs only)

### PHASE 3: Move Content (MAIN)

For each Tier-2 target subdomain:

1. **Retrieve source files** from notebooklm/subdomains/ai/{domain,application,infrastructure}
2. **Merge into Tier-2 structures** (e.g., retrieval/domain/entities)
3. **Update internal imports** within migrated code
4. **Update Tier-2 public API** (api/index.ts) with new exports
5. **Verify compilation**

**Order** (bottom-up dependency):
1. grounding (lowest dependencies)
2. retrieval (grounding → retrieval imports)
3. evaluation (low dependencies)
4. synthesis (top-level, imports from others)

**Effort**: 2 hours  
**Risk**: MEDIUM (file moves + internal import updates)

### PHASE 4: Update Root API Routes

Update these files to import from Tier-2 destinations:

| File | Current Source | New Sources |
|------|---|---|
| `modules/notebooklm/api/index.ts` | ai/{domain,application} | retrieval/api, grounding/api, synthesis/api, evaluation/api |
| `modules/notebooklm/api/server.ts` | ai/{application,infrastructure} | synthesis/api (server), retrieval/api (server) |

**Effort**: 0.5 hours  
**Risk**: LOW (mechanical update)

### PHASE 5: Delete ai Subdomain

1. Delete `modules/notebooklm/subdomains/ai/` directory
2. Run grep scan to ensure zero imports of `subdomains/ai`
3. Run tsc/eslint verification
4. Commit with message: "refactor: move notebooklm/ai to Tier-2 subdomains per AGENTS.md"

**Effort**: 0.5 hours  
**Risk**: LOW (deletion only; no rewrites)

---

## Validation Checkpoints

| Phase | Checkpoint | Tool |
|-------|-----------|------|
| 1 | Mapping complete | Grep + manual audit |
| 2 | Stubs created | tsc --noEmit |
| 3 | Files moved + imports updated | tsc --noEmit |
| 4 | Root routes updated | tsc --noEmit + grep |
| 5 | Directory deleted | ls + grep (verify zero matches) |
| ALL | Final validation | `npm run lint && npm run build` |

---

## Risk Mitigation

### Breaking Changes?
- NO — All exports remain accessible from root `modules/notebooklm/api/`
- Only internal import paths change (handled in Phase 3)

### Consumers of ai Subdomain?
- Grep for `from.*subdomains/ai` reveals: **only notebooklm root api** + internal imports
- No external modules depend on notebooklm.ai directly
- Safe to move

### Rollback Plan
- If any phase fails: revert commit, keep this doc for next attempt
- No data loss (pure code movement)

---

## Success Criteria

✅ All ai subdomain entities/ports distributed to Tier-2 subdomains  
✅ Public API (modules/notebooklm/api/) unchanged  
✅ Zero imports of `subdomains/ai` remain  
✅ tsc --noEmit succeeds  
✅ eslint --max-warnings 0 passes  
✅ ai directory deleted  

---

## Next Session Checklist

- [ ] Start with PHASE 2 (stub creation)
- [ ] Follow order: grounding → retrieval → evaluation → synthesis
- [ ] Run validation after each Tier-2 migration completes
- [ ] Delete ai/ only after all other phases succeed
- [ ] Update AGENTS.md compliance memo when done
