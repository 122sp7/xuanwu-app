---
description: 'Guidelines for explicit skill usage in Copilot agents, prompts, and skill-aware repository workflows'
applyTo:
  - '.github/agents/*.agent.md'
  - '.github/prompts/*.prompt.md'
  - '.github/README.md'
  - '.github/skills/README.md'
---

# Skill Usage Guidelines

Use these rules when repository workflows depend on project skills for durable context.

## When to reference a skill explicitly

- Reference a skill explicitly when the workflow depends on a specific project knowledge pack, such as `xuanwu-app-skill`, `vscode-docs-skill`, `billing-lifecycle`, or `vsa-mddd-migration`.
- Keep explicit skill references near the top of the file so the intended context source is easy to find.
- Explain why the skill is needed, not only which skill to load.

## Agent patterns

- Coordinator agents should name the skills that shape routing decisions.
- Specialist agents should name only the skills that are required for their domain.
- Hidden specialists that should not be selected casually should use:
  - `user-invocable: false`
  - `disable-model-invocation: true`
  - explicit coordinator allowlisting through `agents:`
- Example coordinator allowlist:

```yaml
agents:
  - planner
  - implementer
  - reviewer
  - billing-auditor
```

- In this pattern, `billing-auditor` stays hidden from casual selection, while the coordinator can still dispatch it intentionally because it appears in the coordinator's `agents:` list.

## Prompt patterns

- If a prompt assumes a specific skill, state that requirement in the prompt body before the workflow steps.
- Do not reference unrelated skills just to increase context.
- Prefer one or two high-signal skills over a broad list of weakly related skills.

## Repository documentation

- Keep `.github/README.md` and `.github/skills/README.md` aligned with the actual skill-routing model in the repository.
- When the entrypoint agent or skill set changes, update the docs in the same change.
