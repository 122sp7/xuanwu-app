# 51 Hard Rules — Consolidated Placement Strategy (updated 2026-04-17)

**Status**: Consolidated and documented  
**Authority**: AGENTS.md (strategic) + module AGENTS.md (tactical) + .github/instructions/* (operational)  
**Reference Document**: `docs/hard-rules-consolidated.md`

---

## Executive Summary

All 50 hard rules now have assigned homes across 7 primary documents:

| Home | Rule Count | Examples |
|------|-----------|----------|
| **AGENTS.md** | 14 | Ownership (1,5-10,28), Anti-patterns (46-51) |
| **architecture-core.instructions.md** | 7 | Layer responsibility (11-13, 21-23, 16) |
| **event-driven-state.instructions.md** | 5 | Event bus (4, 34-36, 9) |
| **security-rules.instructions.md** | 6 | File/metadata/permission (3, 29-32, 37-40) |
| **context-map.md** | 4 | Cross-module data (24-27) |
| **ESLint Config** | 3 | Boundary enforcement (2, 6-7, 49) |
| **Module AGENTS.md** | 12 | Tactical per-module rules |

**Total**: 51 rules consolidated; zero redundancy; clear enforcement chain

---

## Key Placements

### Tier 1: Strategic (AGENTS.md)
- Rule 1: Each module owns its domain adapters (cross-domain goes via service APIs)
- Rule 5: workspace is orchestration only
- Rules 6-10: Cross-module access prohibition, mandatory API boundary, domain layer clean, events
- Rule 28: Upstream contexts cannot depend on their downstreams (iam/billing/ai/platform)
- Rules 46-51: Anti-patterns (explicit prohibitions, including Rule 51: no foreign context providers)

### Tier 2: Tactical (.github/instructions/*)
- **architecture-core**: Layer responsibility (application, domain, UI constraints)
- **event-driven-state**: Event bus requirement, async flows, schema
- **security-rules**: File lifecycle, metadata, permissions, ownership, scope
- **context-map**: Cross-module data flow contracts

### Tier 3: Operational (Module AGENTS.md)
- platform/AGENTS.md: Infra ownership, Service API layers
- workspace/AGENTS.md: Orchestration constraint, zero business logic
- notion/AGENTS.md: AI agnostic, data ownership via API
- notebooklm/AGENTS.md: Notion API consumption, AI logging, async synthesis

### Tier 4: Enforcement (ESLint)
- No cross-module internal imports (rule 2, 6-7)
- No Firebase/Genkit outside platform (rule 1, 8)
- Dependency direction checks (rule 49)

---

## Instruction for Devs

When implementing a feature:

1. **Check AGENTS.md**: Strategic ownership (which module owns this?)
2. **Check module AGENTS.md**: Tactical rules (what this module must/must-not do)
3. **Check .github/instructions/**: Operational details (how to implement)
4. **Run ESLint**: Boundary checks + import restrictions
5. **Checkpoints**:
   - No cross-module internals
   - No Firebase outside platform
   - Event bus used for async
   - File metadata in DB
   - Permission server-side only

---

## Document Locations (Exact)

- `AGENTS.md` → Lines TBD (rules 1, 5-10, 28, 46-50)
- `docs/hard-rules-consolidated.md` → Full reference (NEW)
- `.github/instructions/architecture-core.instructions.md` → Section "Layer Responsibility Rules"
- `.github/instructions/event-driven-state.instructions.md` → Section "Event Bus Requirement"
- `.github/instructions/security-rules.instructions.md` → Section "File & Data Ownership"
- `docs/context-map.md` → Section "Cross-Module Data Contracts"
- `modules/*/AGENTS.md` → Module-specific constraints

---

## Next Actions

1. **Immediate**: Publish docs/hard-rules-consolidated.md (✅ DONE)
2. **Short-term**: Add sections to AGENTS.md (architecture-core, event-driven, security, context-map)
3. **Ongoing**: Enforce via ESLint + code review checklist
4. **Monthly**: Audit violations using grep patterns from hard-rules

---

## Enforcement Evidence

When implementing, provide evidence for:
- ✅ No `import * from '@/modules/X/domain'` (rules 6, 49)
- ✅ No `import { firebase }` outside platform (rules 1, 8)
- ✅ All async flows use event bus (rule 4, 34)
- ✅ File metadata in Firestore (rule 3, 30)
- ✅ Permission checks server-side (rule 38)
- ✅ Module has public API boundary (rule 7)

---

## One-Liner Mandate

> **iam = Identity + Auth + Tenant (upstream)**  
> **billing = Subscription + Entitlement (upstream)**  
> **ai = Shared AI Capability (upstream)**  
> **platform = Account + Org + Shared Operational Services (T1)**  
> **workspace = Collaboration Scope (T2, UI Orchestration)**  
> **notion = Canonical Knowledge Content (T3)**  
> **notebooklm = Reasoning Pipeline (T3)**  
> **analytics = Downstream Sink Only**  
> **Rule**: No sideways imports; deps point upstream; never invert direction
