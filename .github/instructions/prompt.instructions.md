---
description: 'Guidelines for creating high-quality prompt files for GitHub Copilot'
applyTo: '.github/prompts/*.prompt.md'
---

# Copilot Prompt Files Guidelines (Noise-Reduced)

Use this file to keep prompt files deterministic and compact.

## Frontmatter

Recommended fields:

| Field | Purpose |
| --- | --- |
| `description` | One-sentence prompt intent |
| `name` | Slash command name |
| `agent` | `ask`, `edit`, `agent`, or custom agent |
| `model` | Optional fixed model |
| `tools` | Least-privilege tool list |
| `argument-hint` | User input hint |

## Body Template

1. Mission
2. Preconditions
3. Inputs
4. Workflow
5. Output expectations
6. Validation

## Input Rules

- Use `${input:var}` for required user-provided values.
- Use `${selection}`, `${file}`, `${workspaceFolder}` only when necessary.
- Define fallback behavior when required input is missing.

## Tool Rules

- Keep `tools` minimal.
- Mention destructive steps explicitly (edits, file create, terminal actions).
- If order matters, state execution order in workflow steps.

## Anti-Noise Rules

- Avoid long background explanations.
- Link external docs rather than copying them.
- Avoid duplicating guidance already covered by instruction files.

## Quality Checklist

- [ ] Frontmatter valid and complete
- [ ] Inputs and fallbacks explicit
- [ ] Output format and target path explicit
- [ ] Validation steps executable

## References

- https://code.visualstudio.com/docs/copilot/customization/prompt-files#_prompt-file-format
- https://github.com/github/awesome-copilot/tree/main/prompts
- https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode#_agent-mode-tools
