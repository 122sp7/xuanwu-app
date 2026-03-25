---
name: 'Instructions Authoring Guidelines'
description: 'Guidelines for creating high-quality custom instruction files for GitHub Copilot'
applyTo: '.github/instructions/*.instructions.md'
---

# Custom Instructions File Guidelines (Noise-Reduced)

Use this file to keep instruction files concise, scoped, and non-overlapping.

## Required Frontmatter

```yaml
---
description: 'One-sentence purpose and scope'
applyTo: 'glob pattern(s) for target files'
---
```

Rules:
- `description` must be specific and actionable.
- `applyTo` must be as narrow as possible.
- Avoid catch-all patterns unless absolutely required.

## Recommended Structure

1. Title and scope
2. Core rules
3. Guardrails / anti-patterns
4. Validation commands
5. References

## Anti-Noise Rules

- Do not restate repository-global policies already defined in `AGENTS.md` or `.github/copilot-instructions.md`.
- Prefer references over duplicating long explanations.
- Keep examples short and only when needed to disambiguate.
- Remove repeated wording across sibling instruction files.

## Authoring Rules

- Use imperative language.
- Keep sections scannable.
- Prioritize deterministic instructions over broad advice.
- Add only constraints that can be validated in review or CI.

## Validation

- Verify frontmatter validity.
- Verify `applyTo` matches only intended files.
- Spot-check with representative Copilot prompts.

## References

- https://code.visualstudio.com/docs/copilot/customization/custom-instructions
- https://github.com/github/awesome-copilot/tree/main/instructions
