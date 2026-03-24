---
name: vscode-copilot-skillbook
description: Route VS Code Copilot and customization questions to the right skill. Use when the user wants a skillbook for agents, customizations, context engineering, testing, debugging, TypeScript workflows, or tasks authoring in VS Code.
user-invocable: true
disable-model-invocation: true
---

# VS Code Copilot Skillbook

Use this skill as the entry point for the VS Code and Copilot skill library in this repository.

## When to Use This Skill

- The user asks for a Copilot or VS Code skillbook
- The user is not sure which skill applies
- The request spans multiple Copilot customization topics
- The user wants a guided map of agent, customization, testing, TypeScript, or tasks capabilities

## Routing Map

- Use [vscode-agent-foundations](../vscode-agent-foundations/SKILL.md) for Ask, Agent, Plan, memory, tools, subagents, sessions, and smart actions.
- Use [vscode-customization-architecture](../vscode-customization-architecture/SKILL.md) for instructions, prompts, agents, skills, MCP servers, and hooks.
- Use [vscode-context-engineering](../vscode-context-engineering/SKILL.md) for layered project context, planning workflows, and implementation handoffs.
- Use [vscode-testing-debugging-browser](../vscode-testing-debugging-browser/SKILL.md) for test generation, failing tests, debugging setup, browser-agent validation, and closed-loop fix workflows.
- Use [vscode-typescript-workbench](../vscode-typescript-workbench/SKILL.md) for tsconfig, transpilation, refactoring, imports, source maps, and launch.json alignment.
- Use [vscode-tasks-authoring](../vscode-tasks-authoring/SKILL.md) for tasks.json design, problem matchers, background tasks, and build or test task grouping.

## Workflow

1. Classify the request into one or more capability areas.
2. Choose the narrowest matching skill first.
3. If the request spans multiple areas, use this skill to sequence the work rather than collapsing everything into one broad answer.
4. Keep the response explicit about which specialized skill should be applied next.

## Output Expectations

When using this skill, return:

1. the request category,
2. the recommended skill,
3. why it is the best fit,
4. and any secondary skill that may be needed afterward.