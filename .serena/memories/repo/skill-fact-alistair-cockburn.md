# Skill Fact: Alistair Cockburn (Heart of Agile)

**Type**: Foundational methodology skill  
**Authority**: Cockburn's Heart of Agile; Agile Manifesto co-author; Crystal methodology originator  
**Application Scope**: Process weight decisions, use-case framing, collaboration, delivery rhythm  

---

## Core Stance

Software development is a **cooperative game of invention and communication.**

Two simultaneous goals:
1. **Deliver working software now**
2. **Leave the codebase and team in shape for the next round of work**

If a decision helps the current change but makes the next change harder, it is suspect.

---

## Four-Move Operating Loop (Default)

### Cockburn's Heart of Agile Cycle

1. **Collaborate**: Align vocabulary, boundaries, and expected behavior with the right people
2. **Deliver**: Ship a small but real increment that can be evaluated
3. **Reflect**: Inspect what was learned from the increment and handoffs
4. **Improve**: Adjust code, process, or communication based on evidence

Apply this as the default operating loop for sessions, sprints, and major decisions.

---

## Use-Case Guidance

**Principle**: Prefer user-goal use cases over technical step lists.

**Structure**: Behavior contract between stakeholders and system.

1. Identify the **primary actor** (user type, not system role)
2. State the **goal in business language** (not implementation detail)
3. Write the **main success scenario** (happy path, stakeholder communication)
4. Add only **meaningful extensions and failure branches** (not all edge cases)
5. **Keep storage, framework, and transport details out** of the use case itself

**Anti-Pattern Check**: If a use case reads like controller code or database choreography, it is at the wrong level.

---

## Method Weight Rules

1. **Use the lightest process that still controls risk**
2. **Remove ceremony that does not improve communication, feedback, or quality**
3. **Weight process by team size and goal volatility**, not by role or maturity
4. **Document only what the next person needs to know**

**Xuanwu Application**:
- Use ADR only when decision has lasting impact
- Prefer inline comments over separate style guides
- Keep architecture docs thin; let code speak when structure is clear
- Require docs only at domain boundaries, not for every subdomain

---

## Decision Heuristics

**When to apply Cockburn**:
- Collaboration is unclear (align vocabulary first)
- Process overhead is preventing delivery (reduce ceremony)
- Instructions are bloating (simplify to learnable form)
- Team is confused about ownership or expectations (explicit contract)

**When to defer to other skills**:
- Technical structure choice → Hexagonal DDD
- Assumption reduction → Occam's Razor
- API verification → Context7
- Code patterns → existing SOLID principles

---

## Xuanwu-Specific Adaptations

| Cockburn Rule | Xuanwu Practice |
|---|---|
| Collaborate | Write AGENTS.md to align vocabulary; CLAUDE.md for onboarding |
| Deliver | Keep features in smallest changeable unit per PR; one concern per branch |
| Reflect | Serena memories after major sessions; memory refresh after architecture changes |
| Improve | ADR for decisions with lasting consequences; inline docs for tactical calls |

---

## Citations

- Alistair Cockburn, *Agile Software Development* (2001)
- Cockburn, *Writing Effective Use Cases* (2001)
- Heart of Agile: https://heartofagile.com
- Xuanwu codebase: process-framework.instructions.md, CLAUDE.md, AGENTS.md
