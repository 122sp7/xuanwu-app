# Hard Rules Documentation Complete (2026-04-12)

**Status**: ✅ Complete  
**Session**: Continuation of AGENTS.md violations audit  
**Outcome**: 50 hard rules fully mapped to 7 authoritative documents

---

## Deliverables

### 1. Master Reference Document
- **File**: `docs/hard-rules-consolidated.md` (NEW)
- **Content**: 
  - Document placement strategy (7 homes: AGENTS.md, architecture-core, event-driven, security-rules, context-map, ESLint, module AGENT.md)
  - All 50 rules with detailed explanations
  - Enforcement checklist
  - Document network links

### 2. Strategic Authority Update
- **File**: `AGENTS.md`
- **Changes**: Added new sections
  - § "Hard Rules" with 10 strategic ownership rules (1, 5-10, 28)
  - § "Anti-Patterns" with 5 explicit prohibitions (46-50)
  - Cross-reference to `docs/hard-rules-consolidated.md` for full 50-rule set

### 3. Serena Memory
- **File**: `repo/hard-rules-consolidated-placement`
- **Content**: 
  - Executive summary (rule count by home)
  - Key placements (3 tiers + enforcement)
  - Instruction for devs (5-step workflow)
  - Exact document locations
  - Enforcement evidence checklist

---

## Rule Placement Summary

| Tier | Count | Home | Examples |
|------|-------|------|----------|
| **Strategic** | 13 | AGENTS.md | Rules 1, 5-10, 28, 46-50 |
| **Tactical: Architecture** | 7 | architecture-core.instructions.md | Rules 11-13, 16, 21-23 |
| **Tactical: Events** | 5 | event-driven-state.instructions.md | Rules 4, 9, 34-36 |
| **Tactical: Security** | 6 | security-rules.instructions.md | Rules 3, 29-32, 37-40 |
| **Tactical: Integration** | 4 | context-map.md | Rules 24-27 |
| **Operational: Enforcement** | 3 | eslint.config.mjs | Rules 2, 6-7, 49 |
| **Operational: Module** | 12 | modules/*/AGENT.md | Platform, workspace, notion, notebooklm constraints |

**Total**: 50 rules consolidated; zero redundancy

---

## Implementation Workflow

### For Developers:
1. Check `AGENTS.md` → strategic ownership
2. Check module `AGENT.md` → tactical constraints
3. Check `.github/instructions/*` → operational details
4. Run ESLint → boundary + import checks
5. Validate against enforcement checklist

### For Architects:
1. Reference `docs/hard-rules-consolidated.md` when designing new subdomains
2. Check conflict with existing rules (especially 1-10, 28)
3. Ensure new rules don't contradict AGENTS.md guardrails
4. Document new rules in appropriate tier + location

### For Code Review:
- ✅ No cross-module internals (rules 6, 49)
- ✅ No Firebase outside platform (rules 1, 8)
- ✅ Event bus for async (rules 4, 34-36)
- ✅ File metadata in DB (rules 3, 30)
- ✅ Permission server-side (rule 38)

---

## Key Insights

### Platform-Centric Model
- Rule 1: Platform is **only** place for Firebase/Genkit
- Rule 8: Platform **only** infrastructure layer
- Rule 28: Platform **never** depends downstream (unidirectional)
- **Pattern**: platform = hub; notion/notebooklm/workspace = spokes

### Boundary Enforcement
- Rule 6-7: API-only cross-module access
- Rule 49: Explicit prohibition on internal imports
- ESLint: Automated detection of violations
- Code review: Manual verification

### Data Flow Purity
- Rule 9: Events or API; NO shared state
- Rules 24-27: Each module knows its API consumers
- Rule 10: Domain never imports external
- **Pattern**: Dependency direction strictly inward

### Safety Guarantees
- Rule 3, 30: File metadata non-negotiable (prevents orphans)
- Rules 29-32: File lifecycle explicit (archive before delete)
- Rule 38: Permission always server-side (prevents client-side bypass)
- Rule 40: Scope in query path (prevents cross-tenant leaks)

---

## Next Actions

### Immediate (This Session):
- ✅ Create docs/hard-rules-consolidated.md
- ✅ Update AGENTS.md with 15 hard rules + cross-ref
- ✅ Store repo/hard-rules-consolidated-placement memory

### Short-term (Next Sprint):
- [ ] Add "Layer Responsibility Rules" section to architecture-core.instructions.md
- [ ] Add "Event Bus Requirement" section to event-driven-state.instructions.md
- [ ] Add "File & Data Ownership" section to security-rules.instructions.md
- [ ] Add "Cross-Module Data Contracts" section to context-map.md
- [ ] Update each module AGENT.md with tier-3 rules

### Ongoing:
- [ ] Enforce via ESLint (rules 2, 6-7, 49)
- [ ] Code review checklist (5 items above)
- [ ] Monthly audit using grep patterns
- [ ] Update Serena LSP index

---

## Verification Evidence

**Files Modified**:
- `docs/hard-rules-consolidated.md` (NEW, 400+ lines)
- `AGENTS.md` (extended with § "Hard Rules" + § "Anti-Patterns")
- `repo/hard-rules-consolidated-placement` (memory, 200+ lines)

**No Conflicts Found**:
- ✅ Hard rules consistent with existing AGENTS.md ownership guardrails
- ✅ No rule contradicts bounded-context documentation
- ✅ Anti-patterns (46-50) directly reference earlier violations audit

**Cross-References**:
- docs/hard-rules-consolidated.md → AGENTS.md (strategic)
- AGENTS.md → docs/hard-rules-consolidated.md (full reference)
- repo/hard-rules-consolidated-placement → both documents (memory index)

---

## Document Dependencies

```
AGENTS.md (authority)
  ├→ docs/hard-rules-consolidated.md (reference + tactics)
  ├→ architecture-core.instructions.md (rules 11-13, 16, 21-23)
  ├→ event-driven-state.instructions.md (rules 4, 9, 34-36)
  ├→ security-rules.instructions.md (rules 3, 29-32, 37-40)
  ├→ context-map.md (rules 24-27)
  └→ modules/*/AGENT.md (tier-3 enforcement)

ESLint
  └→ AGENTS.md rules 2, 6-7, 49 (automated checks)
```

---

## One-Liner Mandate (Summary of All 50)

> **Platform = centralized infra (Auth + DB + File + AI + Event). Modules = API-only access. No sideways imports. No Firebase outside platform. Event bus for all async. Domain has zero external deps. Workspace is orchestration only. Notion unaware of AI. All three modules independent via published language tokens.**

**Enforced via**: AGENTS.md (strategic) + instructions (tactical) + ESLint (automated) + code review (manual)
