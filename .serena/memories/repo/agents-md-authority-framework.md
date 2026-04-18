# AGENTS.md — Architectural Authority & Compliance Framework

**Type**: Repository-scoped strategic fact  
**Established**: 2026-04-12  
**Authority Level**: 🔴 SUPREME (supersedes all module-level rules)  
**Status**: Stable + Violation-remediation protocol established

---

## What AGENTS.md Declares (Turn 9-10)

### 1. Two-Layer API Model

| API Layer | Ownership | Consumers | Boundary |
|-----------|-----------|-----------|----------|
| **Infrastructure API** | platform | notion, notebooklm ONLY | Firestore, Storage, Genkit (low-level) |
| **Platform Service API** | platform | all modules (platform, workspace, notion, notebooklm) | Auth, Permission, File, AI (high-level) |

Rule: workspace ❌ Infrastructure APIs; workspace ✅ Service APIs  
Enforcement: AGENTS.md § "API Architecture Rules"

### 2. Eight Main Domains + Ubiquitous Language

**Strategic Inventory** (8 bounded contexts, governed by ADR 0014):
- iam — identity, authentication, authorization, tenant isolation (T0 upstream)
- billing — subscription and entitlement governance (T0 upstream)
- ai — shared AI capability, routing, policy, safety (T0 upstream)
- analytics — metrics, dashboards, projections (downstream sink only)
- platform — account, organization, shared operational services (T1)
- workspace — collaboration scope and lifecycle (T2)
- notion — canonical knowledge content (T3)
- notebooklm — retrieval, grounding, synthesis, evaluation (T3)

**Key Ownership Corrections (2026-04-17)**:
- Actor, Tenant: owned by iam (NOT platform)
- Entitlement: owned by billing (NOT platform)
- AI capability: owned by ai (notion/notebooklm CONSUME only)

Enforcement: AGENTS.md § "Strategic Domain Overview"

### 3. Dependency Direction (Fixed)

```
iam     → billing · platform · workspace · notion · notebooklm
billing → workspace · notion · notebooklm
ai      → notion · notebooklm
platform → workspace
workspace → notion · notebooklm
notion  → notebooklm
(all above) → analytics  ← event / projection sink only
```

✅ Allowed: upstream → downstream  
❌ Forbidden: downstream → upstream (never invert)

Full context map authority: docs/context-map.md and docs/module-graph.system-wide.md
Enforcement: AGENTS.md § "Dependency Direction Rules"

---

## Compliance Protocol

### Finding Violations
1. grep patterns target: Infrastructure API calls in workspace, platform imports in modules, notion→notebooklm direct calls, terminology mixing
2. Scope: All 4 modules scanned for specific rule violations
3. Severity: CRITICAL (ownership breach), MEDIUM (terminology pollution)

### Fixing Violations
**Three-Tier Approach**:
1. **Documentation** (low-risk) — Add JSDoc explaining published language mapping
2. **Marking** (medium-risk) — Add migration notes + TODO + effort estimate
3. **Migration** (high-risk) — Phase-based content moves with validation checkpoints

**Authority for Remediation**:
- AGENTS.md rules are source of truth
- Module AGENTS.md must conform to AGENTS.md
- Code must conform to module AGENTS.md

---

## Known Violations (2026-04-12 Audit)

| Violation | Module | Fix Status | Authority |
|-----------|--------|-----------|-----------|
| notebooklm/ai owns AI capability | notebooklm | Documentation + Planned migration | AGENTS.md § ownership guardrails |
| NotionKnowledgePageGateway calls notion.api directly | notebooklm | Marked with TODO + migration notes | AGENTS.md § context map |
| workspace/audit uses "actorId" terminology | workspace | Fixed with published language docs | AGENTS.md § ubiquitous language |

All violations remediated or have clear remediation path. tsc/eslint PASSING.

---

## Why This Matters

- **Before**: Module boundaries were implicit; terminology mixed across contexts
- **After**: AGENTS.md makes all rules explicit; violations are detectable and prioritizable
- **Benefits**: 
  - Linters can enforce context map rules (future: eslint plugin)
  - Architects can review violations against written authority
  - New code submissions can self-check against AGENTS.md
  - Onboarding is clearer: read AGENTS.md first, then module-level AGENTS.md

---

## Future Maintenance

### Each Session
- Before coding: check AGENTS.md for relevant rules
- After major changes: grep for violations using established patterns
- Update AGENTS.md if rules evolve (with ADR reference)

### Each PR
- Verify no new modules own "ai", "workflow", "analytics", "integration", "versioning" in violation of cross-domain duplicate resolution
- Verify context map not inverted (no downstream → upstream imports)
- Verify terminology consistency with AGENTS.md glossary

### Version Bumps
- Update AGENTS.md § "Module Ownership Guardrails" if a new subdomain is created
- Update AGENTS.md § "Published Language Tokens" if ubiquitous language evolves
- Reference ADR if decision changes

---

## Citations

- AGENTS.md: `d:\GitHub\122sp7\xuanwu-app\AGENTS.md` (complete strategic framework)
- Module AGENTS.md files: each bounded context's implementation-level rules
- docs/bounded-contexts.md, subdomains.md, ubiquitous-language.md: Context7-verified sources

---

## Commit Message Template (for future reference)

```
feat(architecture): [module] [change]

- Change: ...
- AGENTS.md rule: Section "..."
- Authority: ...
- Violation fixed: [if applicable] AGENTS.md rule "..."
```
