---
name: 'Agent Skills Guidelines'
description: 'Guidelines for creating high-quality Agent Skills for GitHub Copilot'
applyTo: '.github/skills/**/SKILL.md, .claude/skills/**/SKILL.md'
---

# Agent Skills File Guidelines (Noise-Reduced)

Use this file to author lean, discoverable skills.

## Required SKILL.md Frontmatter

```yaml
---
name: webapp-testing
description: Toolkit for testing local web apps with Playwright. Use for UI verification, interaction checks, screenshots, and console diagnostics.
license: Complete terms in LICENSE.txt
---
```

Rules:
- `name` is required, lowercase, kebab-case, <= 64 chars.
- `description` is required and is the primary discovery signal.
- `description` must include: what it does, when to use, and matchable keywords.

## Minimal Skill Structure

Each skill folder should include:
- `SKILL.md` (required)
- `LICENSE.txt` (recommended)
- Optional: `scripts/`, `references/`, `templates/`, `assets/`

## Body Sections (Recommended)

1. Title and intent
2. When to use this skill
3. Prerequisites
4. Workflow steps
5. Guardrails
6. Output expectations
7. References

## Resource Rules

- Put executable automation in `scripts/`.
- Put long docs in `references/` and link from `SKILL.md`.
- Use `templates/` for files the model edits.
- Use `assets/` for files copied as-is.

## Anti-Noise Rules

- Keep `SKILL.md` under 500 lines.
- Move long examples to `references/`.
- Avoid repeating repository-wide policy inside each skill.
- Do not duplicate the same workflow across multiple skills; route via an index skill.

## Quality Checklist

- [ ] Frontmatter is valid (`name`, `description`)
- [ ] Description is specific enough for auto-discovery
- [ ] Workflow is actionable and deterministic
- [ ] Secrets are never hardcoded
- [ ] Relative paths are used for internal references

## References

- https://code.visualstudio.com/docs/copilot/customization/agent-skills
- https://agentskills.io/
- https://github.com/github/awesome-copilot/blob/main/docs/README.skills.md
