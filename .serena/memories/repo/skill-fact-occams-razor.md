# Skill Fact: Occam's Razor (Parsimony Heuristic)

**Type**: Decision-making methodology skill  
**Authority**: Philosophical parsimony principle; software engineering heuristics  
**Application Scope**: Design choices, abstraction decisions, docs/workflow bloat reduction, assumption pruning  

---

## Core Principle

**When competing explanations have comparable explanatory power, prefer the one with fewer assumptions.**

**Important**: Occam's Razor is a heuristic, not a proof rule. It does NOT guarantee the simplest explanation is true. 

**Key Use**: Cutting ad hoc additions and prioritizing options that are easier to test and falsify.

**Critical Misuse**: Using it to erase real complexity, evidence, or domain distinctions.

---

## Five Engineering Rules for Xuanwu

1. **Prefer the owning existing bounded context before inventing a new one**
   - Resist pressure to create "generic" or "utility" subdomains
   - Extend existing context if pressure will drive behavior here anyway
   - New context only when ownership or language truly diverges

2. **Keep `.github` thin and let `docs/` stay the authority**
   - `.github/instructions/` = behavior rules only
   - `.github/*` must NOT duplicate architecture inventory or glossary
   - If conflict: root `docs/` is source of truth
   - `.instructions.md` governs Copilot behavior, not strategy

3. **Add ports only when they protect the core from a real external seam**
   - Do NOT create port for hypothetical "later we might swap this"
   - DO create port when: different runtime, external dependency, multiple implementations exist/planned
   - If one implementation will suffice, keep it in infrastructure

4. **Avoid parallel glossaries, prompts, or instructions that restate existing authority**
   - If `docs/ubiquitous-language.md` exists, don't create `modules/*/docs/glossary.md`
   - If AGENTS.md defines rules, don't create parallel `.github/*/RULES.md`
   - One authority per concern; refer to it, don't duplicate

5. **Keep app shims thin and move real behavior into the owning module**
   - Route composition in `app/` should be thin
   - Business logic lives in `modules/` with clear ownership
   - If route logic gets complex, move it to module's `interfaces/`

---

## Real Pressures (When Extra Structure is Justified)

An extra abstraction, document, layer, or module should usually exist only if it protects at least ONE of:

| Pressure | Examples | When It Applies |
|----------|----------|---|
| **Runtime or process boundary** | Main → worker, sync → async, browser ↔ server | Firebase functions, fn, Server Actions |
| **Bounded-context ownership boundary** | platform owns AI; notion owns knowledge | AGENTS.md rules; imported from other modules |
| **Volatile external dependency** | Firebase SDK, Next.js, Genkit versions | Hide behind port to support swaps |
| **Materially different behavior** | Template search vs. fuzzy search; draft vs. published | Two subdomain implementations needed now |
| **Repeated change pressure (already visible)** | Same file modified 3+ times in adjacent sessions | 2+ use cases demanding same rule |

**If none apply**: The extra structure is probably speculative.

---

## Decision Loop (Occam-Driven)

1. **Frame the problem**: What are we choosing between?
2. **List assumptions for each option**: What must be true for this to work?
3. **Identify comparable outcomes**: Do both achieve the goal?
4. **Remove assumptions first**: Trade off what assumptions can you cut? (Not evidence)
5. **Compare remaining options**: Preference goes to fewer remaining assumptions
6. **If tied**: Prefer the easiest to test, explain, and reverse

---

## Xuanwu Anti-Patterns (Occam Violations)

| Anti-Pattern | Violation | Fix |
|---|---|---|
| Generic `core/` wrapper above all layers | Over-layering | Use explicit layer names (application/, domain/, infrastructure/) |
| Parallel glossaries (docs/ + modules/*/docs/glossary.md) | Duplication without authority | One glossary source; refer to it |
| N copies of "how to write docs" | Ceremony bloat | One template; one style guide; one example |
| Speculative port "in case we swap later" | Prophecy, not pressure | Create port only when real swap is planned/executing |
| Feature-duplicate subdomains (e.g., two `/search` subdomains) | Ownership drift | AGENTS.md duplicate resolution rules |
| "Generic" utilities module owning nothing specific | Fuzzy boundaries | Move utilities back to owning context or make them truly generic (shared-*) |

---

## Decision Checklist

Before adding a new:
- [ ] Document: Is an existing doc source authority? Refer to it instead of duplicating.
- [ ] Port: Is there a real external seam and a plausible alternative implementation?
- [ ] Layer: Does it protect a real boundary? Or is it speculative scaffolding?
- [ ] Subdomain: Will behavior here differ from existing subdomains? Or extend existing?
- [ ] Rule: Does it reduce ceremony without removing control? Or add ceremony without value?

If most answers are "speculative" → reject or defer.

---

## Citations

- Occam's Razor (philosophical principle)
- Software Engineering Applications (web-verified)
- Xuanwu: process-framework.instructions.md, AGENTS.md, docs/README.md authority rules
