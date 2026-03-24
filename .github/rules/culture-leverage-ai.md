---
title: AI-Assisted Development Practices
impact: MEDIUM
impactDescription: Maximizes AI tooling value while maintaining code quality
tags: culture, ai, tooling, copilot
---

## AI-Assisted Development Practices

**Impact: MEDIUM**

AI tools (GitHub Copilot, coding agents) are first-class development aids. Use them effectively, but always review and validate their output.

**Guidelines:**
- **Trust but verify** — AI-generated code must pass the same review standards as human-written code
- **Feed context** — point AI tools to the relevant module's `api/`, `README.md`, and architecture docs for better suggestions
- **Use the agents knowledge base** — the `agents/` directory contains rules, patterns, and domain knowledge that AI tools can reference
- **Keep agents updated** — when you change a module's structure or patterns, update the corresponding knowledge base entries
- **Don't blindly accept** — if AI suggests a pattern that violates MDDD rules (e.g., importing infrastructure in domain), correct it
- **Leverage for repetitive tasks** — module scaffolding, test generation, DTO creation, and boilerplate are ideal AI tasks
- **Use skills** — skills under `agents/skills/` and `.github/skills/` provide specialized capabilities (React best practices, web design guidelines, documentation writing)
