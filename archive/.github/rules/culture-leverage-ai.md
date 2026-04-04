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
- **Verify output** — AI-generated code must pass the same review standards as human-written code; reject suggestions that violate MDDD rules
- **Feed context** — point tools to `api/`, `README.md`, and `agents/` rules for better suggestions; update `agents/` when module structure changes
- **Ideal AI tasks** — module scaffolding, test generation, DTO creation, and boilerplate
- **Use skills** — `.github/skills/` provides specialized capabilities (React best practices, documentation writing, design guidelines)
