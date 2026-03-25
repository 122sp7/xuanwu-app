---
name: 'Custom Agent Guidelines'
description: 'Guidelines for creating custom agent files for GitHub Copilot'
applyTo: '.github/agents/*.agent.md'
---

# Custom Agent File Guidelines (Noise-Reduced)

Use this file as the minimal standard for `.agent.md` authoring. Keep agent specs short, specific, and non-overlapping.

## Required Frontmatter

```yaml
---
description: 'One-sentence purpose and trigger context'
name: 'Agent Display Name'
tools: ['read', 'edit', 'search']
model: 'GPT-5.3-Codex'
target: 'vscode'
---
```

## Frontmatter Rules

- `description` is required and should explain when the agent should be used.
- `name` is recommended; use title case.
- `tools` should be least-privilege. Omit only when intentionally allowing all tools.
- `model` is recommended for deterministic behavior.
- `target` may be `vscode` or `github-copilot`.
- Optional controls:
  - `user-invocable: false` hides from picker.
  - `disable-model-invocation: true` blocks subagent usage.

## Handoffs (Optional)

Use handoffs only for real stage transitions (plan -> implement -> review -> qa).

```yaml
handoffs:
  - label: Start Implementation
    agent: Implementer
    prompt: 'Implement the approved plan above.'
    send: false
```

Rules:
- Keep each handoff label action-oriented.
- Limit to 2-3 high-value next steps.
- Do not add handoffs to non-existent agents.

## Agent Body Structure

Keep the body compact and scannable:

1. Role and boundaries
2. Inputs and assumptions
3. Workflow steps
4. Guardrails and non-goals
5. Output format

## Tool Policy

- Use least privilege.
- Include `agent` only if orchestration is required.
- Avoid granting `execute` unless terminal execution is a core capability.

## Anti-Noise Rules

- Do not duplicate repository-wide rules from `AGENTS.md` or `.github/copilot-instructions.md`.
- Do not copy long tutorials into agent files; link references instead.
- Prefer short checklists over repeated prose.

## Validation Checklist

- [ ] Frontmatter is valid and minimal
- [ ] Agent purpose is unique (not duplicating existing agents)
- [ ] Tools are least-privilege
- [ ] Handoffs (if any) are valid and necessary
- [ ] Prompt body stays focused and under 500 lines

## References

- https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents
- https://docs.github.com/en/copilot/reference/custom-agents-configuration
- https://code.visualstudio.com/docs/copilot/customization/custom-agents
- https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/extend-coding-agent-with-mcp
