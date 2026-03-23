---
name: vscode-agent-foundations
description: Learn how VS Code agents work and choose the right agent workflow. Use when asked about Ask, Agent, Plan, local agents, planning, memory, tools, subagents, handoffs, or Copilot smart actions in VS Code.
---

# VS Code Agent Foundations

Use this skill when the task is about understanding or designing agent workflows in VS Code.

## When to Use This Skill

- Choosing between Ask, Agent, and Plan
- Explaining local agents versus background or cloud agents
- Planning multi-step work with handoffs
- Understanding memory scopes and when to persist knowledge
- Using tools, approvals, and tool sets
- Deciding when subagents improve context isolation
- Explaining Copilot smart actions and where they fit

## Core Concepts

- Ask: research, explanation, and codebase questions
- Plan: structured implementation planning before code changes
- Agent: autonomous multi-step execution with tools
- Local agents: interactive work in the current workspace
- Session isolation: each session has its own context window
- Memory scopes: user, repository, and session
- Subagents: isolated workers for research, analysis, or review

## Workflow

1. Identify whether the user needs explanation, planning, or execution.
2. If the task is ambiguous, recommend Ask or Plan before Agent.
3. If the task spans multiple files or needs validation, recommend Agent.
4. If the task needs context isolation or parallel analysis, recommend subagents.
5. If the user asks for reusable workflow control, suggest custom agents, prompt files, or skills as the next layer.

## Guardrails

- Do not recommend Agent for a simple conceptual question that Ask can handle.
- Do not recommend Plan for trivial edits that do not need staged execution.
- Do not treat memory as a general knowledge dump; store only durable, relevant context.
- Do not suggest subagents when the task is already narrow and single-purpose.

## Output Expectations

When using this skill, return:

1. the recommended agent mode,
2. why it fits,
3. which tools or permissions matter,
4. whether memory or subagents should be involved.