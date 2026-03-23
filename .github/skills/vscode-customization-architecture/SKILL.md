---
name: vscode-customization-architecture
description: Design VS Code Copilot customizations correctly. Use when deciding between custom instructions, prompt files, custom agents, agent skills, MCP servers, hooks, or customization layering in a repository.
---

# VS Code Customization Architecture

Use this skill when the task is to design or review how AI behavior is customized in VS Code.

## When to Use This Skill

- Deciding whether something belongs in instructions, prompts, agents, or skills
- Designing repository-level AI customization structure
- Adding MCP servers or hooks
- Reviewing why a customization is not being discovered
- Building a layered Copilot workflow for a team

## Decision Rules

- Use custom instructions for always-on standards and conventions.
- Use prompt files for lightweight slash-command workflows.
- Use custom agents for personas, tool restrictions, model selection, and handoffs.
- Use skills for portable capabilities, multi-step procedures, and bundled resources.
- Use MCP servers when the AI needs external tools, APIs, resources, or prompts.
- Use hooks for deterministic enforcement, auditing, and approval policy.

## Workflow

1. Normalize the request into one of the customization types.
2. Separate always-on rules from task-specific workflows.
3. Keep instructions concise and stable.
4. Keep skills focused, discoverable, and explicit in their description.
5. Recommend diagnostics if discovery or applyTo behavior seems wrong.

## Guardrails

- Do not put project coding standards into skills if they belong in instructions.
- Do not use a custom agent when a prompt file is enough.
- Do not create a huge umbrella skill with weak discovery metadata.
- Do not assume MCP is only about tools; it can also provide resources, prompts, and apps.

## Output Expectations

When using this skill, return:

1. the correct customization type,
2. why other types are a worse fit,
3. the recommended file location,
4. any discovery or security considerations.